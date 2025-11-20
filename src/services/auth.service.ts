import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";
import { createCustomError } from "../utils/customError";
import { hashSync, genSaltSync, compareSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import { SECRET_KEY } from "../config/env.config";

export async function login(email: string, password: string) {
    try {
        const user = await getUserByEmail(email);

        if (!user) throw createCustomError(401, "Invalid email or password");

        const isValidPassword = compareSync(password, user.password);

        if (!isValidPassword) throw createCustomError(401, "Invalid email or password");
        
        const payload = {
            email: user.email,
            role: user.role,
            name: user.name
        };

        const token = sign(payload, SECRET_KEY, {expiresIn: "1h"});

        return {
            user: payload,
            token,
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

export async function register(params: Prisma.UserCreateInput) {
    try {
        const IsExist = await getUserByEmail(params.email);

        if (IsExist) throw createCustomError (401, "Email already exist");

        const salt = genSaltSync(10);
        const hashedPassword = hashSync(params.password, salt);

        const user = await prisma.user.create({
            select: {
                email: true,
            },
            data: {
                email: params.email,
                password: hashedPassword,
            },
        });
        return user;  
    } catch (err) {
        throw err;
    }
}