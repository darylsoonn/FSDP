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
        const incrementString = str => str.replace(/\d+/, num => (Number(num) + 1).toString().padStart(5, "0"));
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
        const newScamCallId = await ScamCall.getNextScamCallId(connection);
                
        const today = new Date();
        const sgDate = today.toLocaleDateString("en-SG").split("/").reverse().join("/");
        const insertUnixTime = Math.floor(Date.now() / 1000);

        // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds
        var date = new Date(insertUnixTime * 1000);

        // Hours part from the timestamp
        var hours = date.getHours();

        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();

        // Seconds part from the timestamp
        var seconds = "0" + date.getSeconds();

        // Will display time in 10:30:23 format
        var formattedTime =sgDate + ' '+  hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

        // Create new Record
        const query = `
        INSERT INTO ScamCall (ScamCallId, PhoneNumber, ReportDateTime) 
        VALUES (@ScamCallId, @PhoneNumber, @ReportDateTime)
        `;
        const request = connection.request();

        request.input('ScamCallId',newScamCallId);
        request.input('PhoneNumber',phoneNumber);
        request.input('ReportDateTime',formattedTime);

        const result = await request.query(query);

        connection.close();

        return result.rowsAffected;
        
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
        return result.recordset;

    }

    static async getScamCallByNumber(phoneNumber) {
        const connection = await sql.connect(dbConfig);
        const query = `SELECT PhoneNumber, COUNT(*) AS ReportCount FROM ScamCall WHERE PhoneNumber LIKE '%' + @PhoneNumber + '%' GROUP BY PhoneNumber`;
        const request = connection.request();
        request.input("PhoneNumber", phoneNumber);
    
        const result = await request.query(query);
        connection.close();
        return result;
    }

    static async getAllScamPhoneNumbers() {
        try {
            const connection = await sql.connect(dbConfig);
            const query = `
                SELECT PhoneNumber
                FROM ScamCall
                GROUP BY PhoneNumber
                HAVING COUNT(PhoneNumber) > 3
                ORDER BY PhoneNumber ASC;
            `;
            const request = connection.request();
    
            const result = await request.query(query);
            connection.close();
            
            return result.recordset; // Returns only numbers with more than 10 reports
        } catch (error) {
            console.error("Error retrieving frequently reported scam numbers:", error);
            throw error;
        }
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

    static async getHeatmapData({ startDate, endDate, scamType }) {
        const connection = await sql.connect(dbConfig);
        let query = `
            SELECT id, scam_type, description, latitude, longitude, timestamp
            FROM ScamReports
            WHERE latitude IS NOT NULL AND longitude IS NOT NULL
        `;
    
        // Dynamically append filters
        if (startDate) query += ` AND timestamp >= @startDate`;
        if (endDate) query += ` AND timestamp <= @endDate`;
        if (scamType) query += ` AND scam_type LIKE '%' + @scamType + '%'`;
    
        console.log("Constructed SQL query:", query); // Debug
    
        const request = connection.request();
    
        if (startDate) request.input("startDate", sql.DateTime, new Date(startDate));
        if (endDate) request.input("endDate", sql.DateTime, new Date(endDate));
        if (scamType) request.input("scamType", sql.VarChar, scamType);
    
        const result = await request.query(query);
        connection.close();
        return result.recordset;
    }                

}

module.exports = ScamCall;
