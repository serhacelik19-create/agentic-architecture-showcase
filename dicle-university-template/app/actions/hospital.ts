'use server';

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- Polyclinics ---

export async function getPolyclinics() {
    try {
        const items = await db.hospitalPolyclinic.findMany({
            orderBy: { order: 'asc' }
        });
        return { success: true, data: items };
    } catch (error) {
        return { success: false, error: "Veriler yüklenirken hata oluştu." };
    }
}

export async function getActivePolyclinics() {
    try {
        const items = await db.hospitalPolyclinic.findMany({
            where: { active: true },
            orderBy: { order: 'asc' }
        });
        return { success: true, data: items };
    } catch (error) {
        return { success: false, error: "Veriler yüklenirken hata oluştu." };
    }
}

export async function upsertPolyclinic(prevState: any, formData: FormData) {
    try {
        const id = formData.get("id") ? parseInt(formData.get("id") as string) : null;
        const name = formData.get("name") as string;
        const active = formData.get("active") === "on";
        const order = formData.get("order") ? parseInt(formData.get("order") as string) : 0;

        if (id) {
            await db.hospitalPolyclinic.update({ where: { id }, data: { name, active, order } });
        } else {
            await db.hospitalPolyclinic.create({ data: { name, active, order } });
        }

        revalidatePath("/admin/hospital");
        revalidatePath("/hastane");
        return { success: true, message: "Poliklinik kaydedildi." };
    } catch (error) {
        return { success: false, error: "Hata oluştu." };
    }
}

export async function deletePolyclinic(id: number) {
    try {
        await db.hospitalPolyclinic.delete({ where: { id } });
        revalidatePath("/admin/hospital");
        revalidatePath("/hastane");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Silinirken hata oluştu." };
    }
}

// --- Announcements ---

export async function getHospitalAnnouncements() {
    try {
        const items = await db.hospitalAnnouncement.findMany({
            orderBy: { date: 'desc' }
        });
        return { success: true, data: items };
    } catch (error) {
        return { success: false, error: "Veriler yüklenirken hata oluştu." };
    }
}

export async function getActiveHospitalAnnouncements() {
    try {
        const items = await db.hospitalAnnouncement.findMany({
            where: { active: true },
            orderBy: { date: 'desc' }
        });
        return { success: true, data: items };
    } catch (error) {
        return { success: false, error: "Veriler yüklenirken hata oluştu." };
    }
}

export async function upsertHospitalAnnouncement(prevState: any, formData: FormData) {
    try {
        const id = formData.get("id") ? parseInt(formData.get("id") as string) : null;
        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const dateStr = formData.get("date") as string;
        const active = formData.get("active") === "on";

        const date = dateStr ? new Date(dateStr) : new Date();

        if (id) {
            await db.hospitalAnnouncement.update({ where: { id }, data: { title, content, date, active } });
        } else {
            await db.hospitalAnnouncement.create({ data: { title, content, date, active } });
        }

        revalidatePath("/admin/hospital");
        revalidatePath("/hastane");
        return { success: true, message: "Duyuru kaydedildi." };
    } catch (error) {
        return { success: false, error: "Hata oluştu." };
    }
}

export async function deleteHospitalAnnouncement(id: number) {
    try {
        await db.hospitalAnnouncement.delete({ where: { id } });
        revalidatePath("/admin/hospital");
        revalidatePath("/hastane");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Silinirken hata oluştu." };
    }
}
