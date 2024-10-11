"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_config_1 = __importDefault(require("./config/database.config"));
const userRouter_1 = require("./router/userRouter");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
database_config_1.default.sync()
    .then(() => {
    console.log("Database Connected Successfully ✅");
})
    .catch((err) => console.log("❌" + err));
const app = (0, express_1.default)();
// app.use(cors(CorsOption));
app.use((0, cors_1.default)({
    origin: "*",
}));
dotenv_1.default.config();
app.use(express_1.default.json());
app.use("/api/v1", userRouter_1.router);
app.listen(3200, () => {
    console.log("🚀 Server running at ::: http://localhost:3200");
});
