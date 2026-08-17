const { parse } = require("csv-parse/sync");
const Feedback = require("../models/Feedback");
const {
    analyzeFeedback
} = require("../services/aiService");
const {
    queueFeedbackAnalysis,
    queueFeedbackAnalysisBulk
} = require("../queues/feedbackJobProducer");
const { processPendingFeedback } = require("../services/feedbackAiProcessor");

const aiResultSchema =
    require("../validators/aiValidator");

// Create single feedback item
async function createFeedback(req, res) {
    try {
        const {
            content,
            channel,
            customerLabel,
            featureArea
        } = req.body;

        const feedback =
            await Feedback.create({
                content,
                channel,
                customerLabel,
                featureArea,
                sentiment: "NEU",
                sentimentScore: 0,
                status: "NEW",
                aiStatus: "PENDING",
                workspace:
                    req.user.workspace
            });

        // Queue AI analysis job
        await queueFeedbackAnalysis(feedback._id);
        processPendingFeedback(5, req.user.workspace).catch(() => {});

        // Send response immediately
        res.status(201).json({
            message: "Feedback created and queued for AI analysis",
            feedback
        });
    } catch (error) {
        console.error("Create feedback error:", error);
        res.status(500).json({
            message:
                "Failed to create feedback"
        });
    }
}

// Get feedback list with search, filter, and pagination
async function getFeedbacks(req, res) {
    try {
        const {
            search,
            channel,
            sentiment,
            status,
            featureArea,
            aiStatus,
            fromDate,
            toDate,
            page = 1,
            limit = 20,
            sortBy = "createdAt",
            order = "desc"
        } = req.query;

        const query = {
            workspace: req.user.workspace
        };

        if (channel && channel !== "ALL") {
            query.channel = channel;
        }

        if (sentiment && sentiment !== "ALL") {
            query.sentiment = sentiment;
        }

        if (status && status !== "ALL") {
            query.status = status;
        }

        if (featureArea && featureArea !== "ALL") {
            query.featureArea = featureArea;
        }

        if (aiStatus && aiStatus !== "ALL") {
            query.aiStatus = aiStatus;
        }

        if (fromDate || toDate) {
            query.createdAt = {};
            if (fromDate) {
                query.createdAt.$gte = new Date(fromDate);
            }
            if (toDate) {
                const endDate = new Date(toDate);
                endDate.setHours(23, 59, 59, 999);
                query.createdAt.$lte = endDate;
            }
        }

        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), "i");
            query.$or = [
                { content: searchRegex },
                { customerLabel: searchRegex },
                { featureArea: searchRegex },
                { rationale: searchRegex }
            ];
        }

        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 20;
        const skip = (pageNum - 1) * limitNum;
        const sortOrder = order === "asc" ? 1 : -1;

        const [feedbacks, total] = await Promise.all([
            Feedback.find(query)
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limitNum),
            Feedback.countDocuments(query)
        ]);

        res.json({
            feedbacks,
            feedback: feedbacks, // Support both response structures
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum) || 1,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum) || 1
            }
        });
    } catch (error) {
        console.error("Get feedbacks error:", error);
        res.status(500).json({
            message: "Failed to fetch feedback"
        });
    }
}

// Get single feedback item by ID
async function getFeedbackById(req, res) {
    try {
        const feedback = await Feedback.findOne({
            _id: req.params.id,
            workspace: req.user.workspace
        });

        if (!feedback) {
            return res.status(404).json({
                message: "Feedback item not found"
            });
        }

        res.json({ feedback });
    } catch (error) {
        console.error("Get feedback by ID error:", error);
        res.status(500).json({
            message: "Failed to get feedback item"
        });
    }
}

