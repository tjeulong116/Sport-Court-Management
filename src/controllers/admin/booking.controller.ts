import { prisma } from "config/client";
import { Request, Response } from "express";
import { add30Min, createBooking, getBookingGrid } from "services/client/booking.service";

export async function getGrid(req: Request, res: Response) {
    const dateParam = req.query.date as string;

    if (!dateParam) {
        return res.status(400).json({ message: "date is required" });
    }

    const date = new Date(dateParam);

    const grid = await getBookingGrid(date);

    return res.json(grid);
}

export async function postBooking(req: Request, res: Response) {
    try {
        const userId = req.user!.id; // you already use passport
        const { courtId, date, startTimes } = req.body;

        const bookings = await createBooking({
            userId,
            courtId: Number(courtId),
            date,
            startTimes,
            price: Number(req.body.price),
            status: req.body.status
        });

        return res.json({ success: true, bookings });
    } catch (err: any) {
        return res.status(400).json({ success: false, message: err.message });
    }
}

export const getBookingDetailPage = async (req: Request, res: Response) => {
    const { courtId, date, time } = req.query;
    const isPast = new Date(`${date as string}T${time}:00`) < new Date();

    const booking = await prisma.booking.findFirst({
        where: {
            courtId: Number(courtId),
            date: new Date(`${date}T00:00:00`),
            startTime: time as string,
            status: { in: ["PAID", "PENDING"] },
        },
        include: {
            user: true,
            court: true,
        },
    });

    res.render("admin/booking/detail.ejs", {
        booking,
        courtId,
        date,
        time,
        isPast
    });
};

export const postCreateBooking = async (req: Request, res: Response) => {
    const { courtId, date, startTime, price } = req.body;

    await prisma.booking.create({
        data: {
            courtId: Number(courtId),
            userId: req.user!.id,
            date: new Date(`${date}T00:00:00`),
            startTime: startTime,
            endTime: add30Min(startTime),
            price: Number(price),
            status: "PAID",

        },
    });

    res.redirect(`/admin/booking?date=${date}`);
}
