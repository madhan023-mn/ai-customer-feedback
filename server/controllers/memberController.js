const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function getMembers(req, res) {
    try {
        const members = await User
            .find({
                workspace: req.user.workspace
            })
            .select("-passwordHash")
            .sort({
                createdAt: 1
            });

        res.json({
            members
        });
    } catch (error) {
        console.error("Get members error:", error);
        res.status(500).json({
            message: "Failed to get members"
        });
    }
}

async function addMember(req, res) {
    try {
        const {
            name,
            email,
            password,
            role
        } = req.body;

        if (
            !name ||
            !email ||
            !password ||
            !role
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (
            !["ADMIN", "ANALYST", "VIEWER"]
                .includes(role)
        ) {
            return res.status(400).json({
                message: "Invalid role. Allowed roles: ADMIN, ANALYST, VIEWER."
            });
        }

        const normalizedEmail = String(email || "").toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered in system"
            });
        }

        const passwordHash = await bcrypt.hash(
            password,
            12
        );

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            passwordHash,
            role,
            workspace: req.user.workspace
        });

        res.status(201).json({
            member: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                workspace: user.workspace
            }
        });
    } catch (error) {
        console.error("Add member error:", error);
        res.status(500).json({
            message: "Failed to add member"
        });
    }
}

async function updateMemberRole(req, res) {
    try {
        const { role } = req.body;

        if (
            !["ADMIN", "ANALYST", "VIEWER"]
                .includes(role)
        ) {
            return res.status(400).json({
                message: "Invalid role. Allowed roles: ADMIN, ANALYST, VIEWER."
            });
        }

        const member = await User.findOne({
            _id: req.params.id,
            workspace: req.user.workspace
        });

        if (!member) {
            return res.status(404).json({
                message: "Member not found"
            });
        }

        if (member.role === "ADMIN" && role !== "ADMIN") {
            const adminCount = await User.countDocuments({
                workspace: req.user.workspace,
                role: "ADMIN"
            });
            if (adminCount <= 1) {
                return res.status(400).json({
                    message: "Cannot change role. The workspace must have at least one active ADMIN."
                });
            }
        }

        member.role = role;
        await member.save();

        res.json({
            message: "Role updated successfully",
            member: {
                id: member._id,
                name: member.name,
                email: member.email,
                role: member.role
            }
        });
    } catch (error) {
        console.error("Update member role error:", error);
        res.status(500).json({
            message: "Failed to update role"
        });
    }
}

async function deleteMember(req, res) {
    try {
        const member = await User.findOne({
            _id: req.params.id,
            workspace: req.user.workspace
        });

        if (!member) {
            return res.status(404).json({
                message: "Member not found"
            });
        }

        if (
            member._id.toString() ===
            req.user._id.toString()
        ) {
            return res.status(400).json({
                message: "You cannot delete yourself"
            });
        }

        if (member.role === "ADMIN") {
            const adminCount = await User.countDocuments({
                workspace: req.user.workspace,
                role: "ADMIN"
            });
            if (adminCount <= 1) {
                return res.status(400).json({
                    message: "Cannot delete the sole ADMIN member of this workspace."
                });
            }
        }

        await User.deleteOne({
            _id: member._id
        });

        res.json({
            message: "Member removed successfully"
        });
    } catch (error) {
        console.error("Delete member error:", error);
        res.status(500).json({
            message: "Failed to remove member"
        });
    }
}

module.exports = {
    getMembers,
    addMember,
    updateMemberRole,
    deleteMember
};