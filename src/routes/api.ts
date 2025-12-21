import { createPricing, deletePricing, getPricing } from 'controllers/admin/pricing.controller';
import { postAddProductToCartAPI } from 'controllers/client/api.controller';
import { getGrid, postBooking } from 'controllers/admin/booking.controller';
import express, { Express, Request, Response } from 'express';
import { isAdmin, requireAuth } from 'src/middleware/auth';

const router = express.Router();

const apiRoutes = (app: Express) => {
    router.post("/add-product-to-cart", postAddProductToCartAPI);
    router.get("/booking/grid", getGrid);
    router.post("/booking", requireAuth, postBooking);
    app.get("/api/admin/pricing", isAdmin, getPricing);
    app.post("/api/admin/pricing", isAdmin, createPricing);
    app.delete("/api/admin/pricing/:id", isAdmin, deletePricing);


    app.use("/api", router);

}


export default apiRoutes;