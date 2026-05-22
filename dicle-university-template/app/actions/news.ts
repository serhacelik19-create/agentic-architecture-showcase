"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const NewsSchema = z.object({
    title: z.string().min(1, "Başlık gerekli"),
    content: z.string().min(1, "İçerik gerekli"),
    category: z.enum(["Haber", "Duyuru", "Etkinlik"]),
    image: z.string().optional(), // Match DB field name
    date: z.string().transform((str) => new Date(str)),
    published: z.boolean().optional(),
});

export async function upsertNews(prevState: any, formData: FormData) {
    try {
        const id = formData.get("id");
        const title = formData.get("title") as string;

        // Simple slug generation
        const slug = title
            .toLowerCase()
            .replace(/ğ/g, "g")
            .replace(/ü/g, "u")
            .replace(/ş/g, "s")
            .replace(/ı/g, "i")
            .replace(/ö/g, "o")
            .replace(/ç/g, "c")
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");

        let image = formData.get("imageUrl") as string; // Keep getting from form as imageUrl or logic below
        const imageFile = formData.get("imageFile") as File;

        if (imageFile && imageFile.size > 0) {
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Create uploads directory if it doesn't exist
            const uploadDir = join(process.cwd(), "public", "uploads");
            await mkdir(uploadDir, { recursive: true });

            // Generate unique filename
            const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
            const filepath = join(uploadDir, filename);

            await writeFile(filepath, buffer);
            image = `/uploads/${filename}`;
        }

        const rawData = {
            title,
            content: formData.get("content"),
            category: formData.get("category"),
            image: image, // Map to 'image'
            date: formData.get("date"),
            published: formData.get("published") === "on",
        };

        const validatedData = NewsSchema.parse(rawData);

        if (id) {
            await db.news.update({
                where: { id: parseInt(id as string) },
                data: {
                    ...validatedData,
                    slug: slug + "-" + id // ensure uniqueness with ID
                }
            });
        } else {
            // For new items, we might check slug uniqueness or append timestamp
            await db.news.create({
                data: {
                    ...validatedData,
                    slug: slug + "-" + Date.now()
                }
            });
        }

        revalidatePath("/admin/news");
        revalidatePath("/");
        return { message: "İçerik başarıyla kaydedildi.", success: true };
    } catch (e) {
        console.error(e);
        return { message: "Bir hata oluştu: " + (e as Error).message, success: false };
    }
}

export async function deleteNews(id: number) {
    try {
        await db.news.delete({ where: { id } });
        revalidatePath("/admin/news");
        revalidatePath("/");
        return { success: true };
    } catch (e) {
        return { success: false, message: "Silinemedi" };
    }
}
