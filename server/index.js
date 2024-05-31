require("dotenv").config();
const app = require('./src/app');
const connectDB = require('./src/config/db')

// Uncaught Expections
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server, Uncaught Exceptions");
    process.exit(1);
});

connectDB();

const server = app.listen(process.env.PORT, () => {
    console.log(
        `Server started at PORT:${process.env.PORT} in MODE:${process.env.NODE_ENV}`
    );
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server, Unhandled Promise Rejection");

    server.close(() => {
        process.exit(1);
    });
});
