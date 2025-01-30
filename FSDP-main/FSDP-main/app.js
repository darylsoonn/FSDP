const express = require("express");
const cors = require("cors");
const sql = require("mssql");
const path = require("path");
const multer = require("multer");
const { spawn } = require("child_process"); // To interact with Python
const fs = require("fs");
const dbConfig = require("./dbConfig");

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

// Graceful shutdown for the server
process.on("SIGINT", async () => {
    console.log("Server is shutting down");
    await sql.close();
    console.log("Database connection closed");
    process.exit(0);
});
