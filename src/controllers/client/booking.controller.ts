import { Request, Response } from "express";
import { getBookingHistory } from "services/client/item.service";

const getBookingHistoryPage = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
        return res.redirect("/login");
    }

    const bookings = await getBookingHistory(user.id);

    return res.render("client/booking/booking.history.ejs", {
        bookings
    })
}

export { getBookingHistoryPage };