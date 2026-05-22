'use server';

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { StudentService } from "@prisma/client";

export async function getStudentServices() {
    try {
        const services = await db.studentService.findMany({
            orderBy: { order: 'asc' }
        });
        return { success: true, data: services };
    } catch (error) {
        return { success: false, error: "Hizmetler yüklenirken hata oluştu." };
    }
}

export async function getActiveStudentServices() {
    try {
        const services = await db.studentService.findMany({
            where: { active: true },
            orderBy: { order: 'asc' }
        });
        return { success: true, data: services };
    } catch (error) {
        return { success: false, error: "Hizmetler yüklenirken hata oluştu." };
    }
}

export async function upsertStudentService(prevState: any, formData: FormData) {
    try {
        const id = formData.get("id") ? parseInt(formData.get("id") as string) : null;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const icon = formData.get("icon") as string;
        const type = formData.get("type") as string;
        const url = formData.get("url") as string;
        const content = formData.get("content") as string;
        const active = formData.get("active") === "on";
        const order = formData.get("order") ? parseInt(formData.get("order") as string) : 0;

        if (id) {
            await db.studentService.update({
                where: { id },
                data: { title, description, icon, type, url, content, active, order }
            });
        } else {
            await db.studentService.create({
                data: { title, description, icon, type, url, content, active, order }
            });
        }

        revalidatePath("/admin/student-services");
        revalidatePath("/ogrenci");
        return { success: true, message: "Hizmet başarıyla kaydedildi." };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Kaydedilirken hata oluştu." };
    }
}

export async function deleteStudentService(id: number) {
    try {
        await db.studentService.delete({ where: { id } });
        revalidatePath("/admin/student-services");
        revalidatePath("/ogrenci");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Silinirken hata oluştu." };
    }
}
