function calculateTrend(trend) {
    if (!trend || trend.length < 2) {
        return "STABLE";
    }

    const first = trend[0].count;
    const last = trend[trend.length - 1].count;

    if (last > first) {
        return "INCREASING";
    }

    if (last < first) {
        return "DECREASING";
    }

    return "STABLE";
}

module.exports = calculateTrend;
