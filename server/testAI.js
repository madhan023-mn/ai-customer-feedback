require("dotenv").config();
const { analyzeFeedback } = require("./services/aiService");

async function test() {
    try {
        const result = await analyzeFeedback({
            content: "The checkout page is very slow and confusing."
        });

        console.log("AI RESULT:");
        console.log(result);
    } catch (error) {
        console.error("AI TEST FAILED:");
        console.error(error.message);
    }
}

test();
