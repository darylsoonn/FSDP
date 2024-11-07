const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Question {
    constructor(questionId, categoryId, title, answer) {
        this.questionId = questionId;
        this.CategoryId = categoryId;
        this.title = title;
        this.answer = answer;
    }

    // Helper Function to get New ID
    static async getNextQuestionId(announcementConnection) {
        const query = `SELECT * FROM Question WHERE QuestionId=(SELECT max(QuestionId) FROM Question);`
        const request = announcementConnection.request();

        const result = await request.query(query);

        // adjust increment string accordingly
        const incrementString = str => str.replace(/\d+/, num => (Number(num) + 1).toString().padStart(4, "0"));
        return incrementString(result.recordset[0].AppointmentId);
    }

    // Create Question
    static async createQuestion(categoryId, title, answer) {
        const connection = await sql.connect(dbConfig);
        const query = `
            INSERT INTO Question (QuestionId, CategoryId, QuestionTitle, QuestionAnswer)
            VALUES (@QuestionId, @CategoryId, @QuestionTitle, @QuestionAnswer)
        `;

        const request = connection.request();
        request.input('AnnouncementId', newAnnouncementId);
        request.input('Title', title);

        connection.close();
    }

    // Get Question
    static async getQuestion() {
        const connection = await sql.connect(dbConfig);
        const query = `SELECT * FROM Question`
        const request = connection.request();
        const result = await request.query(query);
        return result.recordset;
    }

    // Get Questions
    static async getQuestions() {
        const connection = await sql.connect(dbConfig);
        const query = `
            SELECT TOP 10 q.QuestionTitle, q.QuestionAnswer, COUNT(q.QuestionId) AS QuestionCount
            FROM Question q
            INNER JOIN ChatbotData cbd ON q.CategoryId = cbd.DataId
            GROUP BY cbd.CategoryDesc, q.QuestionTitle, q.QuestionAnswer
            ORDER BY QuestionCount DESC;`

        const request = connection.request();
        const result = await request.query(query);
        return result.recordset;
    }
}

module.exports = Question;