// Get feedback stats & analytics
async function getFeedbackStats(req, res) {
    try {
        const workspaceId = req.user.workspace;

        const [total, sentimentAgg, channelAgg, statusAgg, recentCount] = await Promise.all([
            Feedback.countDocuments({ workspace: workspaceId }),
            Feedback.aggregate([
                { $match: { workspace: workspaceId } },
                { $group: { _id: "$sentiment", count: { $sum: 1 } } }
            ]),
            Feedback.aggregate([
                { $match: { workspace: workspaceId } },
                { $group: { _id: "$channel", count: { $sum: 1 } } }
            ]),
            Feedback.aggregate([
                { $match: { workspace: workspaceId } },
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]),
            Feedback.countDocuments({
                workspace: workspaceId,
                createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            })
        ]);

        const sentiment = { POS: 0, NEU: 0, NEG: 0 };
        sentimentAgg.forEach(item => {
            if (item._id) sentiment[item._id] = item.count;
        });

        const channels = {
            SUPPORT_TICKET: 0,
            APP_STORE: 0,
            NPS_SURVEY: 0,
            SALES_CALL: 0,
            COMMUNITY: 0
        };
        channelAgg.forEach(item => {
            if (item._id) channels[item._id] = item.count;
        });

        const status = { NEW: 0, REVIEWED: 0, ACTIONED: 0, RESOLVED: 0, ARCHIVED: 0 };
        statusAgg.forEach(item => {
            if (item._id) status[item._id] = item.count;
        });

        res.json({
            total,
            recent7Days: recentCount,
            sentiment,
            channels,
            status
        });
    } catch (error) {
        console.error("Get feedback stats error:", error);
        res.status(500).json({
            message: "Failed to fetch feedback analytics"
        });
    }
}

// Update feedback item
async function updateFeedback(req, res) {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findOne({
            _id: id,
            workspace: req.user.workspace
        });

        if (!feedback) {
            return res.status(404).json({
                message: "Feedback item not found"
            });
        }

        const allowedUpdates = [
            "content",
            "channel",
            "customerLabel",
            "sentiment",
            "sentimentScore",
            "featureArea",
            "rationale",
            "status"
        ];

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                feedback[field] = req.body[field];
            }
        });

        await feedback.save();

        res.json({
            message: "Feedback updated successfully",
            feedback
        });
    } catch (error) {
        console.error("Update feedback error:", error);
        res.status(500).json({
            message: "Failed to update feedback"
        });
    }
}

// Delete feedback item
async function deleteFeedback(req, res) {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findOneAndDelete({
            _id: id,
            workspace: req.user.workspace
        });

        if (!feedback) {
            return res.status(404).json({
                message: "Feedback item not found"
            });
        }

        res.json({
            message: "Feedback deleted successfully"
        });
    } catch (error) {
        console.error("Delete feedback error:", error);
        res.status(500).json({
            message: "Failed to delete feedback"
        });
    }
}

