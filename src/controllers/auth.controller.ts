import { Request, Response, NextFunction } from "express";
import { login } from "../services/auth.service";
import { register } from "../services/auth.service";
import { BASE_WEB_URL } from "../config/env.config";

export async function loginController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
         const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const result: any = await login(email, password);

        const { user, token, role, message } = result || {};

        // Response berbeda berdasarkan role dengan redirect URL
        const baseUrl = BASE_WEB_URL || "";
        
        if (role === "ADMIN") {
            return res.status(200).json({
                message: message || "Admin login successful",
                success: true,
                user: {
                    ...user,
                    role: "ADMIN"
                },
                token,
                accessLevel: "admin",
                redirectUrl: `${baseUrl}/admin/dashboard` // URL untuk redirect admin
            });
        } else {
            return res.status(200).json({
                message: message || "User login successful",
                success: true,
                user: {
                    ...user,
                    role: "USER"
                },
                token,
                accessLevel: "user",
                redirectUrl: `${baseUrl}/home` // URL untuk redirect user (menggunakan /home yang sudah ada)
            });
        }
    } catch (err) {
        next(err);
    }

}
export async function registerController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {   
        const { email, password, firstname, lastname, referralCode } = req.body;

        // Validasi input
        if (!email || !password || !firstname || !lastname) {
            return res.status(400).json({
                message: "Email, password, firstname, and lastname are required",
                success: false
            });
        }

        // Gabungkan firstname dan lastname menjadi name
        const name = `${firstname || ""} ${lastname || ""}`.trim() || email;

        const data = await register({
            firstname, 
            lastname, 
            email, 
            password,
            confirmPassword: password,
            name: name,
            referralCode: referralCode || undefined
        });

        return res.status(201).json({
            message: "Registration successful",
            success: true,
            data,
        });
        
    } catch (err: any) {
        // Handle error dengan response yang konsisten
        const statusCode = err.statusCode || 500;
        const message = err.message || "Internal server error";
        
        return res.status(statusCode).json({
            message,
            success: false
        });
    }
    
}

