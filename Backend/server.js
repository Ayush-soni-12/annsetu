require("dotenv").config();
const express = require("express");
const connectDB = require("./database/db"); 
const authRouter = require("./routes/auth-Routes");


connectDB();
const app = express();

//middleware
app.use(express.json());

app.use("/api/auth", authRouter);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});