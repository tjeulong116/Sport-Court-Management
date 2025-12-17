import { Request, Response } from "express";
import { createProduct, getProductById, handleDeleteProduct, updateProductById } from "services/admin/product.service";
import { ProductSchema, TProductSchema } from "src/validation/product.schema";

const getProductPage = async (req: Request, res: Response) => {
    return res.render("client/product/detail.ejs");
}

const getAdminCreateProductPage = async (req: Request, res: Response) => {
    const errors = [];
    const oldData = {
        name: "",
        price: "",
        detailDesc: "",
        shortDesc: "",
        quantity: "",
        brand: "",
        level: ""
    }

    return res.render("admin/product/create.ejs", {
        errors, oldData
    });
}

const postAdminCreateProduct = async (req: Request, res: Response) => {
    const { name, price, detailDesc, shortDesc, quantity, brand, level } = req.body as TProductSchema;
    const validate = ProductSchema.safeParse(req.body);

    if (!validate.success) {
        //error
        const errorsZod = validate.error.issues;
        const errors = errorsZod?.map(item => `${item.message} (${item.path[0]})`);
        const oldData = {
            name: name,
            price: price,
            detailDesc: detailDesc,
            shortDesc: shortDesc,
            quantity: quantity,
            brand: brand,
            level: level
        }

        return res.render("admin/product/create.ejs", {
            errors, oldData
        });
    }
    //success, create a new product
    const image = req?.file?.filename ?? null;
    await createProduct(
        name, +price, detailDesc, shortDesc, +quantity, brand, level, image
    );

    return res.redirect("/admin/product");
}

const postDeleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    await handleDeleteProduct(+id);
    return res.redirect("/admin/product");
}

const getViewProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    //get product by id
    const product = await getProductById(+id);

    const brandOptions = [
        { name: "Yonex", value: "YONEX" },
        { name: "Victor", value: "VICTOR" },
        { name: "Lining", value: "LINING" },
        { name: "Mizuno", value: "MIZUNO" },
        { name: "Apacs", value: "APACS" },
        { name: "Proace", value: "PROACE" }
    ];

    const levelOptions = [
        { name: "Beginner", value: "BEGINNER" },
        { name: "Intermediate", value: "INTERMEDIATE" },
        { name: "Advanced", value: "ADVANCED" },
        { name: "Expert", value: "EXPERT" },
        { name: "Master", value: "MASTER" }
    ];

    return res.render("admin/product/detail.ejs", {
        product,
        brandOptions,
        levelOptions
    });
}

const postUpdateProduct = async (req: Request, res: Response) => {
    const { id, name, price, detailDesc, shortDesc, quantity, brand, level } = req.body as TProductSchema;
    const image = req?.file?.filename ?? null;

    await updateProductById(+id, name, +price, detailDesc, shortDesc, +quantity, brand, level, image);
    return res.redirect("/admin/product");
}

export { getProductPage, getAdminCreateProductPage, postAdminCreateProduct, postDeleteProduct, getViewProduct, postUpdateProduct };