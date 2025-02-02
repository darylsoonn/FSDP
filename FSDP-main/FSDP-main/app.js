const express = require("express");
const cors = require("cors");
const sql = require("mssql");
const path = require("path");
const multer = require("multer");
const { spawn } = require("child_process"); // To interact with Python
const fs = require("fs");
const dbConfig = require("./dbConfig");

const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: { origin: "*" }
});


// Controllers
const announcementController = require("./controllers/announcementController");
const faqController = require("./controllers/faqController");
const scamCallController = require("./controllers/scamCallController");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(express.static(path.join(__dirname)));

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/announcements", announcementController.getRecentAnnouncements);
app.post("/api/announcement", announcementController.createAnnouncement);

app.get("/api/faqs", faqController.getQuestions);
app.post("/api/faq", faqController.addQuestion);

app.get("/api/scamcalls", scamCallController.getScamCalls);
app.get("/api/scamcalls/weekly", scamCallController.getScamCallsWeekly);
app.get("/api/scamcalls/monthly", scamCallController.getScamCalls);
app.post("/api/scamcall/report", scamCallController.reportNumber);
app.get("/api/scamcall/search", scamCallController.searchScamCall);
app.get('/api/heatmap-data', scamCallController.getHeatmapData);
app.get("/api/scamcalls/all", scamCallController.getAllScamPhoneNumbers);


// Add endpoint for fetching OCBC branches
app.get('/api/ocbc-branches', async (req, res) => {
    const fetch = require('node-fetch'); // Ensure node-fetch is installed
    const OCBC_API_URL = 'https://api.ocbc.com:443/branch_locator/1.1/*?category=2&country=SG';
    const AUTH_TOKEN = process.env.OCBC_API_TOKEN || 'YOUR_DEFAULT_TOKEN_HERE'; // Use environment variable for the token

    try {
        const response = await fetch(OCBC_API_URL, {
            method: 'GET',
            headers: {
                Authorization: AUTH_TOKEN,
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`API Request Failed: ${response.statusText}`);
        }

        const data = await response.json();
        const branches = data.branchesAndCentresList.map((branch) => ({
            name: branch.landmark || 'Unknown Branch',
            address: branch.address,
            latitude: branch.latitude,
            longitude: branch.longitude,
            openingHours: branch.openingHours || 'N/A',
            remark: branch.remark || '',
        }));

        res.json(branches);
    } catch (error) {
        console.error("Error fetching branches from API:", error.message);

        // Load from local JSON file as a fallback
        const filePath = path.join(__dirname, "response_1737382161569.json");
        try {
            const localData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
            const branches = localData.branchesAndCentresList.map((branch) => ({
                name: branch.landmark || 'Unknown Branch',
                address: branch.address,
                latitude: branch.latitude,
                longitude: branch.longitude,
                openingHours: branch.openingHours || 'N/A',
                remark: branch.remark || '',
            }));
            res.json(branches);
        } catch (fileError) {
            console.error("Error reading fallback JSON file:", fileError.message);
            res.status(500).json({ error: "Failed to load branch data from both API and fallback file." });
        }
    }
});


//chatgpt watson fix
app.post("/api/storePhoneNumber", (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    console.log("Received Phone Number:", phoneNumber);

    // Handle the phone number as needed (e.g., store in a database)
    res.json({ message: "Phone number received", phoneNumber });
});

// Notify index.html to refresh announcements
app.post("/api/trigger-update", (req, res) => {
    res.status(200).send("Trigger update received");
});

// Transcription Endpoint
app.post("/api/transcribe", upload.single("audio"), (req, res) => {
    const filePath = path.resolve(req.file.path);

    // Spawn the Python process
    const pythonProcess = spawn("python", ["app.py", filePath]);

    let output = "";
    pythonProcess.stdout.on("data", (data) => {
        output += data.toString();
    });

    pythonProcess.stderr.on("data", (error) => {
        console.error("Python Error:", error.toString());
    });

    pythonProcess.on("close", (code) => {
        // Delete the uploaded file after processing
        fs.unlink(filePath, (err) => {
            if (err) console.error("Failed to delete file:", err);
        });

        if (code === 0) {
            try {
                const result = JSON.parse(output);
                res.json(result);
            } catch (err) {
                res.status(500).json({ error: "Failed to parse Python response" });
            }
        } else {
            res.status(500).json({ error: "Python process failed" });
        }
    });
});

// Increase the max listeners limit to avoid the warning
http.setMaxListeners(20); // This can be applied to the http server

// For Socket.io, increase max listeners on the server as well
io.setMaxListeners(20); // Avoids issues with socket.io events

// Initialize Server
app.listen(3000, async () => {
    console.log("Server running at http://localhost:3000");

    try {
        await sql.connect(dbConfig);
        console.log("Connected to Database");
    } catch (err) {
        console.error("Database connection failed:", err);
    }
});

// Initialazing Websocket Server
// Store user information and their chats
const users = {}; // Stores socket ID -> username
const availableStaff = new Set(["Alice"]); // Only Alice is available
const waitingQueue = []; // Queue of customers waiting for Alice
const chatHistory = []; // Holds the chat messages

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Send the chat history to the newly connected client
    socket.emit('chat_history', chatHistory);

    // Request the client's name
    socket.emit('request_name'); // Ping the client to set their name

    // Listen for the 'set_name' event when the user provides a name
    socket.on('set_name', (name) => {
        if (!users[socket.id]) { // Ensure we don't overwrite the name if it's already set
            users[socket.id] = name; // Store the name associated with this socket
            console.log(`${name} is now connected with socket ID: ${socket.id}`);
            // Emit the name acknowledgment
            socket.emit('name_acknowledged'); // Confirm name to client
            // Broadcast the user list to everyone (only Alice)
            io.emit('available_staff', Array.from(availableStaff));
        }
    });

    // Handle messages from the client
    socket.on('message', (staffName, message) => {
        const chatKey = `${socket.id}_${staffName}`;

        // Emit message to the appropriate staff and customer
        io.emit("message", staffName, message);
    });

    // Handle disconnection and remove the user from the list
    socket.on('disconnect', () => {
        console.log(`${users[socket.id]} disconnected.`);
        delete users[socket.id]; // Remove user from the list

        // If the user was waiting for a staff member, remove them from the queue
        const index = waitingQueue.indexOf(socket.id);
        if (index !== -1) {
            waitingQueue.splice(index, 1);
        }
    });

    // Handle staff joining the chat
    socket.on('staff_joined', (staffName) => {
        availableStaff.delete(staffName); // Set staff as unavailable
        // Assign customers to Alice
        if (waitingQueue.length > 0) {
            const customerSocketId = waitingQueue.shift();
            const customerName = users[customerSocketId];
            io.to(customerSocketId).emit('available_staff', ['Alice']);
        } else {
            io.emit('available_staff', ['Alice']);
        }
    });
});

http.listen(8080, () => console.log('WebSocket listening on http://localhost:8080'));




// Graceful shutdown for the server
process.on("SIGINT", async () => {
    console.log("Server is shutting down...");

    // Close WebSocket server
    io.close(() => {
        console.log("WebSocket server has shut down.");
    });

    // Close the HTTP server
    http.close(() => {
        console.log("HTTP server has shut down.");
        process.exit(0); // Exit the process
    });

    // Close the database connection
    await sql.close();
    console.log("Database connection closed.");
});