"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const userRouter = (0, express_1.Router)();
// Hanya admin yang bisa akses endpoint ini
userRouter.get("/", auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleGuard)(["ADMIN"]), user_controller_1.getAllUsersController);
userRouter.patch("/:userId/role", auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleGuard)(["ADMIN"]), user_controller_1.updateRoleController);
exports.default = userRouter;
