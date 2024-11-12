const ScamCall = require("../models/scamcall")

const reportNumber = async (req, res) =>{
    try {
        const {phoneNumber} = req.params;

        const reportNumber = await ScamCall.createScamCallReport(phoneNumber);

        if(!reportNumber) {
            res.status(500).json({
                message: `Failed to create or update reported number`
            });
            return;
        }
        res.status(201).json({
            message: `ScamCall with ID ${reportNumber.ScamCallId} has been created.`,
            notification: createNotification
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

    } catch (err){
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err
        });
    }
}

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

module.exports = {
    reportNumber,
    getScamCalls,
    getScamCallsWeekly,
    getScamCallsMonthly,
}