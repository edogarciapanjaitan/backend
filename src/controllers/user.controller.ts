import { Request, Response, NextFunction } from "express";
import { updateUserRole, getAllUsers } from "../services/user.service";

export async function updateRoleController(
    req: Request,
    res: Response,
    next: NextFunction
) {
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

        const updatedUser = await updateUserRole(Number(userId), role);

        return res.status(200).json({
            message: "User role updated successfully",
            success: true,
            data: updatedUser
        });
    } catch (err: any) {
        const statusCode = err.statusCode || 500;
        const message = err.message || "Internal server error";
        
        return res.status(statusCode).json({
            message,
            success: false
        });
    }
}

export async function getAllUsersController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const users = await getAllUsers();

        return res.status(200).json({
            message: "Users retrieved successfully",
            success: true,
            data: users
        });
    } catch (err: any) {
        const statusCode = err.statusCode || 500;
        const message = err.message || "Internal server error";
        
        return res.status(statusCode).json({
            message,
            success: false
        });
    }
}

