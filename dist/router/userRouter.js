"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const Users_1 = require("../models/Users");
const uuid_1 = require("uuid");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleware_1 = require("../middleware");
exports.router = express_1.default.Router();
exports.router.get("/users", 
// checkLoginMiddleware,
async (request, response) => {
    const limit = request.query?.limit;
    try {
        const users = await Users_1.UserInstance.findAll({
            where: {},
            limit: limit,
        });
        return response.status(200).json({
            message: "Successfully fetching users ✅",
            users,
        });
    }
    catch (error) {
        return response.status(404).json({
            message: "Something went wrong ❌",
            error,
        });
    }
});
exports.router.post("/register", async (request, response) => {
    const encrypted_password = await (0, bcrypt_1.hash)(request.body.password, 10);
    try {
        const _id = (0, uuid_1.v4)();
        const user = await Users_1.UserInstance.create({
            ...request.body,
            _id,
            password: encrypted_password,
        });
        return response.status(200).json({
            message: `A new user ${request.body.username} register successful ✅`,
            user,
        });
    }
    catch (error) {
        return response.status(400).json({
            message: "Something went wrong ❌",
            error,
        });
    }
});
exports.router.put("/update/:id", middleware_1.checkLoginMiddleware, async (request, response) => {
    const { id } = request.params;
    const encrypted_password = await (0, bcrypt_1.hash)(request.body.password, 10);
    try {
        const curr_user = await Users_1.UserInstance.findOne({ where: { _id: id } });
        if (!curr_user) {
            return response.json({
                message: "Your request user dose not exist ❌",
            });
        }
        const updated_user = await curr_user.update({
            _id: id,
            ...request.body,
            password: encrypted_password,
        });
        return response.json({
            message: `User ${request.body.username} updated successfully`,
            updated_user,
        });
    }
    catch (error) {
        return response.json({
            message: "Something went wrong ❌",
            error,
        });
    }
});
exports.router.delete("/delete/:id", middleware_1.checkLoginMiddleware, async (request, response) => {
    const { id } = request.params;
    try {
        await Users_1.UserInstance.destroy({
            where: {
                _id: id,
            },
        });
        return response.json({
            message: "Your request user successfully deleted ✅",
        });
    }
    catch (error) {
        return response.json({
            message: "Something went wrong ❌",
            error,
        });
    }
});
exports.router.post("/login", async (request, response) => {
    try {
        const user = await Users_1.UserInstance.findOne({
            where: {
                email: request.body.email,
            },
        });
        if (user) {
            const requestPassword = await (0, bcrypt_1.compare)(request.body.password, user.getDataValue("password"));
            if (requestPassword) {
                const token = jsonwebtoken_1.default.sign({
                    username: user.getDataValue("username"),
                    email: user.getDataValue("email"),
                }, process.env.JWT_KEY, {
                    expiresIn: "30d",
                });
                return response.status(200).json({
                    message: "Login successful ✅",
                    access_token: token,
                });
            }
            else {
                return response.status(401).json({
                    message: "Login failed ❌",
                });
            }
        }
        else {
            return response.status(401).json({
                message: "Login Failed ❌",
            });
        }
    }
    catch (error) {
        return response.status(401).json({
            message: "Something went wrong ❌",
            error,
        });
    }
});
