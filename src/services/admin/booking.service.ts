import { prisma } from "config/client";
import { Request, Response } from "express";
import { getAdminBookingGrid } from "services/client/booking.service";

export const getAdminBookingPage = async (req: Request, res: Response) => {
    const date =
        (req.query.date as string) ||
        new Date().toISOString().split("T")[0];

    const grid = await getAdminBookingGrid(new Date(date));

    res.render("admin/booking/show.ejs", {
        date,
        grid,
    });
};

export const cancelBooking = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    await prisma.booking.update({
        where: { id },
        data: { status: "CANCELLED" },
    });

    res.redirect("admin/booking");
};

export const markBookingPaid = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    await prisma.booking.update({
        where: { id },
        data: { status: "PAID" },
    });

    res.redirect("admin/booking");
};
