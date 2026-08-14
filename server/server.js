const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.json({
        message: "LOOP MERN API is running"
    });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/members", require("./routes/memberRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/themes", require("./routes/themeRoutes"));
app.use("/api/insights", require("./routes/insightRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/import", require("./routes/importRoutes"));

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    connectDB()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Server running on http://localhost:${PORT}`);
            });
        })
        .catch((error) => {
            console.error("Database connection error:", error);
        });
} else {
    connectDB();
}

module.exports = app;