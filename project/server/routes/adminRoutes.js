const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const ctrl = require("../controllers/adminControllers");

router.post("/signup", ctrl.signup);
router.post("/login", ctrl.login);
router.get("/profile", protect, authorize("admin"), ctrl.getProfile);

module.exports = router;
