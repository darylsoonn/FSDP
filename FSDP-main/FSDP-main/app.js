const express = require("express");
const sql = require("mssql");
const bodyParser = require("body-parser");
const dbConfig = require("./dbConfig");

// possible JWT

// Controller
const announcementController = require("./controllers/announcementController")
const faqController = require("./controllers/faqController")
const scamCallController = require("./controllers/scamCallController")
const app = express();

// Routes
app.get("/api/announcements", announcementController.getRecentAnnouncements)
app.post("/api/announcement", announcementController.createAnnouncement)

app.get("/api/faqs",faqController.getQuestions)
app.post("/api/faq", faqController.addQuestion)

app.get("/api/scamcalls", scamCallController.getScamCalls)
app.post("/api/scamcall", scamCallController.reportNumber)


// Initialise Server
app.listen(3000, async () => {
    console.log("FSDP listening on port 3000.")

    try {
        await sql.connect(dbConfig);
        console.log("Established connection to Database");
    } catch (err) {
        console.error("Database connection failed:", err);
    }
});

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
    console.log("Server is gracefully shutting down");
    await sql.close();
    console.log("Database connection closed");
    process.exit(0);
});