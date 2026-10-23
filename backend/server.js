require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const { protect } = require("./middleware/authMiddleware");

const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
        ],
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "FindIt backend is running!",
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "FindIt API is healthy",
    });
});

app.use("/api/auth", authRoutes);

app.get("/api/auth/me", protect, (req, res) => {
    res.json({
        success: true,
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
        },
    });
});

app.use("/api/items", itemRoutes);
app.use("/api/uploads", uploadRoutes);

app.use((err, req, res, next) => {
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            success: false,
            message: "Image must be 5 MB or smaller",
        });
    }

    if (err.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({
            success: false,
            message: "Only one image can be uploaded at a time",
        });
    }

    if (err.message?.startsWith("Only JPG, PNG, and WebP")) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    console.error("Server error:", err.message);

    return res.status(500).json({
        success: false,
        message: "An unexpected server error occurred",
    });
});

// Local development only
if (require.main === module) {
    const PORT = process.env.PORT || 5000;

    connectDB()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`FindIt server running on port ${PORT}`);
            });
        })
        .catch((error) => {
            console.error("Failed to start FindIt:", error.message);
            process.exit(1);
        });
}

module.exports = app;