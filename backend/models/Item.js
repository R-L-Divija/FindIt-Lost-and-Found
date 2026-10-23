
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },

        type: {
            type: String,
            enum: ["lost", "found"],
            required: true,
        },

        category: {
            type: String,
            required: true,
            enum: [
                "Electronics",
                "ID Cards",
                "Bags",
                "Keys",
                "Books",
                "Clothing",
                "Jewelry",
                "Documents",
                "Other",
            ],
        },

        location: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },

        date: {
            type: Date,
            required: true,
        },

        imageUrl: {
            type: String,
            default: "",
        },

        imagePublicId: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: ["open", "claim_pending", "claimed", "reunited", "closed"],
            default: "open",
        },

        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

itemSchema.index({ type: 1, status: 1, createdAt: -1 });
itemSchema.index({ category: 1, location: 1 });

module.exports = mongoose.model("Item", itemSchema);
