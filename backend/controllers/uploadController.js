
const uploadImage = require("../utils/uploadImage");

const uploadItemImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select an image",
            });
        }

        const result = await uploadImage(req.file.buffer);

        return res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            imageUrl: result.imageUrl,
            imagePublicId: result.imagePublicId,
        });
    } catch (error) {
        console.error("Image upload error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Image upload failed",
        });
    }
};

module.exports = { uploadItemImage };
