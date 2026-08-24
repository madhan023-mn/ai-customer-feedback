const mongoose = require("mongoose");

function validateObjectId(paramName = "id") {
    return (req, res, next) => {
        const id = req.params[paramName];
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: `Invalid identifier format for '${paramName}'. Expected a 24-character hexadecimal ObjectId.`
            });
        }
        next();
    };
}

module.exports = validateObjectId;
