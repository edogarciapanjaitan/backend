"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = loginController;
exports.registerController = registerController;
const auth_service_1 = require("../services/auth.service");
const auth_service_2 = require("../services/auth.service");
const env_config_1 = require("../config/env.config");
async function loginController(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const result = await (0, auth_service_1.login)(email, password);
        const { user, token, role, message } = result || {};
        // Response berbeda berdasarkan role dengan redirect URL
        const baseUrl = env_config_1.BASE_WEB_URL || "";
        if (role === "ADMIN") {
            return res.status(200).json({
                message: message || "Admin login successful",
                success: true,
                user: Object.assign(Object.assign({}, user), { role: "ADMIN" }),
                token,
                accessLevel: "admin",
                redirectUrl: `${baseUrl}/admin/dashboard` // URL untuk redirect admin
            });
        }
        else {
            return res.status(200).json({
                message: message || "User login successful",
                success: true,
                user: Object.assign(Object.assign({}, user), { role: "USER" }),
                token,
                accessLevel: "user",
                redirectUrl: `${baseUrl}/home` // URL untuk redirect user (menggunakan /home yang sudah ada)
            });
        }
    }
    catch (err) {
        next(err);
    }
}
async function registerController(req, res, next) {
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
        const data = await (0, auth_service_2.register)({
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
    }
    catch (err) {
        // Handle error dengan response yang konsisten
        const statusCode = err.statusCode || 500;
        const message = err.message || "Internal server error";
        return res.status(statusCode).json({
            message,
            success: false
        });
    }
}
