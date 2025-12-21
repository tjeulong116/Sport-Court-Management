import { prisma } from "config/client";
import { TOTAL_ITEMS_PER_PAGE } from "config/constant";

const createProduct = async (name: string, price: number, detailDesc: string, shortDesc: string, quantity: number, brand: string, level: string, imageUpload: string) => {
    await prisma.product.create({
        data: {
            name,
            price,
            detailDesc,
            shortDesc,
            quantity,
            brand,
            level,
            ...(imageUpload && { image: imageUpload })
        }
    })
}

const getProductList = async (page: number) => {
    const pageSize = TOTAL_ITEMS_PER_PAGE;
    const skip = (page - 1) * pageSize;
    const products = await prisma.product.findMany({
        skip: skip,
        take: pageSize
    });

    return products;
}

const handleDeleteProduct = async (id: number) => {
    await prisma.product.delete({
        where: { id }
    })
}

const getProductById = async (id: number) => {
    return await prisma.product.findUnique({
        where: { id }
    })
}

const updateProductById = async (id: number, name: string, price: number, detailDesc: string, shortDesc: string, quantity: number, brand: string, level: string, imageUpload: string) => {
    await prisma.product.update({
        where: { id },
        data: {
            name,
            price,
            detailDesc,
            shortDesc,
            quantity,
            brand,
            level,
            ...(imageUpload && { image: imageUpload })
        }
    })
}

export { createProduct, getProductList, handleDeleteProduct, getProductById, updateProductById }