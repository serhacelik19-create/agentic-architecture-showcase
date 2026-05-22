"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const FoodMenuSchema = z.object({
    date: z.string().transform((str) => new Date(str)),
    soup: z.string().min(1, "Çorba adı gerekli"),
    main: z.string().min(1, "Ana yemek gerekli"),
    side: z.string().min(1, "Yan yemek gerekli"),
    extra: z.string().min(1, "Ekstra gerekli"),
    totalCal: z.coerce.number().min(0),
});

export async function upsertFoodMenu(prevState: any, formData: FormData) {
    try {
        const rawData = {
            date: formData.get("date"),
            soup: formData.get("soup"),
            main: formData.get("main"),
            side: formData.get("side"),
            extra: formData.get("extra"),
            totalCal: formData.get("totalCal"),
        };

        const validatedData = FoodMenuSchema.parse(rawData);

        // Check if menu exists for this date
        const existing = await db.foodMenu.findFirst({
            where: {
                date: validatedData.date
            }
        });

        if (existing) {
            await db.foodMenu.update({
                where: { id: existing.id },
                data: {
                    soup: validatedData.soup,
                    main: validatedData.main,
                    side: validatedData.side,
                    extra: validatedData.extra,
                    totalCal: validatedData.totalCal
                }
            });
        } else {
            await db.foodMenu.create({
                data: validatedData
            });
        }

        revalidatePath("/admin/food-menu");
        revalidatePath("/"); // Update homepage as well
        return { message: "Menü başarıyla kaydedildi.", success: true };
    } catch (e) {
        console.error(e);
        return { message: "Bir hata oluştu.", success: false };
    }
}

export async function getFoodMenus() {
    try {
        const menus = await db.foodMenu.findMany({
            orderBy: {
                date: 'desc'
            },
            take: 30 // Last 30 days
        });
        return { success: true, data: menus };
    } catch (error) {
        console.error("Error fetching menus:", error);
        return { success: false, error: "Menüler yüklenirken bir hata oluştu." };
    }
}

export async function deleteFoodMenu(id: number) {
    try {
        await db.foodMenu.delete({
            where: { id }
        });

        revalidatePath("/admin/food-menu");
        revalidatePath("/");
        return { success: true, message: "Menü silindi." };
    } catch (error) {
        console.error("Error deleting menu:", error);
        return { success: false, message: "Silme işlemi başarısız oldu." };
    }
}
