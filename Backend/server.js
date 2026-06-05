require("dotenv").config(); // loaded

const express = require("express");
const cors = require("cors");
const connectDB = require("./database/db");
const authRouter = require("./routes/auth-Routes");
const donationRouter = require("./routes/donation-Routes");
const uploadRouter = require("./routes/upload-Routes");
const ngoRouter = require("./routes/ngo-Routes");
const statsRouter = require("./routes/stats-Routes");

connectDB();
const app = express();

// Middlewares
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // React dev server
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/donations", donationRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/ngos", ngoRouter);
app.use("/api/stats", statsRouter);

// Health check
app.get("/", (req, res) => res.json({ success: true, message: "Annsetu API is running" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});