import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";
import { createCustomError } from "../utils/customError";
import { hashSync, genSaltSync, compareSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import { SECRET_KEY } from "../config/env.config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";



export async function login(email: string, password: string) {
    try {
        const user = await getUserByEmail(email);

        if (!user) throw createCustomError(401, "Invalid email or password");
         if (!user.password) throw createCustomError(500, "User password not stored");

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) throw createCustomError(401, "Invalid email or password");
        
        // Membedakan role user dan admin
        const isAdmin = user.role === "ADMIN";
        const isUser = user.role === "USER";
        
        // Validasi role
        if (!isAdmin && !isUser) {
            throw createCustomError(403, "Invalid user role");
        }
        
        const payload = {
            email: user.email,
            role: user.role,
            name: user.name,
            id: user.id
        };

        // Token expiration berbeda untuk admin (lebih lama) dan user
        const tokenExpiration = isAdmin ? "24h" : "1h";
        const token = sign(payload, SECRET_KEY, {expiresIn: tokenExpiration});

        return {
            user: {
                ...payload,
                isAdmin,
                isUser
            },
            token,
            role: user.role,
            message: isAdmin ? "Admin login successful" : "User login successful"
        };     
    } catch (err) {
        throw err; 
    }
}

export async function getUserByEmail(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where : {
                email
            }
        });
        
        return user;
    } catch (err) {
        throw err;
    }
}

interface RegisterInput extends Prisma.UserCreateInput {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    referralCode?: string;
}

export async function register(params: RegisterInput) {
    try {
        const IsExist = await getUserByEmail(params.email);

        if (IsExist) throw createCustomError(401, "Email already exist");

        const salt = genSaltSync(10);
        const hashedPassword = hashSync(params.password, salt);

        const user = await prisma.user.create({
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
    } catch (err) {
        throw err;
    }
}