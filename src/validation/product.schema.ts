import { z } from "zod";

export const ProductSchema = z.object({
    id: z.string().optional(),
    name: z.string().trim().min(1, { message: "Tên không được để trống" }),
    price: z.string()
        .transform((val) => (val === "" ? 0 : Number(val)))
        .refine((num) => num > 0, {
            message: "Số tiền tối thiểu là 1",
        }),
    detailDesc: z.string().trim().min(1, { message: "detailDesc không được để trống" }),
    shortDesc: z.string().trim().min(1, { message: "shortDesc không được để trống" }),
    quantity: z.string()
        .transform((val) => (val === "" ? 0 : Number(val)))
        .refine((num) => num > 0, {
            message: "Số tiền tối thiểu là 1",
        }),

    brand: z.string().trim().min(1, { message: "brand không được để trống" }),
    level: z.string().trim().min(1, { message: "level không được để trống" })
});

export type TProductSchema = z.infer<typeof ProductSchema>;