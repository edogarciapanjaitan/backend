"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoleController = updateRoleController;
exports.getAllUsersController = getAllUsersController;
const user_service_1 = require("../services/user.service");
async function updateRoleController(req, res, next) {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        // Validasi role
        if (role !== "ADMIN" && role !== "USER") {
            return res.status(400).json({
                message: "Role must be either 'ADMIN' or 'USER'",
                success: false
            });
        }
        const updatedUser = await (0, user_service_1.updateUserRole)(Number(userId), role);
        return res.status(200).json({
            message: "User role updated successfully",
            success: true,
            data: updatedUser
        });
    }
    catch (err) {
        const statusCode = err.statusCode || 500;
        const message = err.message || "Internal server error";
        return res.status(statusCode).json({
            message,
            success: false
        });
    }
}
async function getAllUsersController(req, res, next) {
    try {
        const users = await (0, user_service_1.getAllUsers)();
        return res.status(200).json({
            message: "Users retrieved successfully",
            success: true,
            data: users
        });
    }
    catch (err) {
        const statusCode = err.statusCode || 500;
        const message = err.message || "Internal server error";
        return res.status(statusCode).json({
            message,
            success: false
        });
    }
}
