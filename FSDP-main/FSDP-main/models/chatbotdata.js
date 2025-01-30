const sql = require("mssql");
const dbConfig = require("../dbConfig");

class ChatBotData {
    constructor(dataId, categoryId, categoryDesc) {
        this.dataId = dataId;
        this.categoryId = categoryId;
        this.categoryDesc = categoryDesc;
    }

    // Helper Function to get New ID
    static async getNextDataID(chatbotConnection) {
        const query = `SELECT * FROM Announcement WHERE AnnouncementId=(SELECT max(AnnouncementId) FROM Announcement);`
        const request = chatbotConnection.request();

        const result = await request.query(query);

        // adjust increment string accordingly
        const incrementString = str => str.replace(/\d+/, num => (Number(num) + 1).toString().padStart(6, "0"));
        return incrementString(result.recordset[0].ChatBotDataID);
    }
}

module.exports = ChatBotData;