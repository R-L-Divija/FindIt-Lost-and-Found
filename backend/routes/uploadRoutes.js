
const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const { uploadItemImage } = require("../controllers/uploadController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
    "/item-image",
    protect,
    upload.single("image"),
    uploadItemImage
);

module.exports = router;
