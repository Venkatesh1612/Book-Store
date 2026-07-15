const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const ctrl = require("../controllers/bookControllers");

// public
router.get("/", ctrl.getBooks);
router.get("/:id", ctrl.getBookById);

// seller
router.get("/seller/mine", protect, authorize("seller"), ctrl.getMyBooks);
router.post("/", protect, authorize("seller"), upload.single("image"), ctrl.createBook);
router.put("/:id", protect, authorize("seller"), upload.single("image"), ctrl.updateBook);
router.delete("/:id", protect, authorize("seller", "admin"), ctrl.deleteBook);

// user
router.post("/:id/review", protect, authorize("user"), ctrl.addReview);

module.exports = router;
