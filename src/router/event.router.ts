import { Router } from "express";
import { createEventController, getAllEventController, getEventByIdController } from "../controllers/event.controller";
import { authMiddleware, roleGuard } from "../middlewares/auth.middleware";


const eventRouter = Router();

eventRouter.get("/", authMiddleware, getAllEventController);
eventRouter.get("/:id", getEventByIdController);
eventRouter.post("/", authMiddleware, roleGuard(["ADMIN"]), createEventController);
// eventRouter.patch("/:id");
// eventRouter.delete("/:id");

export default eventRouter;