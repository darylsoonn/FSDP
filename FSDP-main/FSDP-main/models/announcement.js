const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Announcement {
    constructor(id, title, description, creationDate) {
        this.Announcementid = id;
        this.title = title;
        this.description = description;
        this.creationDate = creationDate;
    }

    // Helper Function to get New ID
    static async getNextAnnouncementId(announcementConnection) {
        const query = `SELECT * FROM Announcement WHERE AnnouncementId=(SELECT max(AnnouncementId) FROM Announcement);`
        const request = announcementConnection.request();

        const result = await request.query(query);

        // adjust increment string accordingly
        const incrementString = str => str.replace(/\d+/, num => (Number(num) + 1).toString().padStart(4, "0"));
        return incrementString(result.recordset[0].AppointmentId);
    }

    // Create Announcement
    static async createAnnouncement(title, description) {
        const connection = await sql.connect(dbConfig);
        const newAnnouncementId = await Announcement.getNextAnnouncementId(connection)
        const insertUnixTime = Math.floor(Date.now() / 1000);


        const query = `
            INSERT INTO Announcement (AnnouncementId, Title, DescriptionDetails, CreationDate) 
            VALUES (@AnnouncementId, @Title, @DescriptionDetails, @CreationDate)
        `;

        const request = connection.request();
        request.input('AnnouncementId', newAnnouncementId);
        request.input('Title', title);
        request.input('DescriptionDetails', description);
        request.input('CreationDate', insertUnixTime);

        await request.query(query);

        connection.close();

        return new Announcement(newAnnouncementId, title, description, insertUnixTime);
    }

    // Get Announcements by latest Dates
    static async getMostRecentAnnouncements() {
        const connection = await sql.connect(dbConfig);
        const query = 
            `SELECT TOP 10 *
            FROM Announcement
            ORDER BY CreationDate DESC`;

        const request = connection.request();

        const result = await request.query(query);
        return result.recordset;
    }

}

module.exports = Announcement;