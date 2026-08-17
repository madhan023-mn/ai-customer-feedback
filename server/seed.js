const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const Workspace = require("./models/Workspace");
const User = require("./models/User");
const Feedback = require("./models/Feedback");
const Theme = require("./models/Theme");
const FeedbackTheme = require("./models/FeedbackTheme");
const Embedding = require("./models/Embedding");
const Insight = require("./models/Insight");

const MONGO_URI = process.env.MONGO_URI || process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/loop_db";

const CHANNELS = ["SUPPORT_TICKET", "APP_STORE", "NPS_SURVEY", "SALES_CALL", "COMMUNITY"];

const INITIAL_THEMES = [
    { name: "Checkout Payment Failure", description: "Credit card & payment gateway timeouts during checkout", color: "#ef4444" },
    { name: "Onboarding Latency", description: "Friction and delay during initial user team setup tour", color: "#f59e0b" },
    { name: "Team Invitation Flow", description: "Issues inviting multi-user seat members to workspace", color: "#3b82f6" },
    { name: "Dashboard UI", description: "Performance and satisfaction regarding dashboard layout", color: "#10b981" },
    { name: "Payment Gateway Timeout", description: "Stripe and billing provider latency errors", color: "#8b5cf6" },
    { name: "Mobile App Stability", description: "iOS and Android mobile app crash reports", color: "#ec4899" },
    { name: "Search Filter Speed", description: "Fast filtering across tags and ticket categories", color: "#14b8a6" },
    { name: "Support Ticket SLA", description: "Response times and support agent SLA metrics", color: "#6366f1" },
    { name: "Notification Latency", description: "SMS 2FA and email verification delivery delays", color: "#f97316" },
    { name: "Performance Bottleneck", description: "System latency when aggregating 90-day chart windows", color: "#64748b" }
];

