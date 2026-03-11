"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const node_http_1 = __importDefault(require("node:http"));
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const PORT = process.env.PORT;
const server = node_http_1.default.createServer(app_1.default);
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
process.on("SIGINT", () => {
    server.close(() => {
        console.log("Server closed");
        mongoose_1.default.connection.close();
        process.exit(0);
    });
});
process.on("SIGTERM", () => {
    server.close(() => {
        console.log("Server closed");
        mongoose_1.default.connection.close();
        process.exit(0);
    });
});
