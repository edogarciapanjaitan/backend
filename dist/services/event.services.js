"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventById = getEventById;
exports.getAllEvent = getAllEvent;
exports.createEvent = createEvent;
exports.updateEvent = updateEvent;
const prisma_1 = __importDefault(require("../lib/prisma"));
const customError_1 = require("../utils/customError");
const auth_service_1 = require("./auth.service");
async function getEventById(id) {
    try {
        const event = await prisma_1.default.event.findUnique({
            where: { id },
        });
        if (!event)
            throw (0, customError_1.createCustomError)(404, "Event not found");
        return event;
    }
    catch (err) {
        throw err;
    }
}
async function getAllEvent(page = 1, pageSize = 10, filter) {
    try {
        if (filter.title)
            filter.title = {
                contains: filter.title,
                mode: "insensitive",
            };
        const event = await prisma_1.default.event.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: filter,
        });
        return event;
    }
    catch (err) {
        throw err;
    }
}
async function createEvent(email, params) {
    try {
        const user = await (0, auth_service_1.getUserByEmail)(email);
        if (!user)
            throw (0, customError_1.createCustomError)(410, "Invalid user");
        const event = await prisma_1.default.event.create({
            data: Object.assign(Object.assign({}, params), { user_id: user.id }),
        });
        return event;
    }
    catch (err) {
        throw err;
    }
}
async function updateEvent(id, params) {
    try {
        const event = await prisma_1.default.event.update({
            where: { id },
            data: params,
        });
        return event;
    }
    catch (err) {
        throw err;
    }
}
