import { prisma } from "config/client";

const userFilter = async (usernameInput: string) => {
    return await prisma.user.findMany({
        where: {
            username: {
                contains: usernameInput
            }
        }
    })
}

const getProductWithFilter = async (page: number, pageSize: number, brand: string, level: string, price: string, sort: string) => {
    //build where query
    let whereClause: any = {};

    if (brand) {
        const brandInput = brand.split(",");
        whereClause.brand = {
            in: brandInput
        }
    }
    // whereClause = {
    //     brand: {...}
    // }
    if (level) {
        const levelInput = level.split(",");
        whereClause.level = {
            in: levelInput
        }
    }

    if (price) {
        const priceInput = price.split(",");
        const priceCondition = [];

        for (let i = 0; i < priceInput.length; i++) {
            if (priceInput[i] === "duoi-1-trieu") {
                priceCondition.push({ "price": { "lt": 1000000 } })
            }
            if (priceInput[i] === "1-2-trieu") {
                priceCondition.push({ "price": { "gte": 1000000, "lte": 2000000 } })
            }
            if (priceInput[i] === "2-4-trieu") {
                priceCondition.push({ "price": { "gte": 2000000, "lte": 4000000 } })
            }
            if (priceInput[i] === "tren-4-trieu") {
                priceCondition.push({ "price": { "gte": 4000000 } })
            }
        }

        whereClause.OR = priceCondition
    }

    //build sort query
    let orderByClause: any = {};

    if (sort) {
        if (sort === "gia-tang-dan") {
            orderByClause = {
                price: "asc"
            }
        }
        if (sort === "gia-giam-dan") {
            orderByClause = {
                price: "desc"
            }
        }
    }

    const skip = (page - 1) * pageSize;
    const [products, count] = await prisma.$transaction([
        prisma.product.findMany({
            skip: skip,
            take: pageSize,
            where: whereClause,
            orderBy: orderByClause
        }),
        prisma.product.count({ where: whereClause })
    ]);
    const totalPages = Math.ceil(count / pageSize);

    return { products, totalPages };
}

export { userFilter, getProductWithFilter };