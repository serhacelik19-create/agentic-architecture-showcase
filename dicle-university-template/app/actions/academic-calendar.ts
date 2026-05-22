"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getAcademicCalendarItems() {
    try {
        const items = await db.academicCalendarItem.findMany({
            orderBy: { order: "asc" },
        });
        return { success: true, data: items };
    } catch (error) {
        console.error("Failed to fetch academic calendar items:", error);
        return { success: false, error: "Takvim verisi alınamadı." };
    }
}

export async function saveAcademicCalendarItem(formData: FormData) {
    try {
        const id = formData.get("id");
        const term = formData.get("term") as string;
        const date = formData.get("date") as string;
        const event = formData.get("event") as string;
        const order = formData.get("order") ? parseInt(formData.get("order") as string) : 0;

        if (!term || !date || !event) {
            return { success: false, error: "Tüm alanlar zorunludur." };
        }

        if (id) {
            await db.academicCalendarItem.update({
                where: { id: parseInt(id as string) },
                data: { term, date, event, order },
            });
        } else {
            await db.academicCalendarItem.create({
                data: { term, date, event, order },
            });
        }

        revalidatePath("/admin/events");
        revalidatePath("/ogrenci/takvim");
        return { success: true };
    } catch (error) {
        console.error("Failed to save item:", error);
        return { success: false, error: "Kayıt başarısız." };
    }
}

export async function deleteAcademicCalendarItem(id: number) {
    try {
        await db.academicCalendarItem.delete({
            where: { id },
        });
        revalidatePath("/admin/events");
        revalidatePath("/ogrenci/takvim");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete item:", error);
        return { success: false, error: "Silme işlemi başarısız." };
    }
}
