
const express = require("express");

const {
    createItem,
    getItems,
    getItemById,
    getMyReports,
    updateItem,
    deleteItem,
} = require("../controllers/itemController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
// Public routes
router.get("/", getItems);
router.get("/my-reports", protect, getMyReports);
router.get("/:id", getItemById);

// Protected routes
router.post("/", protect, upload.single("image"), createItem);
router.patch("/:id", protect, updateItem);
router.delete("/:id", protect, deleteItem);

module.exports = router;
