const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const connectDB = async () => {
    let conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
};

module.exports = connectDB;
