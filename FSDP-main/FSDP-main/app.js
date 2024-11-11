const express = require("express");
const cors = require("cors");
const sql = require("mssql");
const path = require("path");
const dbConfig = require("./dbConfig");
const { CloudantV1 } = require('@ibm-cloud/cloudant');

// Controllers
const announcementController = require("./controllers/announcementController");
const faqController = require("./controllers/faqController");
const scamCallController = require("./controllers/scamCallController");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// API Routes
app.get("/api/announcements", announcementController.getRecentAnnouncements);
app.post("/api/announcement", announcementController.createAnnouncement);

app.get("/api/faqs", faqController.getQuestions);
app.post("/api/faq", faqController.addQuestion);


app.get("/api/scamcalls", scamCallController.getScamCalls);
app.post("/api/scamcall", scamCallController.reportNumber);
//chatgpt watson fix
app.post("/api/storePhoneNumber", (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    console.log("Received Phone Number:", phoneNumber);
  
    // Handle the phone number as needed (e.g., store in a database)
    res.json({ message: "Phone number received", phoneNumber: phoneNumber });
  });


// Initialise Server
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
