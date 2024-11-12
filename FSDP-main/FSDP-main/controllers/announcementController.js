const Announcement = require("../models/announcement");

const createAnnouncement = async (req, res) => {
    try {
        console.log(req.body); // Log the request body for debugging
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                message: "Title and description are required",
            });
        }

        const newAnnouncement = await Announcement.createAnnouncement(title, description);

        if (newAnnouncement) {
            res.status(201).json({
                message: "Announcement created successfully",
                announcement: newAnnouncement,
            });
        } else {
            res.status(500).json({
                message: "Failed to create announcement",
            });
        }
    } catch (error) {
        console.error("Error creating announcement:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: error,
        });
    }
};



const getRecentAnnouncements = async (req, res) => {
    try {
        const recentAnnouncements = await Announcement.getMostRecentAnnouncements();

        if (!recentAnnouncements) {
            res.status(404).json({
                message: `Failed to get any announcements`
            });
            return;
        }
        res.status(200).json({
            message: "Announcements returned Successfully",
            Announcements: recentAnnouncements
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err
        });
    }
}

module.exports = {
    createAnnouncement,
    getRecentAnnouncements,
};
