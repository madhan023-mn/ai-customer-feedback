const router = require("express").Router();

const auth = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const validateObjectId = require("../middleware/validateObjectId");

const {
    getMembers,
    addMember,
    updateMemberRole,
    deleteMember
} = require("../controllers/memberController");

router.get(
    "/",
    auth,
    getMembers
);

router.post(
    "/",
    auth,
    allowRoles("ADMIN"),
    addMember
);

router.patch(
    "/:id/role",
    auth,
    allowRoles("ADMIN"),
    validateObjectId("id"),
    updateMemberRole
);

router.delete(
    "/:id",
    auth,
    allowRoles("ADMIN"),
    validateObjectId("id"),
    deleteMember
);

module.exports = router;