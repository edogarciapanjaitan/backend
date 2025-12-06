import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

import { createCustomError } from "../utils/customError";

import { getUserByEmail } from "./auth.service";



export async function getEventById(id: number) {
    try {
        const event = await prisma.event.findUnique({
            where: {id},
        });

        if (!event) throw createCustomError(404, "Event not found");

        return event;
    } catch (err) {
        throw err;
    }
    
}


export async function getAllEvent (
    page: number = 1, 
    pageSize: number = 10,  
    filter: Prisma.EventWhereInput
) {
   try {

    if (filter.title) filter.title = {
        contains: filter.title as string,
        mode: "insensitive",
    }
    const event = await prisma.event.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: filter,

    });

    return event;
   } catch (err) {
        throw err;
   } 
}

export async function createEvent(
    email: string, 
    params: {
        title: string;
        description: string;
        location: string;
        schedule: string;
        cover_img: string;
        date: string;
        slug: string;
    }
) {
    try {
        const user = await getUserByEmail(email);

        if(!user) throw createCustomError(410, "Invalid user");
        const event = await prisma.event.create({
            data: {
                ...params, 
                
                user_id: user.id,
            },
        });

        return event;
    } catch (err) {
        throw err;
    }
} 

export async function updateEvent(
    id: number,
    params: Prisma.EventUpdateInput) {
    try {
        const event = await prisma.event.update({
            where: { id },
            data: params,
        });
        return event;
    } catch (err) {
        throw err;   
    }
}