const RAW_FEEDBACK_TEMPLATES = [
    // Onboarding
    { content: "Onboarding took forever — I couldn't figure out how to invite my team members.", channel: "SUPPORT_TICKET", sentiment: "NEG", featureArea: "Onboarding", score: -0.8, themeName: "Team Invitation Flow", confidence: 0.94, rationale: "The customer reports difficulty inviting team members during workspace onboarding setup." },
    { content: "The interactive onboarding tour was crystal clear and got our team set up in 5 minutes!", channel: "NPS_SURVEY", sentiment: "POS", featureArea: "Onboarding", score: 0.9, themeName: "Onboarding Latency", confidence: 0.92, rationale: "Positive reaction praising the interactive onboarding setup tour speed." },
    { content: "Onboarding email sequence links were broken for half of our new signups.", channel: "SUPPORT_TICKET", sentiment: "NEG", featureArea: "Onboarding", score: -0.7, themeName: "Onboarding Latency", confidence: 0.88, rationale: "User reports broken email verification sequence during onboarding." },
    { content: "Step-by-step wizard is decent, but needs a skip button for experienced users.", channel: "COMMUNITY", sentiment: "NEU", featureArea: "Onboarding", score: 0.1, themeName: "Onboarding Latency", confidence: 0.85, rationale: "Usability suggestion requesting a skip button for setup wizard." },

    // Checkout & Payments
    { content: "Checkout page timed out twice while entering credit card billing information.", channel: "SUPPORT_TICKET", sentiment: "NEG", featureArea: "Checkout", score: -0.85, themeName: "Checkout Payment Failure", confidence: 0.96, rationale: "The customer reports repeated payment failures and timeouts during checkout." },
    { content: "Seamless payment checkout experience. Stripe integration is fast and smooth.", channel: "APP_STORE", sentiment: "POS", featureArea: "Checkout", score: 0.95, themeName: "Payment Gateway Timeout", confidence: 0.91, rationale: "Positive review praising Stripe payment gateway performance." },
    { content: "Prospect wants SAML SSO & automated invoice billing before signing annual contract.", channel: "SALES_CALL", sentiment: "NEG", featureArea: "Payments", score: -0.5, themeName: "Payment Gateway Timeout", confidence: 0.89, rationale: "Sales blocker requesting enterprise SAML SSO and invoice billing options." },
    { content: "Can we get Apple Pay and PayPal support on the web checkout screen?", channel: "COMMUNITY", sentiment: "NEU", featureArea: "Payments", score: 0.2, themeName: "Checkout Payment Failure", confidence: 0.87, rationale: "Feature request for additional payment options like Apple Pay and PayPal." },

    // Dashboard & Performance
    { content: "The new dashboard is gorgeous and finally fast! Huge improvement over v1.", channel: "APP_STORE", sentiment: "POS", featureArea: "Dashboard", score: 0.9, themeName: "Dashboard UI", confidence: 0.95, rationale: "Positive feedback praising the dashboard UI redesign and render speed." },
    { content: "Dashboard charts lag significantly when filtering over a 90-day historical window.", channel: "SUPPORT_TICKET", sentiment: "NEG", featureArea: "Performance", score: -0.75, themeName: "Performance Bottleneck", confidence: 0.93, rationale: "Performance friction report regarding chart rendering on 90-day window." },
    { content: "Real-time analytics updates are super helpful during live marketing campaigns.", channel: "NPS_SURVEY", sentiment: "POS", featureArea: "Dashboard", score: 0.85, themeName: "Dashboard UI", confidence: 0.90, rationale: "Positive review for real-time analytics updates during campaigns." },
    { content: "Would love the ability to export dashboard line charts to SVG and PNG formats.", channel: "COMMUNITY", sentiment: "NEU", featureArea: "Dashboard", score: 0.3, themeName: "Dashboard UI", confidence: 0.86, rationale: "Feature request for exporting dashboard charts to SVG/PNG formats." },

    // Mobile & Search
    { content: "Mobile app crashes on launch when opening on iOS 17.4 device.", channel: "APP_STORE", sentiment: "NEG", featureArea: "Mobile", score: -0.9, themeName: "Mobile App Stability", confidence: 0.97, rationale: "Critical bug report regarding iOS 17.4 app stability crash." },
    { content: "Mobile app navigation is slick, but push notifications are delayed by 10 minutes.", channel: "APP_STORE", sentiment: "NEU", featureArea: "Mobile", score: 0.0, themeName: "Mobile App Stability", confidence: 0.88, rationale: "Mixed feedback regarding push notification latency." },
    { content: "Search filters across customer tags are super fast and pinpoint exact tickets instantly.", channel: "NPS_SURVEY", sentiment: "POS", featureArea: "Search", score: 0.88, themeName: "Search Filter Speed", confidence: 0.92, rationale: "Positive feedback highlighting search filter speed." },
    { content: "Full-text search doesn't highlight matching search terms inside feedback text.", channel: "COMMUNITY", sentiment: "NEU", featureArea: "Search", score: 0.15, themeName: "Search Filter Speed", confidence: 0.84, rationale: "UX suggestion for search keyword highlighting." },

    // Support & Auth
    { content: "Support ticket resolution took 4 days with zero updates from the customer team.", channel: "SUPPORT_TICKET", sentiment: "NEG", featureArea: "Support", score: -0.82, themeName: "Support Ticket SLA", confidence: 0.94, rationale: "Negative feedback regarding 4-day support ticket resolution SLA." },
    { content: "Customer support rep Alex was insanely helpful and fixed our API token in minutes!", channel: "NPS_SURVEY", sentiment: "POS", featureArea: "Support", score: 0.96, themeName: "Support Ticket SLA", confidence: 0.91, rationale: "Praise for support rep responsiveness." },
    { content: "2FA authentication SMS codes are taking over 5 minutes to deliver on Verizon.", channel: "SUPPORT_TICKET", sentiment: "NEG", featureArea: "Authentication", score: -0.7, themeName: "Notification Latency", confidence: 0.90, rationale: "Technical issue with 2FA SMS delivery delay." },
    { content: "OAuth login with Google & GitHub works flawlessly.", channel: "APP_STORE", sentiment: "POS", featureArea: "Authentication", score: 0.9, themeName: "Notification Latency", confidence: 0.89, rationale: "Positive review for OAuth social login." }
];

function generateLocalVector(text, dimensions = 64) {
    const vector = new Array(dimensions).fill(0);
    const words = String(text || "").toLowerCase().match(/\w+/g) || [];
    if (words.length === 0) return vector;

    words.forEach((word) => {
        let hash = 0;
        for (let i = 0; i < word.length; i++) {
            hash = (hash << 5) - hash + word.charCodeAt(i);
            hash |= 0;
        }
        const index = Math.abs(hash) % dimensions;
        vector[index] += 1;
    });

    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return magnitude === 0 ? vector : vector.map((val) => val / magnitude);
}

