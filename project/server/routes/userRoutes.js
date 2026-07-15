const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const ctrl = require("../controllers/userControllers");

router.post("/signup", ctrl.signup);
router.post("/login", ctrl.login);
router.get("/profile", protect, ctrl.getProfile);
router.put("/profile", protect, ctrl.updateProfile);

// admin-only
router.get("/", protect, authorize("admin"), ctrl.getAllUsers);
router.delete("/:id", protect, authorize("admin"), ctrl.deleteUser);

module.exports = router;
