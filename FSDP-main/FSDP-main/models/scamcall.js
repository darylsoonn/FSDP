const sql = require("mssql");
const dbConfig = require("../dbConfig");

class ScamCall {
    constructor(phoneNumber, reportCount) {
        this.phoneNumber = phoneNumber;
        this.reportCount = reportCount;
    }

    // Helper Function to get New ID
    static async getNextScamCallId(scamConnection) {
        const query = `SELECT * FROM ScamCall WHERE ScamCallId=(SELECT max(ScamCallId) FROM ScamCall);`
        const request = scamConnection.request();

        const result = await request.query(query);

        // adjust increment string accordingly
        const incrementString = str => str.replace(/\d+/, num => (Number(num) + 1).toString().padStart(6, "0"));
        return incrementString(result.recordset[0].ScamCallId);
    }

    // Helper Function > check if Scam Call exists
    static async checkScamCall(scamCallConnection, phoneNumber) {
        const query = `SELECT Top 1 PhoneNumber FROM ScamCall WHERE PhoneNumber=@PhoneNumber;`
        const request = scamCallConnection.request();

        request.input('PhoneNumber',phoneNumber)

        const result = await request.query(query);
        const resultStatus = result.length > 0;
        return resultStatus;
    }


    // create new scamcall record or update record 
    static async createScamCallReport(phoneNumber) {
        const connection = await sql.connect(dbConfig);
        const newScamCallId = await ScamCall.checkScamCall(connection, phoneNumber);
        const insertUnixTime = Math.floor(Date.now() / 1000);

        // Create new Record
        const query = `
        INSERT INTO ScamCall (ScamCallId, PhoneNumber, ReportDateTime) 
        VALUES (@ScamCallId, @PhoneNumber, @ReportDateTime)
        `;
        const request = connection.request();

        request.input('ScamCallId',newScamCallId);
        request.input('PhoneNumber',phoneNumber);
        request.input('ReportDateTime',insertUnixTime);

        result = await request.query(query);

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
        const query = `
            SELECT TOP 10 PhoneNumber, COUNT(PhoneNumber) AS ReportCount
            FROM ScamCall 
            GROUP BY PhoneNumber
            ORDER BY ReportCount DESC;
            `
        const request = connection.request();

        const result = await request.query(query);
        connection.close();
        return result;

    }

    // Get Most Reported Calls This week, returns 2 datasets
    static async getScamCallsWeekly() {
        const connection = await sql.connect(dbConfig);
        const today = new Date();
        const sgDate = today.toLocaleDateString("en-SG").split("/").reverse().join("/");
        //console.log(today.toLocaleDateString("en-SG"));
        //console.log(sgDate);

        var query = `
            
            SELECT TOP 10 PhoneNumber, COUNT(PhoneNumber) AS ReportCount
            FROM ScamCall 
            WHERE DATEPART(wk, reportDateTime) = DATEPART(wk, @Date)
            GROUP BY PhoneNumber
            ORDER BY ReportCount DESC;

            SELECT *
            FROM ScamCall
            WHERE DATEPART(wk, reportDateTime) = DATEPART(wk, @Date);
            `;

        const request = connection.request();
        request.input('Date', sgDate);
            
        const result = await request.query(query);
        connection.close();
        return result.recordsets;

    }

    // Get All scam calls this Month, returns 2 datasets
    static async getScamCallsMonthly() {
        const connection = await sql.connect(dbConfig);
        const today = new Date();
        const sgDate = today.toLocaleDateString("en-SG").split("/").reverse().join("/");

        const query = `
            SELECT TOP 10 PhoneNumber, COUNT(PhoneNumber) AS ReportCount
            FSELECT TOP 10 PhoneNumber, COUNT(PhoneNumber) AS ReportCount
            FROM ScamCall 
            WHERE MONTH(reportDateTime) = MONTH(@Date) 
            GROUP BY PhoneNumber
            ORDER BY ReportCount DESC;

            SELECT *
            FROM ScamCall
            WHERE MONTH(reportDateTime) = MONTH(@Date) ;
            `;

        const request = connection.request();
        request.input('Date', sgDate);

        const result = await request.query(query);
        connection.close();
        return result.recordsets;
    }

}

module.exports = ScamCall;