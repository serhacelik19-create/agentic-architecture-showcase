"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getStaffMembers(query?: string, department?: string) {
    try {
        const where: any = {};

        if (query) {
            where.OR = [
                { name: { contains: query } }, // Case-insensitive search removed for simple SQLite compatibility if needed, but 'contains' is usually fine.
                { title: { contains: query } },
                { email: { contains: query } }
            ];
        }

        if (department && department !== "Tümü") {
            where.department = department;
        }

        const items = await db.staffMember.findMany({
            where,
            orderBy: { order: "asc" },
        });
        return { success: true, data: items };
    } catch (error) {
        console.error("Failed to fetch staff:", error);
        return { success: false, error: "Personel verisi alınamadı." };
    }
}

export async function getDepartments() {
    try {
        const items = await db.staffMember.findMany({
            select: { department: true },
            distinct: ['department']
        });
        return { success: true, data: items.map(i => i.department) };
    } catch (error) {
        return { success: false, data: [] };
    }
}

export async function saveStaffMember(formData: FormData) {
    try {
        const id = formData.get("id");
        const name = formData.get("name") as string;
        const title = formData.get("title") as string;
        const department = formData.get("department") as string;
        const phone = formData.get("phone") as string;
        const email = formData.get("email") as string;
        const room = formData.get("room") as string;
        const order = formData.get("order") ? parseInt(formData.get("order") as string) : 0;

        if (!name || !department) {
            return { success: false, error: "İsim ve Birim zorunludur." };
        }

        const data = { name, title, department, phone, email, room, order };

        if (id) {
            await db.staffMember.update({
                where: { id: parseInt(id as string) },
                data
            });
        } else {
            await db.staffMember.create({
                data
            });
        }

        revalidatePath("/admin/staff");
        revalidatePath("/rehber");
        return { success: true };
    } catch (error) {
        console.error("Failed to save staff:", error);
        return { success: false, error: "Kayıt başarısız." };
    }
}

export async function deleteStaffMember(id: number) {
    try {
        await db.staffMember.delete({
            where: { id },
        });
        revalidatePath("/admin/staff");
        revalidatePath("/rehber");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete staff:", error);
        return { success: false, error: "Silme işlemi başarısız." };
    }
}
