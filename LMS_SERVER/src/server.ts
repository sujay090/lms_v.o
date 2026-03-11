import dotenv from "dotenv";
dotenv.config();
import http from "node:http";
import app from "./app";
import mongoose from "mongoose";

const PORT = process.env.PORT;

const server = http.createServer(app);


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

process.on("SIGINT", () => {
    server.close(() => {
        console.log("Server closed");
        mongoose.connection.close();
        process.exit(0);
    })
})

process.on("SIGTERM", () => {
    server.close(() => {
        console.log("Server closed");
        mongoose.connection.close();
        process.exit(0);
    })
})
