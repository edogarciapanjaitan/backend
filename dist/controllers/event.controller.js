"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllEventController = getAllEventController;
exports.createEventController = createEventController;
exports.getEventByIdController = getEventByIdController;
const event_services_1 = require("../services/event.services");
async function getAllEventController(req, res, next) {
    try {
        const { page, pageSize, title } = req.query;
        const pageParams = page ? Number(page) : 1;
        const pageSizeparams = pageSize ? Number(pageSize) : 10;
        const data = await (0, event_services_1.getAllEvent)(pageParams, pageSizeparams, {
            title: title,
        });
        res.json({
            message: "OK",
            data,
        });
    }
    catch (err) {
        next(err);
    }
}
async function createEventController(req, res, next) {
    try {
        const user = req.user;
        const { title, description, location, schedule, cover_img } = req.body;
        const slug = title
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");
        const data = await (0, event_services_1.createEvent)(user === null || user === void 0 ? void 0 : user.email, {
            title,
            description,
            location,
            schedule,
            cover_img,
            slug,
        });
        res.json({
            message: "OK",
            data,
        });
    }
    catch (err) {
        next(err);
    }
}
async function getEventByIdController(req, res, next) {
    try {
        const { id } = req.params;
        const data = await (0, event_services_1.getEventById)(Number(id));
        res.json({
            message: "OK",
            data,
        });
    }
    catch (err) {
        next(err);
    }
}
