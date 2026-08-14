const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");

function generateCSV(data) {
    const fields = [
        "content",
        "channel",
        "customerLabel",
        "featureArea",
        "sentiment",
        "sentimentScore",
        "rationale",
        "status",
        "aiStatus",
        "createdAt"
    ];

    const parser = new Parser({
        fields
    });

    return parser.parse(data || []);
}

function generatePDF(report, feedback, response) {
    const doc = new PDFDocument({
        margin: 50
    });

    doc.pipe(response);

    // Title
    doc.fontSize(22).fillColor("#4f46e5").text("LOOP Feedback Report", {
        align: "center"
    });

    doc.moveDown(0.5);

    // Date Range
    doc.fontSize(10).fillColor("#64748b").text(
        `From: ${new Date(report.dateRange.from).toLocaleDateString()}   To: ${new Date(report.dateRange.to).toLocaleDateString()}`,
        { align: "center" }
    );

    doc.moveDown(1.5);

    // Summary Section
    doc.fontSize(16).fillColor("#0f172a").text("Summary");
    doc.moveDown(0.5);
    doc.fontSize(11).fillColor("#334155").text(`Total Feedback: ${report.summary.totalFeedback}`);
    doc.text(`Positive: ${report.summary.positive}`);
    doc.text(`Neutral: ${report.summary.neutral}`);
    doc.text(`Negative: ${report.summary.negative}`);

    doc.moveDown(1.5);

    // Sentiment Breakdown Section
    doc.fontSize(16).fillColor("#0f172a").text("Sentiment Breakdown");
    doc.moveDown(0.5);
    doc.fontSize(11).fillColor("#334155").text(`Positive: ${report.sentimentPercentage.positive.toFixed(1)}%`);
    doc.text(`Neutral: ${report.sentimentPercentage.neutral.toFixed(1)}%`);
    doc.text(`Negative: ${report.sentimentPercentage.negative.toFixed(1)}%`);

    doc.moveDown(1.5);

    // Top Themes Section
    doc.fontSize(16).fillColor("#0f172a").text("Top Themes");
    doc.moveDown(0.5);

    if (!report.themes || !report.themes.length) {
        doc.fontSize(11).fillColor("#64748b").text("No top themes recorded for this date range.");
    } else {
        report.themes.forEach((theme, index) => {
            doc.fontSize(11).fillColor("#334155").text(
                `${index + 1}. ${theme._id} — ${theme.count} feedback items, ${theme.negative} negative`
            );
        });
    }

    doc.moveDown(1.5);

    // AI Insights Section
    doc.fontSize(16).fillColor("#0f172a").text("AI Insights & Product Intelligence");
    doc.moveDown(0.5);

    if (!report.insights || !report.insights.length) {
        doc.fontSize(11).fillColor("#64748b").text("No AI insights available for this date range.");
    } else {
        report.insights.forEach((insight) => {
            doc.fontSize(12).fillColor("#6366f1").text(`${insight.theme} — ${insight.priority} PRIORITY`);
            doc.fontSize(11).fillColor("#0f172a").text(insight.title);
            doc.fontSize(10).fillColor("#475467").text(insight.summary);
            doc.fontSize(10).fillColor("#16a34a").text(`Recommended Action: ${insight.recommendation}`);
            doc.moveDown(0.8);
        });
    }

    // Feedback Details Page
    if (feedback && feedback.length > 0) {
        doc.addPage();
        doc.fontSize(16).fillColor("#0f172a").text("Feedback Details (Sample List)");
        doc.moveDown(1);

        feedback.slice(0, 30).forEach((item, index) => {
            doc.fontSize(10).fillColor("#0f172a").text(`${index + 1}. "${item.content}"`);
            doc.fontSize(9).fillColor("#64748b").text(
                `Channel: ${item.channel || "-"} | Feature: ${item.featureArea || "-"} | Sentiment: ${item.sentiment || "-"} | Status: ${item.status || "-"}`
            );
            doc.moveDown(0.6);
        });
    }

    doc.end();
}

module.exports = {
    generateCSV,
    generatePDF
};
