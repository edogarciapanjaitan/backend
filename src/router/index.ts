import { Router } from "express";
import eventRouter from "./event.router";
import authRouter from "./auth.router";

const router = Router();

router.use("/event", eventRouter);
router.use("/auth", authRouter);


export default router;


