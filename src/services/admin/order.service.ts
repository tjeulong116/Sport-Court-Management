import { prisma } from "config/client";
import { TOTAL_ITEMS_PER_PAGE } from "config/constant";

const getOrderAdmin = async (page: number) => {
    const pageSize = TOTAL_ITEMS_PER_PAGE;
    const skip = (page - 1) * pageSize;

    const orders = await prisma.order.findMany({
        skip,
        take: pageSize,
        include: {
            user: {
                select: {
                    fullName: true
                }
            }
        }
    });

    return orders;
};

const getOrderDetailAdmin = async (orderId: number) => {
    return await prisma.orderDetail.findMany({
        where: { orderId },
        include: { product: true }
    });
}

export { getOrderAdmin, getOrderDetailAdmin };