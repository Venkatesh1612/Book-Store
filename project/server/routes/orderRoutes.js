const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const ctrl = require("../controllers/orderControllers");

router.post("/", protect, authorize("user"), ctrl.createOrder);
router.get("/mine", protect, authorize("user"), ctrl.getMyOrders);
router.get("/:id", protect, ctrl.getOrderById);
router.get("/", protect, authorize("admin"), ctrl.getAllOrders);

module.exports = router;
