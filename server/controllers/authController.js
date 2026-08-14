const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Workspace = require("../models/Workspace");
const { setAuthCookie } = require("../utils/generateToken");

async function register(req, res) {
    try {
        const { name, email, password, workspaceName } = req.body;

        if (!name || !email || !password || !workspaceName) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered. Please sign in instead."
            });
        }

        const workspace = await Workspace.create({
            name: workspaceName.trim()
        });

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            passwordHash,
            role: "ADMIN",
            workspace: workspace._id
        });

        setAuthCookie(res, user);

        res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                workspace: workspace.name
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            message: error.message || "Registration failed. Please try again."
        });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: normalizedEmail }).populate("workspace");

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

        if (!passwordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        setAuthCookie(res, user);

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                workspace: user.workspace?.name || ""
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Login failed. Please try again."
        });
    }
}

async function me(req, res) {
    try {
        const user = await User.findById(req.user._id).populate("workspace");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                workspace: user.workspace?.name || ""
            }
        });
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({
            message: "Failed to fetch user profile"
        });
    }
}

function logout(req, res) {
    res.clearCookie("token");
    res.json({
        message: "Logged out successfully"
    });
}

module.exports = {
    register,
    login,
    me,
    logout
};