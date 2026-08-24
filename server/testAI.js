require("dotenv").config();
const { analyzeFeedback, generateInsight, generateEmbedding } = require("./services/aiService");

async function test() {
    try {
        console.log("1. Testing analyzeFeedback...");
        const result = await analyzeFeedback({
            content: "The checkout page is very slow and confusing."
        });
        console.log("Feedback Analysis Result:", result);

        console.log("\n2. Testing generateInsight...");
        const insight = await generateInsight({
            theme: "Checkout",
            totalFeedback: 15,
            positive: 2,
            neutral: 3,
            negative: 10,
            negativePercentage: "66.7",
            trendDirection: "INCREASING",
            examples: ["Checkout timed out", "Card declined without error reason"]
        });
        console.log("Theme Insight Result:", insight);

        console.log("\n3. Testing generateEmbedding...");
        const vector = await generateEmbedding("Checkout payment failed");
        console.log(`Embedding generated successfully (length: ${vector.length})`);

        console.log("\n✅ All AI Service tests completed successfully!");
    } catch (error) {
        console.error("❌ AI TEST FAILED:", error.message);
    }
}

test();
