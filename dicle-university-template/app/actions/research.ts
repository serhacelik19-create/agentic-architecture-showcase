'use server';

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getResearchItems() {
    try {
        const items = await db.researchItem.findMany({
            orderBy: { order: 'asc' }
        });
        return { success: true, data: items };
    } catch (error) {
        return { success: false, error: "Veriler yüklenirken hata oluştu." };
    }
}

export async function getActiveResearchItems() {
    try {
        const items = await db.researchItem.findMany({
            where: { active: true },
            orderBy: { order: 'asc' }
        });
        return { success: true, data: items };
    } catch (error) {
        return { success: false, error: "Veriler yüklenirken hata oluştu." };
    }
}

export async function upsertResearchItem(prevState: any, formData: FormData) {
    try {
        const id = formData.get("id") ? parseInt(formData.get("id") as string) : null;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const icon = formData.get("icon") as string;
        const url = formData.get("url") as string;
        const type = formData.get("type") as string;
        const order = formData.get("order") ? parseInt(formData.get("order") as string) : 0;
        const active = formData.get("active") === "on";

        const data = { title, description, icon, url, type, order, active };

        if (id) {
            await db.researchItem.update({
                where: { id },
                data
            });
        } else {
            await db.researchItem.create({
                data
            });
        }

        revalidatePath("/admin/research");
        revalidatePath("/arastirma");
        return { success: true, message: "Kayıt başarılı." };
    } catch (error) {
        return { success: false, error: "Kaydedilirken hata oluştu." };
    }
}

export async function deleteResearchItem(id: number) {
    try {
        await db.researchItem.delete({ where: { id } });
        revalidatePath("/admin/research");
        revalidatePath("/arastirma");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Silinirken hata oluştu." };
    }
}
