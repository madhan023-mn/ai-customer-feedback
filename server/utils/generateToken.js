const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "loop_secret_jwt_key_default_2026";

function setAuthCookie(res, user) {
    const workspaceId = user.workspace?._id
        ? user.workspace._id.toString()
        : user.workspace
        ? user.workspace.toString()
        : "";

    const token = jwt.sign(
        {
            id: user._id.toString(),
            workspace: workspaceId,
            role: user.role
        },
        JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
}

module.exports = {
    setAuthCookie
};