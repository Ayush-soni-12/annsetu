const mongoose = require("mongoose");

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully");

    }catch(e){
        console.error("MongoDB connection failed:", e.message);
        process.exit(1);
    }
 }

 module.exports = connectDB;