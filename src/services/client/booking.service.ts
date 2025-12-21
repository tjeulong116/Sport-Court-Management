import { prisma } from "config/client";

const SLOT_MINUTES = 30;

function generateSlots() {
    const slots: { start: string; end: string }[] = [];
    let hour = 0;
    let minute = 0;

    for (let i = 0; i < 48; i++) {
        const start = `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`;

        minute += SLOT_MINUTES;
        if (minute === 60) {
            minute = 0;
            hour++;
        }

        const end = `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`;

        slots.push({ start, end });
    }

    return slots;
}

async function getSlotPrice(
    date: Date,
    startTime: string,
    courtId: number
) {
    const rule = await prisma.pricingRule.findFirst({
        where: {
            date,
            startTime: { lte: startTime },
            endTime: { gt: startTime },
            isActive: true,
            OR: [{ courtId }, { courtId: null }],
        },
        orderBy: {
            courtId: "desc", // court-specific first
        },
    });

    return rule ? rule.price : 0;
}

export async function getBookingGrid(date: Date) {
    const dayStr = date.toISOString().split("T")[0];
    const todayStr = new Date().toISOString().split("T")[0];
    const now = new Date();

    const courts = await prisma.court.findMany({
        where: { isActive: true },
    });

    const bookings = await prisma.booking.findMany({
        where: {
            date: {
                gte: new Date(`${dayStr}T00:00:00`),
                lt: new Date(`${dayStr}T23:59:59`),
            },
            status: { not: "CANCELLED" },
        },
    });

    const pricingRules = await prisma.pricingRule.findMany({
        where: {
            date: {
                gte: new Date(`${dayStr}T00:00:00`),
                lt: new Date(`${dayStr}T23:59:59`),
            },
            isActive: true,
        },
        orderBy: { courtId: "desc" },
    });

    const slots = generateSlots();

    return courts.map((court) => ({
        courtId: court.id,
        courtName: court.name,
        slots: slots.map((slot) => {
            const slotStart = new Date(`${dayStr}T${slot.start}:00`);

            if (slotStart < now) {
                return {
                    time: slot.start,
                    status: "PAST",
                    price: null,
                };
            }


            const booked = bookings.find(
                (b) => b.courtId === court.id && b.startTime === slot.start
            );

            if (booked) {
                return { time: slot.start, status: "BOOKED", price: booked.price };
            }

            const rule = pricingRules.find(
                (r) =>
                    (r.courtId === court.id || r.courtId === null) &&
                    r.startTime <= slot.start &&
                    r.endTime > slot.start
            );

            return {
                time: slot.start,
                status: "AVAILABLE",
                price: rule ? rule.price : 0,
            };
        }),
    }));
}

export async function getAdminBookingGrid(date: Date) {
    const dayStr = date.toISOString().split("T")[0];
    const todayStr = new Date().toISOString().split("T")[0];
    const now = new Date();

    const courts = await prisma.court.findMany({
        where: { isActive: true },
    });

    const bookings = await prisma.booking.findMany({
        where: {
            date: {
                gte: new Date(`${dayStr}T00:00:00`),
                lt: new Date(`${dayStr}T23:59:59`),
            },
        },
        include: {
            user: true,
        },
    });

    const slots = generateSlots();

    return courts.map((court) => ({
        courtId: court.id,
        courtName: court.name,
        slots: slots.map((slot) => {
            const slotStart = new Date(`${dayStr}T${slot.start}:00`);

            const booking = bookings.find(
                (b) =>
                    b.courtId === court.id && b.startTime === slot.start
            );

            if (booking) {
                if (booking.price === 0) {
                    const d0 = new Date(`${dayStr}T00:00:00`);
                    const isWeekend = d0.getDay() === 0 || d0.getDay() === 6;
                    booking.price = isWeekend ? 70000 : 50000;
                }

                return {
                    time: slot.start,
                    status: booking.status,
                    price: booking.price,
                    bookingId: booking.id,
                    user: {
                        name: booking.user.fullName,
                        email: booking.user.username,
                    },
                };
            }

            if (slotStart < now) {
                return {
                    time: slot.start,
                    status: "PAST",
                    price: null,
                };
            }


            return {
                time: slot.start,
                status: "AVAILABLE",
            };
        }),
    }));
}


type CreateBookingInput = {
    userId: number;
    courtId: number;
    date: string;
    startTimes: string[];
    price: number;
    status: "PAID" | "PENDING";
};

export async function createBooking(input: CreateBookingInput) {
    const { userId, courtId, date, startTimes, price, status } = input;

    if (!startTimes.length) {
        throw new Error("No time slots selected");
    }

    const dayStr = date;
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    // Prevent multi-day booking
    if (new Set(startTimes.map(() => dayStr)).size !== 1) {
        throw new Error("Booking cannot span multiple days");
    }

    return prisma.$transaction(async (tx) => {
        const created = [];

        for (const startTime of startTimes) {
            const slotStart = new Date(`${dayStr}T${startTime}:00`);

            // Past slot (only today)
            if (dayStr === todayStr && slotStart < now) {
                throw new Error(`Slot ${startTime} is in the past`);
            }

            const booking = await tx.booking.create({
                data: {
                    userId,
                    courtId,
                    date: new Date(`${dayStr}T00:00:00`),
                    startTime,
                    endTime: add30Min(startTime),
                    price: Number(price),
                    status: status
                },
            });

            created.push(booking);
        }

        return created;
    });
}


// helper
export function add30Min(time: string) {
    const [h, m] = time.split(":").map(Number);
    const d = new Date(2000, 0, 1, h, m + 30);
    return `${d.getHours().toString().padStart(2, "0")}:${d
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
}
