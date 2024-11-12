const express = require("express");
const cors = require("cors");
const sql = require("mssql");
const path = require("path");
const dbConfig = require("./dbConfig");

// Controllers
const announcementController = require("./controllers/announcementController");
const faqController = require("./controllers/faqController");
const scamCallController = require("./controllers/scamCallController");

const app = express();

app.use(cors());
app.use(express.json()); // Add this line to parse JSON payloads
app.use(express.urlencoded({ extended: true })); // Add this for URL-encoded form data
app.use(express.static(path.join(__dirname)));

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/announcements", announcementController.getRecentAnnouncements);
app.post("/api/announcement", announcementController.createAnnouncement);

app.get("/api/faqs", faqController.getQuestions);
app.post("/api/faq", faqController.addQuestion);

app.get("/api/scamcalls", scamCallController.getScamCalls);
app.get("/api/scamcalls/weekly", scamCallController.getScamCallsWeekly)
app.get("/api/scamcalls/monthly", scamCallController.getScamCalls)
app.post("/api/scamcall", scamCallController.reportNumber);

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