async function seedDatabase() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected successfully!");

        // Clean existing collections
        console.log("Clearing existing collections...");
        await Workspace.deleteMany({});
        await User.deleteMany({});
        await Feedback.deleteMany({});
        await Theme.deleteMany({});
        await FeedbackTheme.deleteMany({});
        await Embedding.deleteMany({});
        await Insight.deleteMany({});

        // Create Workspace
        console.log("Creating Demo Workspace...");
        const workspace = await Workspace.create({
            name: "Acme SaaS Corp"
        });

        // Create Users
        console.log("Creating Demo Users (Admin, Analyst, Viewer)...");
        const passwordHash = await bcrypt.hash("password123", 10);

        await User.create({
            name: "Sarah Admin",
            email: "admin@acme.com",
            passwordHash,
            role: "ADMIN",
            workspace: workspace._id
        });

        await User.create({
            name: "Alex Analyst",
            email: "analyst@acme.com",
            passwordHash,
            role: "ANALYST",
            workspace: workspace._id
        });

        await User.create({
            name: "Vernon Viewer",
            email: "viewer@acme.com",
            passwordHash,
            role: "VIEWER",
            workspace: workspace._id
        });

        // Create Theme Entities
        console.log("Creating Theme entities...");
        const createdThemesMap = new Map();
        for (const t of INITIAL_THEMES) {
            const themeDoc = await Theme.create({
                name: t.name,
                description: t.description,
                color: t.color,
                workspace: workspace._id
            });
            createdThemesMap.set(t.name, themeDoc);
        }

        // Generate 125 Feedback Records
        console.log("Generating 125 feedback records, vectors, and FeedbackTheme join entries...");
        const now = Date.now();
        const dayMs = 24 * 60 * 60 * 1000;

        const feedbackDocs = [];
        const embeddingDocs = [];
        const feedbackThemeDocs = [];

        for (let i = 0; i < 125; i++) {
            const template = RAW_FEEDBACK_TEMPLATES[i % RAW_FEEDBACK_TEMPLATES.length];
            const channel = CHANNELS[i % CHANNELS.length];
            const daysOffset = Math.floor(Math.random() * 45);
            const createdAt = new Date(now - daysOffset * dayMs);

            const statuses = ["NEW", "REVIEWED", "ACTIONED"];
            const status = statuses[i % statuses.length];

            const customerLabels = [
                "Acme Enterprise Client",
                "Stripe Tier 1 Account",
                "App Store Reviewer",
                "NPS User #" + (1000 + i),
                "Sales Prospect: TechCorp",
                "Community Member",
                "VIP Founder Account",
                "Beta Tester"
            ];

            const contentText = `${template.content} (Ref #${1000 + i})`;
            const vector = generateLocalVector(contentText);
            const feedbackId = new mongoose.Types.ObjectId();

            feedbackDocs.push({
                _id: feedbackId,
                content: contentText,
                channel,
                customerLabel: customerLabels[i % customerLabels.length],
                sentiment: template.sentiment,
                sentimentScore: template.score,
                themes: [template.themeName],
                featureArea: template.featureArea,
                rationale: template.rationale || "Analyzed by AI",
                status,
                aiStatus: "COMPLETED",
                embedding: vector,
                workspace: workspace._id,
                createdAt
            });

            embeddingDocs.push({
                feedback: feedbackId,
                vector,
                workspace: workspace._id,
                createdAt
            });

            const themeObj = createdThemesMap.get(template.themeName) || Array.from(createdThemesMap.values())[0];
            feedbackThemeDocs.push({
                feedback: feedbackId,
                theme: themeObj._id,
                confidence: template.confidence || 0.90,
                workspace: workspace._id,
                createdAt
            });
        }

        await Feedback.insertMany(feedbackDocs);
        await Embedding.insertMany(embeddingDocs);
        await FeedbackTheme.insertMany(feedbackThemeDocs);

        console.log("Successfully inserted 125 Feedback records, Embedding vectors, and FeedbackTheme join rows!");

        // Create initial AI Insights
        console.log("Creating initial AI insights...");
        await Insight.create([
            {
                workspace: workspace._id,
                theme: "Checkout",
                title: "Checkout payment timeouts causing customer drop-off",
                summary: "Multiple high-tier users are encountering technical timeouts on the credit card payment step, leading to churn and negative NPS scores.",
                recommendation: "Investigate payment gateway latency and implement retry fallback for card authorization.",
                priority: "HIGH"
            },
            {
                workspace: workspace._id,
                theme: "Onboarding",
                title: "Team invitation friction during workspace onboarding",
                summary: "Users report difficulty inviting teammates during initial setup, reducing initial active seat adoption.",
                recommendation: "Redesign multi-invite UI step to allow bulk CSV email import during onboarding.",
                priority: "MEDIUM"
            },
            {
                workspace: workspace._id,
                theme: "Dashboard",
                title: "High satisfaction with newly redesigned dashboard",
                summary: "Customer sentiment for the dashboard UI refresh is 85% positive with users highlighting visual speed and clarity.",
                recommendation: "Maintain performance metrics and promote dashboard features in product newsletter.",
                priority: "LOW"
            }
        ]);

        console.log("Database seeding finished successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Database seeding failed:", err);
        process.exit(1);
    }
}

seedDatabase();
