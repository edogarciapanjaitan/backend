import prisma from "../lib/prisma";
import { createCustomError } from "../utils/customError";

export async function updateUserRole(userId: number, newRole: "ADMIN" | "USER") {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw createCustomError(404, "User not found");
        }

        const updatedUser = await prisma.user.update({
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
    } catch (err) {
        throw err;
    }
}

export async function getAllUsers() {
    try {
        const users = await prisma.user.findMany({
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
    } catch (err) {
        throw err;
    }
}

