const { findThemeRisks } = require("./insightService");

async function generateInsights(workspace) {
    await findThemeRisks(workspace);
}

module.exports = {
    generateInsights
};
