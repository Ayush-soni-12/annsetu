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
    origin: ["https://annsetu.online", "https://an.annsetu.online"],
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

// ── 404 handler – must come AFTER all routes ─────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Cannot ${req.method} ${req.originalUrl}` });
});

// ── Global error handler – catches anything thrown in route/middleware ────────
// Express requires the 4-arg signature to recognise this as an error handler.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    const status = err.status || err.statusCode || 500;
    res.status(status).json({ success: false, message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);

    // Pre-warm the NeuralControl config cache for all registered endpoints.
    // These strings MUST exactly match the keys passed to controlPlane.middleware()
    // in each route file so the SDK fetches the right AI config for each endpoint.
    try {
        await controlPlane.initialize([
            // ── Auth routes (auth-Routes.js) ──────────────────────────
            "/api/auth/signup",          // POST /api/auth/signup       (DONOR)
            "/api/auth/signup/ngo",      // POST /api/auth/signup/ngo   (NGO)
            "/api/auth/login",           // POST /api/auth/login
            "/api/auth/logout",          // POST /api/auth/logout
            "/api/auth/me",              // GET  /api/auth/me  &  PUT /api/auth/me

            // ── Donation routes (donation-Routes.js) ──────────────────
            "/api/donations",            // POST /api/donations          (create)
            "/api/donations/my",         // GET  /api/donations/my
            "/api/donations/stats",      // GET  /api/donations/stats
            "/api/donations/:id",        // GET  /api/donations/:id

            // ── AI routes (ai-Routes.js) ──────────────────────────────
            "/api/ai/food-safety",       // POST /api/ai/food-safety
            "/api/ai/match-donation",    // POST /api/ai/match-donation
            "/api/ai/chat",              // POST /api/ai/chat

            // ── NGO routes (ngo-Routes.js) ────────────────────────────
            "/api/ngos",                 // GET  /api/ngos               (public list)
            "/api/ngos/my-profile",      // GET  /api/ngos/my-profile  & PUT
            "/api/ngos/donations",       // GET  /api/ngos/donations
            "/api/ngos/:id",             // GET  /api/ngos/:id           (public profile)

            // ── Stats route (stats-Routes.js) ─────────────────────────
            "/api/stats",                // GET  /api/stats

            // ── Admin routes (admin-Routes.js — uses router.use) ──────
            "/api/admin",                // All admin endpoints share one key

            // ── Upload route (upload-Routes.js) ───────────────────────
            "/api/upload",               // POST /api/upload

            // ── Internal DB config keys (used in withDbTimeout calls) ──
            "/db/donations/create",
            "/db/donations/find",
            "/db/users/find",
            "/db/stats/aggregate",
            "/db/ngos/find",
            "/db/ngos/update",
            "/db/ngos/match",
            "/db/admin/users",
            "/db/admin/ngos",
            "/db/admin/donations",
        ]);
        console.log("NeuralControl: All endpoints pre-warmed ✓");
        console.log(controlPlane)
    } catch (err) {
        console.warn("NeuralControl: Pre-warm failed (non-critical):", err.message);
    }
});