'use server';

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getStudentInfo() {
    try {
        let info = await db.studentInfo.findFirst();

        // Create default if not exists
        if (!info) {
            info = await db.studentInfo.create({
                data: {
                    title: "Öğrenci",
                    description: "Detaylı bilgilere buradan ulaşabilirsiniz.",
                    buttonText: "Sayfaya Git",
                    buttonUrl: "/ogrenci",
                    links: JSON.stringify([
                        { title: "Öğrenci Bilgi Sistemi", url: "https://obs.dicle.edu.tr/" },
                        { title: "Akademik Takvim", url: "/ogrenci/takvim" }
                    ])
                }
            });
        }

        return { success: true, data: info };
    } catch (error) {
        return { success: false, error: "Veri yüklenirken hata oluştu." };
    }
}

export async function updateStudentInfo(prevState: any, formData: FormData) {
    try {
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const buttonText = formData.get("buttonText") as string;
        const buttonUrl = formData.get("buttonUrl") as string;
        const linksJson = formData.get("links") as string;

        // Ensure links is valid JSON
        try {
            JSON.parse(linksJson);
        } catch (e) {
            return { success: false, error: "Geçersiz link verisi." };
        }

        const existing = await db.studentInfo.findFirst();

        if (existing) {
            await db.studentInfo.update({
                where: { id: existing.id },
                data: {
                    title,
                    description,
                    buttonText,
                    buttonUrl,
                    links: linksJson
                }
            });
        } else {
            await db.studentInfo.create({
                data: {
                    title,
                    description,
                    buttonText,
                    buttonUrl,
                    links: linksJson
                }
            });
        }

        revalidatePath("/");
        revalidatePath("/admin/student-info");
        return { success: true, message: "Bilgiler güncellendi." };

    } catch (error) {
        return { success: false, error: "Güncelleme sırasında hata oluştu." };
    }
}
