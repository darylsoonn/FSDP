const Question = require("../models/question");

const addQuestion = async (req, res) => {
try {
    const {title, answer, catId} = req.body;

    const question = Question.createQuestion(title, answer, catId)

    // check if question exists
    if (!question) {

    }

} catch (err) {
    console.error(err);
    res.status(500).json({
        status: "Error",
        message: "Internal Server Error",
        error: err
    });
}
}

const getQuestions = async (req, res) => {
try {

    const commonQuestions = Question.getQuestions();
    
    if (!commonQuestions) {
        res.status(404).json({
            message: `Failed to get any notifications, notifications do not exist for this user`
        });
        return;
    }

    res.status(200).json({
        message: "FAQ questions returned Successfully",
        FAQ: commonQuestions
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

module.exports = {
    addQuestion,
    getQuestions,
}