"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRole = updateUserRole;
exports.getAllUsers = getAllUsers;
const prisma_1 = __importDefault(require("../lib/prisma"));
const customError_1 = require("../utils/customError");
async function updateUserRole(userId, newRole) {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw (0, customError_1.createCustomError)(404, "User not found");
        }
        const updatedUser = await prisma_1.default.user.update({
            where: { id: userId },
            data: { role: newRole },
            select: {
                id: true,
                email: true,
                name: true,
                role: true
            }
        });
        return updatedUser;
    }
    catch (err) {
        throw err;
    }
}
async function getAllUsers() {
    try {
        const users = await prisma_1.default.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return users;
    }
    catch (err) {
        throw err;
    }
}
