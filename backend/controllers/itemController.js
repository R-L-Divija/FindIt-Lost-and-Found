
const mongoose = require("mongoose");
const Item = require("../models/Item");
const uploadImage = require("../utils/uploadImage");

const cloudinary = require("../config/cloudinary");
const createItem = async (req, res) => {
    let uploadedPublicId;

    try {
        const {
            title,
            description,
            type,
            category,
            location,
            date,
        } = req.body;

        if (
            !title?.trim() ||
            !description?.trim() ||
            !type ||
            !category ||
            !location?.trim() ||
            !date
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required item details",
            });
        }

        let imageUrl = "";
        let imagePublicId = "";

        if (req.file) {
            const uploaded = await uploadImage(req.file.buffer);
            imageUrl = uploaded.imageUrl;
            imagePublicId = uploaded.imagePublicId;
            uploadedPublicId = imagePublicId;
        }

        const item = await Item.create({
            title,
            description,
            type,
            category,
            location,
            date,
            imageUrl,
            imagePublicId,
            reportedBy: req.user._id,
        });

        return res.status(201).json({
            success: true,
            message: "Item report created successfully",
            item,
        });
    } catch (error) {
        if (uploadedPublicId) {
            await cloudinary.uploader
                .destroy(uploadedPublicId)
                .catch(() => { });
        }

        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid item details",
            });
        }

        console.error("Create item error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to create item report",
        });
    }
};


const getItems = async (req, res) => {
    try {
        const filter = {};

        if (["lost", "found"].includes(req.query.type)) {
            filter.type = req.query.type;
        }

        if (req.query.category) {
            filter.category = req.query.category;
        }

        if (req.query.location) {
            filter.location = {
                $regex: req.query.location,
                $options: "i",
            };
        }

        if (req.query.search) {
            const search = req.query.search.trim().slice(0, 100);
            const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            filter.$or = [
                { title: { $regex: escaped, $options: "i" } },
                { description: { $regex: escaped, $options: "i" } },
            ];
        }

        filter.status = "open";

        const items = await Item.find(filter)
            .populate("reportedBy", "name")
            .sort({ createdAt: -1 })
            .limit(100);

        return res.json({
            success: true,
            count: items.length,
            items,
        });
    } catch (error) {
        console.error("Get items error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve items",
        });
    }
};

const getItemById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid item ID",
            });
        }

        const item = await Item.findById(req.params.id)
            .populate("reportedBy", "name");

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found",
            });
        }

        return res.json({
            success: true,
            item,
        });
    } catch (error) {
        console.error("Get item error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve item",
        });
    }
};

const getMyReports = async (req, res) => {
    try {
        const items = await Item.find({
            reportedBy: req.user._id,
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: items.length,
            items,
        });
    } catch (error) {
        console.error("Get my reports error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve your reports",
        });
    }
};

const updateItem = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid item ID",
            });
        }

        const item = await Item.findOne({
            _id: req.params.id,
            reportedBy: req.user._id,
        });

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Report not found or you do not own it",
            });
        }

        const allowedFields = [
            "title",
            "description",
            "category",
            "location",
            "date",
        ];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                item.set(field, req.body[field]);
            }
        }

        await item.save();

        return res.json({
            success: true,
            message: "Report updated successfully",
            item,
        });
    } catch (error) {
        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid item details",
            });
        }

        console.error("Update item error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to update report",
        });
    }
};


const deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                message: "Item not found",
            });
        }

        // Verify ownership before deleting anything.
        if (item.reportedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to delete this item",
            });
        }

        // Delete the associated Cloudinary image, if present.
        if (item.imagePublicId) {
            try {
                await cloudinary.uploader.destroy(item.imagePublicId);
            } catch (cloudinaryError) {
                console.error(
                    "Cloudinary image deletion failed:",
                    cloudinaryError.message
                );

                // Keep the database record if image cleanup fails.
                return res.status(502).json({
                    message:
                        "Could not delete the item's image. The report was not deleted. Please try again.",
                });
            }
        }

        await Item.findByIdAndDelete(item._id);

        return res.status(200).json({
            message: "Item and associated image deleted successfully",
        });
    } catch (error) {
        console.error("Delete item error:", error);

        return res.status(500).json({
            message: "Server error while deleting item",
        });
    }
};

module.exports = {
    createItem,
    getItems,
    getItemById,
    getMyReports,
    updateItem,
    deleteItem,
};