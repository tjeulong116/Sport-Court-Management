import { Request, Response } from "express";

const getHomePage = (req: Request, res: Response) => {
    return res.render("home.ejs");
}

const getCreateUserPage = (req: Request, res: Response) => {
    return res.render("create-user.ejs");
}

export { getHomePage, getCreateUserPage };