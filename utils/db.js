const mongoose = require("mongoose");

// const uri ="mongodb://127.0.0.1:27017/isTravels"

const uri = process.env.MONGODB_URI;
const connectDB = async () =>{
    try{
        await mongoose.connect(uri)
    }catch(error){
        console.error("database connection failed");
        process.exit(0);
    }
}

module.exports = connectDB;