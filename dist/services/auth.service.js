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
async function login(email, password) {
    try {
        const user = await getUserByEmail(email);
        if (!user)
            throw (0, customError_1.createCustomError)(401, "Invalid email or password");
        if (!user.password)
            throw (0, customError_1.createCustomError)(500, "User password not stored");
        const isValidPassword = (0, bcrypt_1.compareSync)(password, user.password);
        if (!isValidPassword)
            throw (0, customError_1.createCustomError)(401, "Invalid email or password");
        const payload = {
            email: user.email,
            role: user.role,
            name: user.name
        };
        const token = (0, jsonwebtoken_1.sign)(payload, env_config_1.SECRET_KEY, { expiresIn: "1h" });
        return {
            user: payload,
            token,
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
            },
            data: {
                email: params.email,
                password: hashedPassword,
                name: params.name,
                role: "USER",
            },
        });
        return user;
    }
    catch (err) {
        throw err;
    }
}
