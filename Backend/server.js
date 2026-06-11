require("dotenv").config(); // loaded

const express = require("express");
const cors = require("cors");
const connectDB = require("./database/db");
const redisClient = require("./config/redis");
const controlPlane = require("./middlewares/neuralcontrol");
const authRouter = require("./routes/auth-Routes");
const donationRouter = require("./routes/donation-Routes");
const ngoRouter = require("./routes/ngo-Routes");
const statsRouter = require("./routes/stats-Routes");
const aiRoutes = require("./routes/ai-Routes");
const uploadRouter = require("./routes/upload-Routes");
const adminRouter = require("./routes/admin-Routes");

connectDB();
redisClient.connect().catch(console.error);

const app = express();

// Middlewares
app.use(cors({
    origin: ["https://annsetu.online", "https://www.annsetu.online"],
    credentials: true // essential for your secure cookies to work
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/donations", donationRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/ngos", ngoRouter);
app.use("/api/stats", statsRouter);
app.use("/api/ai", aiRoutes);

// Health check
app.get("/", (req, res) => res.json({ success: true, message: "Annsetu API is running" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);

    // Pre-warm the NeuralControl config cache for all registered endpoints
    // This ensures AI decisions are ready before the first real request hits
    try {
        await controlPlane.initialize([
            // Auth routes
            "/api/auth/signup",
            "/api/auth/login",
            "/api/auth/me",
            // Donation routes
            "/api/donations",
            "/api/donations/my",
            "/api/donations/stats",
            // AI routes
            "/api/ai/analyze-food",
            "/api/ai/match-donation",
            "/api/ai/chat",
            // NGO routes
            "/api/ngos",
            "/api/ngos/profile",
            // Stats route
            "/api/stats",
            // Admin routes
            "/api/admin",
            // Upload route
            "/api/upload",
            // DB config keys (used in withDbTimeout)
            "/db/stats/aggregate",
            "/db/donations/find",
            "/db/donations/create",
            "/db/users/find",
        ]);
        console.log("NeuralControl: All endpoints pre-warmed ✓");
    } catch (err) {
        console.warn("NeuralControl: Pre-warm failed (non-critical):", err.message);
    }
});