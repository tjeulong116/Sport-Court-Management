import { Request, Response } from "express";

import { prisma } from "config/client";

export async function getPricing(req: Request, res: Response) {
    const date = req.query.date as string;
    prisma
    const rules = await prisma.pricingRule.findMany({
        where: {
            date: {
                gte: new Date(`${date}T00:00:00`),
                lt: new Date(`${date}T23:59:59`)
            }
        },
        orderBy: [{ startTime: "asc" }]
    });

    res.json(rules);
}

// GET /admin/pricing?date=YYYY-MM-DD
export const getPricingPage = async (req: Request, res: Response) => {
    const date =
        (req.query.date as string) ||
        new Date().toISOString().split("T")[0];

    const rules = await prisma.pricingRule.findMany({
        where: {
            date: {
                gte: new Date(`${date}T00:00:00`),
                lt: new Date(`${date}T23:59:59`),
            },
        },
        include: {
            court: true,
        },
        orderBy: [{ startTime: "asc" }],
    });

    const courts = await prisma.court.findMany({
        where: { isActive: true },
    });

    res.render("admin/pricing/index.ejs", {
        date,
        rules,
        courts,
    });
};

// POST /admin/pricing
export const createPricing = async (req: Request, res: Response) => {
    const { date, startTime, endTime, price, courtId } = req.body;

    // basic validation
    if (!startTime || !endTime || endTime <= startTime) {
        return res.status(400).send("Invalid time range");
    }

    if (Number(price) <= 0) {
        return res.status(400).send("Price must be greater than 0");
    }

    const dayStart = new Date(`${date}T00:00:00`);
    const dayEnd = new Date(`${date}T23:59:59`);

    // Check overlapping rules
    const overlappingRule = await prisma.pricingRule.findFirst({
        where: {
            date: {
                gte: dayStart,
                lt: dayEnd,
            },
            courtId: courtId ? Number(courtId) : null,
            isActive: true,

            // overlap condition
            AND: [
                { startTime: { lt: endTime } },
                { endTime: { gt: startTime } },
            ],
        },
    });

    if (overlappingRule) {
        return res.status(400).send(
            `Pricing rule overlaps with existing rule (${overlappingRule.startTime} – ${overlappingRule.endTime})`
        );
    }

    // Safe to create new rule
    await prisma.pricingRule.create({
        data: {
            date: new Date(`${date}T00:00:00`),
            startTime,
            endTime,
            price: Number(price),
            courtId: courtId ? Number(courtId) : null,
        },
    });

    res.redirect(`/admin/pricing?date=${date}`);
};


// POST /admin/pricing/delete/:id
export const deletePricing = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    await prisma.pricingRule.delete({
        where: { id },
    });

    res.redirect("/admin/pricing");
};
