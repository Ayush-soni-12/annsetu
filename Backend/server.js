require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database/db");
const authRouter = require("./routes/auth-Routes");

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

// Health check
app.get("/", (req, res) => res.json({ success: true, message: "Annsetu API is running" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});