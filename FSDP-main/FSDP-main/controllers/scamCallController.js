const ScamCall = require("../models/scamcall")

const reportNumber = async (req, res) =>{
    try {
        const {phoneNumber} = req.body;
        console.log(phoneNumber);

        const reportNumber = await ScamCall.createScamCallReport(phoneNumber);

        if(reportNumber == 0) {
            res.status(500).json({
                message: `Failed to create reported number record`
            });
            return;
        }
        res.status(201).json({
            message: `ScamCall has been reported`
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

const getScamCalls = async (req, res) => {
    try {
        const scamCalls = await ScamCall.getScamCalls();

        if (!scamCalls || !Array.isArray(scamCalls)) {
            res.status(404).json({
                message: "Failed to get scam calls",
            });
            return;
        }

        res.status(200).json({
            message: "Scam calls successfully returned",
            recordset: scamCalls,  // Ensure this field is returned
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err,
        });
    }
};

const getScamCallsWeekly = async (req, res) => {
    try {
        const scamCalls = await ScamCall.getScamCallsWeekly();

        if (!scamCalls) {
            res.status(404).json({
                message: `Failed to get any scam calls`
            });
            return;
        }

        res.status(201).json({
            message: `Scam calls succesfully returned`,
            scamCalls: scamCalls
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

const searchScamCall = async (req, res) => {
    try {
        const { phoneNumber } = req.query;

        if (!phoneNumber) {
            res.status(400).json({ message: "Phone number is required" });
            return;
        }

        const scamCall = await ScamCall.getScamCallByNumber(phoneNumber);

        if (!scamCall || scamCall.recordset.length === 0) {
            res.status(404).json({ message: "No record found for the provided phone number" });
            return;
        }

        res.status(200).json({
            message: "Scam call record found",
            recordset: scamCall.recordset,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err,
        });
    }
};

const getScamCallsMonthly = async (req, res) => {
    try {
        const scamCalls = await ScamCall.getScamCallsMonthly();

        if (!scamCalls) {
            res.status(404).json({
                message: `Failed to get any scam calls`
            });
            return;
        }

        res.status(201).json({
            message: `Scam calls succesfully returned`,
            scamCalls: scamCalls
        });
    }catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err
        });
    }
}

const getHeatmapData = async (req, res) => {
    try {
        const heatmapData = await ScamCall.getHeatmapData();
        if (!heatmapData || heatmapData.length === 0) {
            return res.status(404).json({ message: 'No heatmap data found' });
        }
        res.status(200).json(heatmapData); // Return the full dataset
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error', error: err });
    }
};

module.exports = {
    reportNumber,
    getScamCalls,
    getScamCallsWeekly,
    getScamCallsMonthly,
    searchScamCall,
    getHeatmapData,
}