// Analyze single feedback item with AI
async function analyzeSingleFeedback(req, res) {
    try {
        const feedback = await Feedback.findOne({
            _id: req.params.id,
            workspace: req.user.workspace
        });

        if (!feedback) {
            return res.status(404).json({
                message: "Feedback not found"
            });
        }

        feedback.aiStatus = "PROCESSING";
        await feedback.save();

        try {
            const result = await analyzeFeedback(feedback.content);
            const validation = aiResultSchema.safeParse(result);

            if (!validation.success) {
                feedback.aiStatus = "FAILED";
                await feedback.save();

                return res.status(502).json({
                    message: "AI returned invalid data"
                });
            }

            feedback.sentiment = validation.data.sentiment;
            feedback.sentimentScore = validation.data.sentimentScore;
            feedback.featureArea = validation.data.featureArea;
            feedback.rationale = validation.data.rationale;
            feedback.aiStatus = "COMPLETED";

            await feedback.save();

            res.json({
                message: "Feedback analyzed successfully",
                feedback
            });
        } catch (aiError) {
            feedback.aiStatus = "FAILED";
            await feedback.save();

            console.error("AI Error:", aiError);

            return res.status(502).json({
                message: "AI analysis failed"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to analyze feedback"
        });
    }
}

// Import CSV feedback bulk
async function importCSV(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "CSV file is required"
            });
        }

        const csvContent = req.file.buffer.toString("utf-8");

        const records = parse(csvContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });

        if (!records || records.length === 0) {
            return res.status(400).json({
                message: "CSV file is empty or missing headers"
            });
        }

        const validChannels = [
            "SUPPORT_TICKET",
            "APP_STORE",
            "NPS_SURVEY",
            "SALES_CALL",
            "COMMUNITY"
        ];

        const validSentiments = ["POS", "NEU", "NEG"];
        const validStatuses = ["NEW", "REVIEWED", "ACTIONED"];

        const docsToInsert = [];
        const errors = [];

        records.forEach((row, index) => {
            const keys = Object.keys(row);
            const getVal = (possibleKeys) => {
                for (const key of keys) {
                    if (possibleKeys.includes(key.toLowerCase().replace(/[^a-z]/g, ""))) {
                        return row[key];
                    }
                }
                return "";
            };

            const content = getVal(["content", "feedback", "text", "comment", "message"]);
            if (!content) {
                errors.push({ row: index + 2, message: "Content is required" });
                return;
            }

            let channel = getVal(["channel", "source", "type"]).toUpperCase();
            if (!validChannels.includes(channel)) {
                channel = "SUPPORT_TICKET";
            }

            let sentiment = getVal(["sentiment", "feeling"]).toUpperCase();
            if (sentiment.startsWith("POS") || sentiment.startsWith("POSITIVE")) sentiment = "POS";
            else if (sentiment.startsWith("NEG") || sentiment.startsWith("NEGATIVE")) sentiment = "NEG";
            else if (!validSentiments.includes(sentiment)) sentiment = "NEU";

            let status = getVal(["status", "state"]).toUpperCase();
            if (!validStatuses.includes(status)) status = "NEW";

            const customerLabel = getVal(["customerlabel", "customer", "user", "client"]);
            const featureArea = getVal(["featurearea", "feature", "category", "area"]) || "General";
            const rationale = getVal(["rationale", "reason", "notes", "insight"]);

            docsToInsert.push({
                content,
                channel,
                customerLabel: customerLabel || "",
                sentiment,
                sentimentScore: sentiment === "POS" ? 0.8 : sentiment === "NEG" ? -0.8 : 0,
                featureArea,
                rationale: rationale || "",
                status,
                workspace: req.user.workspace
            });
        });

        if (docsToInsert.length === 0) {
            return res.status(400).json({
                message: "No valid feedback entries found in CSV.",
                errors
            });
        }

        const created = await Feedback.insertMany(docsToInsert);
        const createdIds = created.map(doc => doc._id);

        // Queue bulk jobs for AI processing in BullMQ
        await queueFeedbackAnalysisBulk(createdIds);
        processPendingFeedback(created.length, req.user.workspace).catch(() => {});

        res.status(201).json({
            message: `Successfully imported ${created.length} feedback items and queued for AI analysis`,
            imported: created.length,
            count: created.length,
            rejected: errors.length,
            errors
        });
    } catch (error) {
        console.error("Import CSV error:", error);
        res.status(500).json({
            message: error.message || "Failed to process CSV file"
        });
    }
}

// Update feedback status
async function updateFeedbackStatus(req, res) {
    try {
        const { status } = req.body;
        const allowedStatuses = ["NEW", "REVIEWED", "ACTIONED", "RESOLVED", "ARCHIVED"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid feedback status"
            });
        }

        const feedback = await Feedback.findOneAndUpdate(
            {
                _id: req.params.id,
                workspace: req.user.workspace
            },
            { status },
            { new: true }
        );

        if (!feedback) {
            return res.status(404).json({
                message: "Feedback not found"
            });
        }

        res.json({
            message: "Feedback status updated",
            feedback
        });
    } catch (error) {
        console.error("Update feedback status error:", error);
        res.status(500).json({
            message: "Failed to update status"
        });
    }
}

