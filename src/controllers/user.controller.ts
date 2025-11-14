import { Request, Response } from "express";

const getHomePage = (req: Request, res: Response) => {
    return res.render("home.ejs");
}

const getCreateUserPage = (req: Request, res: Response) => {
    return res.render("create-user.ejs");
}

const postCreateUser = (req: Request, res: Response) => {
    console.log(`>>> data is: ${req.body}`);
    return res.redirect('/');
}

export { getHomePage, getCreateUserPage, postCreateUser };