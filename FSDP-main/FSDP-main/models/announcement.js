const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Announcement {
    constructor(id, title, description, creationDate) {
        this.AnnouncementId = id;
        this.title = title;
        this.description = description;
        this.creationDate = creationDate;
    }

    // Helper Function to get New ID
    static async getNextAnnouncementId(announcementConnection) {
        const query = `SELECT MAX(AnnouncementId) AS MaxId FROM Announcement`;
        const request = announcementConnection.request();
        const result = await request.query(query);

        const currentMaxId = result.recordset[0].MaxId || "ANN000000";
        const incrementedId = currentMaxId.replace(/\d+$/, (num) =>
            (parseInt(num) + 1).toString().padStart(6, "0")
        );

        return incrementedId;
    }

    // Create Announcement
    static async createAnnouncement(title, description) {
        const connection = await sql.connect(dbConfig);
        const newAnnouncementId = await Announcement.getNextAnnouncementId(connection);

        // Use a proper date format
        const insertDate = new Date().toISOString().slice(0, 19).replace("T", " ");

        const query = `
            INSERT INTO Announcement (AnnouncementId, Title, DescriptionDetails, CreationDate) 
            VALUES (@AnnouncementId, @Title, @DescriptionDetails, @CreationDate)
        `;

        const request = connection.request();
        request.input("AnnouncementId", newAnnouncementId);
        request.input("Title", title);
        request.input("DescriptionDetails", description);
        request.input("CreationDate", insertDate);

        await request.query(query);

        connection.close();

        return new Announcement(newAnnouncementId, title, description, insertDate);
    }

    // Get Announcements by latest Dates
    static async getMostRecentAnnouncements() {
        const connection = await sql.connect(dbConfig);
        const query = `
            SELECT TOP 10 *
            FROM Announcement
            ORDER BY CreationDate DESC
        `;

        const request = connection.request();
        const result = await request.query(query);

        connection.close();
        return result.recordset;
    }

    // Edit Announcement by ID
    static async updateAnnouncement(id, title, details) {
        const connection = await sql.connect(dbConfig);
        const query = `
            UPDATE Announcement
            SET Title = @Title, DescriptionDetails = @Details
            WHERE AnnouncementId = @Id
        `;

        const request = connection.request();
        request.input('Title', title);
        request.input('Details', details);
        request.input('Id', id);

        const result = await request.query(query);

        connection.close();
        return result;
    }
}

module.exports = Announcement;
