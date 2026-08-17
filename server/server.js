const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Database connection middleware for Serverless / Cloud environments
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error("Database connection middleware error:", err.message);
        return res.status(500).json({
            message: "Database connection failed. Please ensure MONGO_URI is configured correctly in environment variables."
        });
    }
});

app.get("/", (req, res) => {
    res.json({
        status: "online",
        message: "Project LOOP MERN API is running"
    });
});

app.get("/api", (req, res) => {
    res.json({
        status: "online",
        message: "Project LOOP MERN API is running"
    });
});

// Route imports
const authRoutes = require("./routes/authRoutes");
const memberRoutes = require("./routes/memberRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const aiRoutes = require("./routes/aiRoutes");
const themeRoutes = require("./routes/themeRoutes");
const insightRoutes = require("./routes/insightRoutes");
const reportRoutes = require("./routes/reportRoutes");
const importRoutes = require("./routes/importRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

// Mount under both /api/... and root /... for bulletproof Vercel / serverless routing
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/members", memberRoutes);
app.use("/members", memberRoutes);

app.use("/api/feedback", feedbackRoutes);
app.use("/feedback", feedbackRoutes);

app.use("/api/dashboard", dashboardRoutes);
app.use("/dashboard", dashboardRoutes);

app.use("/api/ai", aiRoutes);
app.use("/ai", aiRoutes);

app.use("/api/themes", themeRoutes);
app.use("/themes", themeRoutes);

app.use("/api/insights", insightRoutes);
app.use("/insights", insightRoutes);

app.use("/api/reports", reportRoutes);
app.use("/reports", reportRoutes);

app.use("/api/import", importRoutes);
app.use("/import", importRoutes);

app.use("/api/analytics", analyticsRoutes);
app.use("/analytics", analyticsRoutes);

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
    connectDB()
        .then(() => {
            app.listen(PORT, "0.0.0.0", () => {
                console.log(`Server running on port ${PORT}`);
            });
        })
        .catch((error) => {
            console.error("Database connection error:", error);
        });
}

module.exports = app;