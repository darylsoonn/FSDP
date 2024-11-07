const sql = require("mssql");
const dbConfig = require("../dbConfig");

class ScamCall {
    constructor(phoneNumber, reportCount) {
        this.phoneNumber = phoneNumber;
        this.reportCount = reportCount;
    }

    // Helper Function > check if Scam Call exists
    static async checkScamCall(scamCallConnection, phoneNumber) {
        const query = `SELECT * FROM ScamCall WHERE PhoneNumber=@PhoneNumber;`
        const request = scamCallConnection.request();

        request.input('PhoneNumber',phoneNumber)

        const result = await request.query(query);
        const resultStatus = result.length > 0;
        return resultStatus;
    }


    // create new scamcall record or update record 
    static async createScamCallReport(phoneNumber) {
        const connection = await sql.connect(dbConfig);
        const scamCallExists = await ScamCall.checkScamCall(connection, phoneNumber);

        if (scamCallExists) {
            const query = `UPDATE ScamCall SET ReportCount = ReportCount + 1 WHERE PhoneNumber=@PhoneNumber`;
            const request = connection.request();
            var result = null;
            request.input('PhoneNumber',phoneNumber)

            result = await request.query(query);
        } else {
            // Create new Record
            const ReportCount = 1;
            const query = `
            INSERT INTO ScamCall (PhoneNumber, ReportCount) 
            VALUES (@PhoneNumber, @ReportCount)
            `;
            const request = connection.request();

            request.input('PhoneNumber',phoneNumber);
            request.input('ReportCount',ReportCount);

            result = await request.query(query);
        }
        connection.close();

        return result.recordset;
        
    }

    // Get Call
    static async getScamCallByNumber(phoneNumber) {
        const connection = await sql.connect(dbConfig);
        const query = `SELECT * FROM ScamCall WHERE PhoneNumber LIKE '%' + @PhoneNumber + '%'`
        const request = connection.request();
        request.input('PhoneNumber',phoneNumber);

        result = await request.query(query);
        return result;


    }

    // Get Most Reported Calls
    static async getScamCalls() {
        const connection = await sql.connect(dbConfig);
        const query = `SELECT TOP 10 * FROM ScamCall ORDER BY ReportCount Desc`
        const request = connection.request();

        result = await request.query(query);
        return result;

    }

}

module.exports = ScamCall;