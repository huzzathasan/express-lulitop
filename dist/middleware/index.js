"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkLoginMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkLoginMiddleware = (request, response, next) => {
    const { authorization } = request.headers;
    try {
        const access_token = authorization?.split(" ")[1];
        jsonwebtoken_1.default.verify(access_token, process.env.JWT_KEY);
        next();
    }
    catch (error) {
        next("Your are not assignable to access this route.");
    }
};
exports.checkLoginMiddleware = checkLoginMiddleware;
