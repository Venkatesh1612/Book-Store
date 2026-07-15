const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const ctrl = require("../controllers/sellerControllers");

router.post("/signup", ctrl.signup);
router.post("/login", ctrl.login);
router.get("/profile", protect, authorize("seller"), ctrl.getProfile);
router.put("/profile", protect, authorize("seller"), ctrl.updateProfile);
router.get("/orders", protect, authorize("seller"), ctrl.getSellerOrders);
router.put("/orders/:id/status", protect, authorize("seller"), ctrl.updateOrderStatus);

// admin-only
router.get("/", protect, authorize("admin"), ctrl.getAllSellers);
router.put("/:id/approve", protect, authorize("admin"), ctrl.approveSeller);
router.delete("/:id", protect, authorize("admin"), ctrl.deleteSeller);

module.exports = router;
