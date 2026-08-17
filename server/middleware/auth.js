const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "loop_secret_jwt_key_default_2026";

async function auth(req, res, next) {
    try {
        let token = req.cookies?.token;

        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7).trim();
            }
        }

        if (!token) {
            return res.status(401).json({
                message: "Authentication required. Please sign in."
            });
        }

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );

        const user = await User
            .findById(decoded.id)
            .select("-passwordHash");

        if (!user) {
            return res.status(401).json({
                message: "User no longer exists"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired session. Please sign in again."
        });
    }
}

module.exports = auth;