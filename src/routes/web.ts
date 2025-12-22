import express, { Express } from 'express';
import { getHomePage, getCreateUserPage, postCreateUser, postDeleteUser, getProductFilterPage, getBookingPage, getClientViewUser, postAdminUpdateUser, getAdminViewUser, postClientUpdateUser } from 'controllers/user.controller';
import { getAdminOrderDetailPage, getAdminOrderPage, getAdminProductPage, getAdminUserPage, getDashboardPage } from 'controllers/admin/dashboard.controller';
import fileUploadMiddleware from 'src/middleware/multer';
import { getAdminCreateProductPage, getViewProduct, postAdminCreateProduct, postDeleteProduct, postUpdateProduct } from 'controllers/admin/product.controller';
import { getCartPage, getCheckOutPage, getOrderHistoryPage, getProductPage, getThanksPage, postAddProductToCart, postAddToCartFromDetailPage, postDeleteProductInCart, postHandleCartToCheckOut, postPlaceOrder } from 'controllers/client/product.controller';
import { getLoginPage, getRegisterPage, getSuccessRedirectPage, postLogout, postRegister } from 'controllers/client/auth.controller';
import passport from 'passport';
import { isAdmin, isLogin } from 'src/middleware/auth';
import { createPricing, deletePricing, getPricingPage } from 'controllers/admin/pricing.controller';
import { cancelBooking, getAdminBookingPage, markBookingPaid } from 'services/admin/booking.service';
import { getBookingDetailPage, postCreateBooking } from 'controllers/admin/booking.controller';
import { getBookingHistoryPage } from 'controllers/client/booking.controller';

const router = express.Router();

const webRoutes = (app: Express) => {
    router.get("/", getHomePage);
    router.get("/products", getProductFilterPage);

    router.get("/success-redirect", getSuccessRedirectPage);
    router.get("/product/:id", getProductPage);
    router.get("/login", getLoginPage);
    router.post('/login', passport.authenticate('local', {
        successRedirect: '/success-redirect',
        failureRedirect: '/login',
        failureMessage: true
    }));

    router.post("/logout", postLogout);
    router.get("/register", getRegisterPage);
    router.post("/register", postRegister);
    router.get("/view-user/:id", getClientViewUser);
    router.post("/update-user", fileUploadMiddleware("avatar"), postClientUpdateUser);

    router.post("/add-product-to-cart/:id", postAddProductToCart);
    router.get("/cart", getCartPage);
    router.post("/delete-product-in-cart/:id", postDeleteProductInCart);
    router.post("/handle-cart-to-checkout", postHandleCartToCheckOut);
    router.get("/checkout", getCheckOutPage);
    router.post("/place-order", postPlaceOrder);
    router.get("/thanks", getThanksPage);
    router.get("/order-history", getOrderHistoryPage);
    router.post("/add-to-cart-from-detail-page/:id", postAddToCartFromDetailPage);

    router.get("/booking", getBookingPage);
    router.get("/booking-history", getBookingHistoryPage);

    //admin routes
    router.get("/admin", getDashboardPage);
    router.get("/admin/user", getAdminUserPage);
    router.get("/admin/create-user", getCreateUserPage);
    router.post("/admin/handle-create-user", fileUploadMiddleware("avatar"), postCreateUser);
    router.post("/admin/delete-user/:id", postDeleteUser);
    router.get("/admin/view-user/:id", getAdminViewUser);
    router.post("/admin/update-user", fileUploadMiddleware("avatar"), postAdminUpdateUser);

    router.get("/admin/product", getAdminProductPage);
    router.get("/admin/create-product", getAdminCreateProductPage);
    router.post("/admin/handle-create-product", fileUploadMiddleware("image", "images/product"), postAdminCreateProduct);

    router.post("/admin/delete-product/:id", postDeleteProduct);
    router.get("/admin/view-product/:id", getViewProduct);
    router.post("/admin/update-product", fileUploadMiddleware("image", "images/product"), postUpdateProduct);

    router.get("/admin/order", getAdminOrderPage);
    router.get("/admin/order/:id", getAdminOrderDetailPage);

    // pricing management
    router.get("/admin/pricing", isAdmin, getPricingPage);
    router.post("/admin/pricing", isAdmin, createPricing);
    router.post("/admin/pricing/delete/:id", isAdmin, deletePricing);

    router.get("/admin/booking", isAdmin, getAdminBookingPage);
    router.post("/admin/booking/cancel/:id", isAdmin, cancelBooking);
    router.post("/admin/booking/paid/:id", isAdmin, markBookingPaid);

    router.get("/admin/booking/detail", isAdmin, getBookingDetailPage);
    router.post("/admin/booking/create", isAdmin, postCreateBooking);


    app.use("/", isAdmin, router);

}

export default webRoutes;