import { Request, Response, NextFunction } from "express";
import { Role, User } from "@prisma/client";

const isLogin = (req: Request, res: Response, next: NextFunction) => {
    const isAuthenticated = req.isAuthenticated();
    if (isAuthenticated) {
        res.redirect("/");
        return;
    } else {
        next();
    }
}

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    //apply only to admin
    if (req.path.startsWith('/admin')) {
        const user = req.user;

        if (user?.role?.name === "ADMIN") {
            next();
        } else {
            res.render("status/403.ejs");
        }

        return;
    }

    //client routes
    next();
}

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }

    return res.status(401).json({
        success: false,
        message: "Authentication required",
    });
};


export { isLogin, isAdmin, requireAuth };