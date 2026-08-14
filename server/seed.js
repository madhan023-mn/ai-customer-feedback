const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const Workspace = require("./models/Workspace");
const User = require("./models/User");
const Feedback = require("./models/Feedback");
const Insight = require("./models/Insight");

const MONGO_URI = process.env.MONGO_URI || process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/loop_db";

const CHANNELS = ["SUPPORT_TICKET", "APP_STORE", "NPS_SURVEY", "SALES_CALL", "COMMUNITY"];
const FEATURE_AREAS = [
    "Checkout",
    "Onboarding",
    "Dashboard",
    "Payments",
    "Mobile",
    "Search",
    "Support",
    "Notifications",
    "Performance",
    "Authentication"
];

const RAW_FEEDBACK_TEMPLATES = [
    // Onboarding
    { content: "Onboarding took forever — I couldn't figure out how to invite my team members.", channel: "SUPPORT_TICKET", sentiment: "NEG", featureArea: "Onboarding", score: -0.8, rationale: "Frustration with multi-user invite flow during onboarding." },
    { content: "The interactive onboarding tour was crystal clear and got our team set up in 5 minutes!", channel: "NPS_SURVEY", sentiment: "POS", featureArea: "Onboarding", score: 0.9, rationale: "Positive reaction to interactive setup guide." },
    { content: "Onboarding email sequence links were broken for half of our new signups.", channel: "SUPPORT_TICKET", sentiment: "NEG", featureArea: "Onboarding", score: -0.7, rationale: "Technical issue with email verification links." },
    { content: "Step-by-step wizard is decent, but needs a skip button for experienced users.", channel: "COMMUNITY", sentiment: "NEU", featureArea: "Onboarding", score: 0.1, rationale: "Usability suggestion for setup flow." },

    // Checkout & Payments
    { content: "Checkout page timed out twice while entering credit card billing information.", channel: "SUPPORT_TICKET", sentiment: "NEG", featureArea: "Checkout", score: -0.85, rationale: "High severity payment processing failure." },
    { content: "Seamless payment checkout experience. Stripe integration is fast and smooth.", channel: "APP_STORE", sentiment: "POS", featureArea: "Checkout", score: 0.95, rationale: "Praise for checkout speed." },
    { content: "Prospect wants SAML SSO & automated invoice billing before signing annual contract.", channel: "SALES_CALL", sentiment: "NEG", featureArea: "Payments", score: -0.5, rationale: "Sales blocker due to enterprise billing requirements." },
    { content: "Can we get Apple Pay and PayPal support on the web checkout screen?", channel: "COMMUNITY", sentiment: "NEU", featureArea: "Payments", score: 0.2, rationale: "Feature request for additional payment methods." },

    // Dashboard & Performance
    { content: "The new dashboard is gorgeous and finally fast! Huge improvement over v1.", channel: "APP_STORE", sentiment: "POS", featureArea: "Dashboard", score: 0.9, rationale: "User delight over dashboard UI refresh." },
    { content: "Dashboard charts lag significantly when filtering over a 90-day historical window.", channel: "SUPPORT_TICKET", sentiment: "NEG", featureArea: "Performance", score: -0.75, rationale: "Performance bottleneck on large data aggregation." },
    { content: "Real-time analytics updates are super helpful during live marketing campaigns.", channel: "NPS_SURVEY", sentiment: "POS", featureArea: "Dashboard", score: 0.85, rationale: "High satisfaction with real-time data metrics." },
    { content: "Would love the ability to export dashboard line charts to SVG and PNG formats.", channel: "COMMUNITY", sentiment: "NEU", featureArea: "Dashboard", score: 0.3, rationale: "Feature request for chart exports." },

    // Mobile & Search
    { content: "Mobile app crashes on launch when opening on iOS 17.4 device.", channel: "APP_STORE", sentiment: "NEG", featureArea: "Mobile", score: -0.9, rationale: "Critical mobile app stability bug." },
    { content: "Mobile app navigation is slick, but push notifications are delayed by 10 minutes.", channel: "APP_STORE", sentiment: "NEU", featureArea: "Mobile", score: 0.0, rationale: "Mixed feedback regarding push latency." },
    { content: "Search filters across customer tags are super fast and pinpoint exact tickets instantly.", channel: "NPS_SURVEY", sentiment: "POS", featureArea: "Search", score: 0.88, rationale: "High satisfaction with search filter speed." },
    { content: "Full-text search doesn't highlight matching search terms inside feedback text.", channel: "COMMUNITY", sentiment: "NEU", featureArea: "Search", score: 0.15, rationale: "UX enhancement for search results." },

    // Support & Auth
    { content: "Support ticket resolution took 4 days with zero updates from the customer team.", channel: "SUPPORT_TICKET", sentiment: "NEG", featureArea: "Support", score: -0.82, rationale: "Customer dissatisfaction with support SLA." },
    { content: "Customer support rep Alex was insanely helpful and fixed our API token in minutes!", channel: "NPS_SURVEY", sentiment: "POS", featureArea: "Support", score: 0.96, rationale: "Praise for support rep responsiveness." },
    { content: "2FA authentication SMS codes are taking over 5 minutes to deliver on Verizon.", channel: "SUPPORT_TICKET", sentiment: "NEG", featureArea: "Authentication", score: -0.7, rationale: "SMS 2FA delivery latency." },
    { content: "OAuth login with Google & GitHub works flawlessly.", channel: "APP_STORE", sentiment: "POS", featureArea: "Authentication", score: 0.9, rationale: "Positive review for social login." }
];

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
        await Insight.deleteMany({});

        // Create Workspace
        console.log("Creating Demo Workspace...");
        const workspace = await Workspace.create({
            name: "Acme SaaS Corp"
        });

        // Create Users
        console.log("Creating Demo Users (Admin, Analyst, Viewer)...");
        const passwordHash = await bcrypt.hash("password123", 10);

        const adminUser = await User.create({
            name: "Sarah Admin",
            email: "admin@acme.com",
            passwordHash,
            role: "ADMIN",
            workspace: workspace._id
        });

        const analystUser = await User.create({
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

        console.log("Created users:");
        console.log(" - Admin: admin@acme.com / password123");
        console.log(" - Analyst: analyst@acme.com / password123");
        console.log(" - Viewer: viewer@acme.com / password123");

        // Generate 125 Feedback Records
        console.log("Generating 125 realistic feedback records across channels...");
        const feedbackDocs = [];
        const now = Date.now();
        const dayMs = 24 * 60 * 60 * 1000;

        for (let i = 0; i < 125; i++) {
            const template = RAW_FEEDBACK_TEMPLATES[i % RAW_FEEDBACK_TEMPLATES.length];
            const channel = CHANNELS[i % CHANNELS.length];
            const daysOffset = Math.floor(Math.random() * 45); // Spread over past 45 days
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

            feedbackDocs.push({
                content: `${template.content} (Ref #${1000 + i})`,
                channel,
                customerLabel: customerLabels[i % customerLabels.length],
                sentiment: template.sentiment,
                sentimentScore: template.score,
                featureArea: template.featureArea,
                rationale: template.rationale,
                status,
                aiStatus: "COMPLETED",
                workspace: workspace._id,
                createdAt
            });
        }

        await Feedback.insertMany(feedbackDocs);
        console.log("Successfully inserted 125 feedback records!");

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
