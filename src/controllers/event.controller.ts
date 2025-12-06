import { Request, Response, NextFunction } from "express";
import { createEvent, getAllEvent, getEventById } from "../services/event.services";
import { Token } from "../middlewares/auth.middleware";

export async function getAllEventController(
    req: Request, 
    res: Response, 
    next: NextFunction
) {
    try {  
        const { page, pageSize, title } = req.query;

        const pageParams = page ? Number(page) : 1;
        const pageSizeparams = pageSize ? Number(pageSize) : 10;

        const data = await getAllEvent (pageParams, pageSizeparams, {
            title: title as string,
    });

    res.json({
        message: "OK",
        data,
    });
    } catch (err) {
        next(err);
    }
}

export async function createEventController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const user = req.user as Token;

        const { title, description, location, schedule, cover_img, date } = req.body;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          

        const slug = title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");

        const data = await createEvent(user?.email, {
            title,
            description,
            location, 
            schedule,
            cover_img,
            date,
            slug,
        });

        res.json({
            message: "OK",
            data,
        })
    } catch (err) {
        next(err);
    }
}

export async function getEventByIdController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { id } = req.params;
        const data = await getEventById(Number(id));

        res.json({
            message: "OK",
            data,
        })
    } catch (err) {
        next(err);
    }
}