// Simulate Channel Integration Pull
async function simulateChannelIngestion(req, res) {
    try {
        const { channel } = req.body;
        const targetChannel = channel || "SUPPORT_TICKET";

        const channelTemplates = {
            SUPPORT_TICKET: [
                { content: "Billing page timed out when trying to download our annual VAT invoice.", label: "Acme Corp (Enterprise)", channel: "SUPPORT_TICKET" },
                { content: "Magic link password reset email is taking over 15 minutes to arrive.", label: "Stripe Tier Client", channel: "SUPPORT_TICKET" },
                { content: "Support ticket resolution time was amazing! Rep resolved our SSO config in 10 mins.", label: "Nexus Systems", channel: "SUPPORT_TICKET" },
                { content: "Unable to add new team members with ANALYST role due to 403 error on modal submit.", label: "Global Tech Admin", channel: "SUPPORT_TICKET" }
            ],
            APP_STORE: [
                { content: "5 Stars! The new AI theme explorer has completely transformed how our product team triages feedback.", label: "AppStore Reviewer #4092", channel: "APP_STORE" },
                { content: "App keeps freezing on the iOS dashboard when rendering large volume line charts.", label: "iOS Mobile User", channel: "APP_STORE" },
                { content: "Love the UI design and dark theme, but really need offline mobile support.", label: "Product Lead User", channel: "APP_STORE" }
            ],
            SALES_CALL: [
                { content: "Prospect mentioned SAML SSO & Okta integration is mandatory before signing annual contract.", label: "Sales Lead: TechCorp", channel: "SALES_CALL" },
                { content: "Client loved the Ask LOOP AI Q&A feature during the live demo presentation.", label: "VP of Product: DataFlex", channel: "SALES_CALL" },
                { content: "Prospect requested automated weekly VoC PDF email reports for executive team.", label: "Account Executive Note", channel: "SALES_CALL" }
            ],
            NPS_SURVEY: [
                { content: "10/10 Score: LOOP saved our product operations team over 15 hours every single sprint.", label: "NPS Promoter", channel: "NPS_SURVEY" },
                { content: "6/10 Score: Solid insights engine, but mobile experience needs major polish.", label: "NPS Passive", channel: "NPS_SURVEY" },
                { content: "2/10 Score: Checkout flow failed twice during credit card payment processing.", label: "NPS Detractor", channel: "NPS_SURVEY" }
            ],
            COMMUNITY: [
                { content: "Huge fan of the new PDF export feature! Saved me hours of presentation preparation today.", label: "Community Champion", channel: "COMMUNITY" },
                { content: "Is anyone else seeing a slight latency spike on the feedback search filter?", label: "Community Forum Post", channel: "COMMUNITY" },
                { content: "Feature Request: Can we get Webhook notifications when a theme negativity rate exceeds 40%?", label: "Dev Community", channel: "COMMUNITY" }
            ]
        };

        const itemsToIngest = channelTemplates[targetChannel] || channelTemplates.SUPPORT_TICKET;
        const createdItems = [];

        for (const item of itemsToIngest) {
            const feedback = await Feedback.create({
                content: item.content,
                channel: item.channel,
                customerLabel: item.label,
                status: "NEW",
                aiStatus: "PENDING",
                workspace: req.user.workspace
            });

            await queueFeedbackAnalysis(feedback._id);
            createdItems.push(feedback);
        }

        processPendingFeedback(createdItems.length, req.user.workspace).catch(() => {});

        res.status(201).json({
            message: `Successfully simulated ${targetChannel} sync! Queued ${createdItems.length} records for AI analysis.`,
            count: createdItems.length,
            channel: targetChannel,
            feedback: createdItems
        });
    } catch (error) {
        console.error("Simulate channel ingestion error:", error);
        res.status(500).json({
            message: "Failed to simulate channel ingestion"
        });
    }
}

async function retryAIAnalysis(req, res) {
    try {
        const feedback = await Feedback.findOneAndUpdate(
            {
                _id: req.params.id,
                workspace: req.user.workspace,
                aiStatus: "FAILED"
            },
            {
                $set: {
                    aiStatus: "PENDING",
                    aiError: null
                }
            },
            {
                new: true
            }
        );

        if (!feedback) {
            return res.status(404).json({
                message: "Failed feedback item not found or not in FAILED state"
            });
        }

        // Queue BullMQ job for retry
        await queueFeedbackAnalysis(feedback._id);

        res.json({
            message: "AI analysis queued for retry",
            feedback
        });
    } catch (error) {
        console.error("Retry AI analysis error:", error);
        res.status(500).json({
            message: "Failed to retry AI analysis"
        });
    }
}

module.exports = {
    createFeedback,
    getFeedbacks,
    getFeedback: getFeedbacks,
    getFeedbackById,
    getFeedbackStats,
    updateFeedback,
    updateFeedbackStatus,
    deleteFeedback,
    analyzeFeedback: analyzeSingleFeedback,
    analyzeSingleFeedback,
    retryAIAnalysis,
    importCSV,
    importFeedbackCsv: importCSV,
    simulateChannelIngestion
};