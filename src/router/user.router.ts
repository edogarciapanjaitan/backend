import { Router } from "express";
import { updateRoleController, getAllUsersController } from "../controllers/user.controller";
import { authMiddleware, roleGuard } from "../middlewares/auth.middleware";

const userRouter = Router();

// Hanya admin yang bisa akses endpoint ini
userRouter.get("/", authMiddleware, roleGuard(["ADMIN"]), getAllUsersController);
userRouter.patch("/:userId/role", authMiddleware, roleGuard(["ADMIN"]), updateRoleController);

export default userRouter;

