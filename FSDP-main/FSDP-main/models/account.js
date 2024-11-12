const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Account {
    constructor(id, title, description, creationDate) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.creationDate = creationDate;
    }

    // Helper Function to get New ID
    static async getNextAccountId(accountConnection) {
        const query = `SELECT * FROM Announcement WHERE AnnouncementId=(SELECT max(AnnouncementId) FROM Announcement);`
        const request = accountConnection.request();

        const result = await request.query(query);

        // adjust increment string accordingly
        const incrementString = str => str.replace(/\d+/, num => (Number(num) + 1).toString().padStart(6, "0"));
        return incrementString(result.recordset[0].AccountId);
    }
}

module.exports = Account;