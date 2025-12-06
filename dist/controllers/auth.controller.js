"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = loginController;
exports.registerController = registerController;
const auth_service_1 = require("../services/auth.service");
const auth_service_2 = require("../services/auth.service");
async function loginController(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const result = await (0, auth_service_1.login)(email, password);
        const { user, token } = result || {};
        return res.status(200).json({
            message: "OK",
            data: { user, token },
        });
    }
    catch (err) {
        next(err);
    }
}
async function registerController(req, res, next) {
    try {
        const { email, password, name } = req.body;
        const data = await (0, auth_service_2.register)({ email, password, name });
        res.json({
            message: "OK",
            data,
        });
    }
    catch (err) {
        next(err);
    }
}
