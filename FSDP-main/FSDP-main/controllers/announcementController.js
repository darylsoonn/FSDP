const Announcement = require("../models/announcement");

const createAnnouncement = async (req, res) => {
    try {
        const {title, description} = req.body;

        // Create a new announcement
        const createAnnouncement = await Announcement.createAnnouncement(title, description)

        if (!createAnnouncement) {
            res.status(500).json({
                message: `Failed to create Announcement`
            })
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error - Scold Emmanuel",
            error: err,
        });
    }
}

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
