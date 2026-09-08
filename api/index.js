const app = require("../server/server");
const connectDB = require("../server/config/db");

module.exports = async (req, res) => {
    try {
        await connectDB();
    } catch (err) {
        console.warn("Serverless DB connection initial notice:", err.message);
    }
    return app(req, res);
};
