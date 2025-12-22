import { Request, Response } from "express";
import { countTotalProductClientPages, getProducts } from "services/client/item.service";
import { getProductWithFilter, userFilter } from "services/client/product.filter";
import { getAllUsers, handleCreateUser, handleDeleteUser, getUserById, updateUserById, getAllRoles } from "services/client/user.service";

const getHomePage = async (req: Request, res: Response) => {
    const { page } = req.query;
    let currentPage = page ? +page : 1;
    if (currentPage <= 0) {
        currentPage = 1;
    }

    const products = await getProducts(currentPage, 8);
    const totalPages = await countTotalProductClientPages(8);

    return res.render("client/home/show.ejs", {
        products: products,
        totalPages: +totalPages,
        page: +currentPage
    });
}

const getProductFilterPage = async (req: Request, res: Response) => {
    const { page, brand = "", level = "", price = "", sort = "" } = req.query as {
        page?: string;
        brand: string;
        level: string;
        price: string;
        sort: string;
    };

    let currentPage = page ? +page : 1;
    if (currentPage <= 0) {
        currentPage = 1;
    }

    const data = await getProductWithFilter(currentPage, 6, brand, level, price, sort);

    return res.render("client/product/filter.ejs", {
        products: data.products,
        totalPages: +data.totalPages,
        page: +currentPage
    });
}

const getBookingPage = async (req: Request, res: Response) => {
    const date =
        (req.query.date as string) ||
        new Date().toISOString().split("T")[0];

    res.render("client/booking/show.ejs", { date });
};

const getCreateUserPage = async (req: Request, res: Response) => {
    const roles = await getAllRoles();

    return res.render("admin/user/create.ejs", {
        roles: roles
    });
}

const postCreateUser = async (req: Request, res: Response) => {
    const { fullName, username, phone, role, address } = req.body;
    const file = req.file;
    const avatar = file?.filename ?? null;
    //handle create user
    await handleCreateUser(fullName, username, address, phone, avatar, role);

    return res.redirect('/admin/user');
}

const postDeleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    handleDeleteUser(id);

    return res.redirect('/admin/user');
}

const getAdminViewUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    //get user by id
    const user = await getUserById(id);
    const roles = await getAllRoles();

    return res.render("admin/user/detail.ejs", {
        id: id,
        user: user,
        roles: roles
    });
}

const getClientViewUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await getUserById(id);
    const roles = await getAllRoles();

    return res.render("client/user/detail.ejs", {
        id: id,
        user: user,
        roles: roles
    })
}

const postAdminUpdateUser = async (req: Request, res: Response) => {
    const { id, fullName, phone, role, address } = req.body;
    const file = req.file;
    const avatar = file?.filename ?? undefined;
    //update user by id
    await updateUserById(id, fullName, phone, role, address, avatar);

    return res.redirect('/admin/user');
}

const postClientUpdateUser = async (req: Request, res: Response) => {
    const { id, fullName, phone, role, address } = req.body;
    const file = req.file;
    const avatar = file?.filename ?? undefined;
    //update user by id
    await updateUserById(id, fullName, phone, role, address, avatar);

    return res.redirect(`/view-user/${id}`);
}

export { getHomePage, getCreateUserPage, postCreateUser, postDeleteUser, getAdminViewUser, postAdminUpdateUser, getProductFilterPage, getBookingPage, getClientViewUser, postClientUpdateUser };