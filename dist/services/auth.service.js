"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.getUserByEmail = getUserByEmail;
exports.register = register;
const prisma_1 = __importDefault(require("../lib/prisma"));
const customError_1 = require("../utils/customError");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const env_config_1 = require("../config/env.config");
const bcrypt_2 = __importDefault(require("bcrypt"));
async function login(email, password) {
    try {
        const user = await getUserByEmail(email);
        if (!user)
            throw (0, customError_1.createCustomError)(401, "Invalid email or password");
        if (!user.password)
            throw (0, customError_1.createCustomError)(500, "User password not stored");
        const isValidPassword = await bcrypt_2.default.compare(password, user.password);
        if (!isValidPassword)
            throw (0, customError_1.createCustomError)(401, "Invalid email or password");
        // Membedakan role user dan admin
        const isAdmin = user.role === "ADMIN";
        const isUser = user.role === "USER";
        // Validasi role
        if (!isAdmin && !isUser) {
            throw (0, customError_1.createCustomError)(403, "Invalid user role");
        }
        const payload = {
            email: user.email,
            role: user.role,
            name: user.name,
            id: user.id
        };
        // Token expiration berbeda untuk admin (lebih lama) dan user
        const tokenExpiration = isAdmin ? "24h" : "1h";
        const token = (0, jsonwebtoken_1.sign)(payload, env_config_1.SECRET_KEY, { expiresIn: tokenExpiration });
        return {
            user: Object.assign(Object.assign({}, payload), { isAdmin,
                isUser }),
            token,
            role: user.role,
            message: isAdmin ? "Admin login successful" : "User login successful"
        };
    }
    catch (err) {
        throw err;
    }
}
async function getUserByEmail(email) {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: {
                email
            }
        });
        return user;
    }
    catch (err) {
        throw err;
    }
}
async function register(params) {
    try {
        const IsExist = await getUserByEmail(params.email);
        if (IsExist)
            throw (0, customError_1.createCustomError)(401, "Email already exist");
        const salt = (0, bcrypt_1.genSaltSync)(10);
        const hashedPassword = (0, bcrypt_1.hashSync)(params.password, salt);
        const user = await prisma_1.default.user.create({
            select: {
                email: true,
                name: true,
            },
            data: {
                email: params.email,
                password: hashedPassword,
                name: params.name,
                role: "USER",
                referral_code: params.referralCode || null,
            },
        });
        return user;
    }
    catch (err) {
        throw err;
    }
}
