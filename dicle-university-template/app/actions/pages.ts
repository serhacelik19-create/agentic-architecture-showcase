'use server';

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type PageContent = {
    id: number;
    slug: string;
    title: string;
    content: string;
    category: string;
    updatedAt: Date;
};

// Fetch a single page by slug
export async function getPage(slug: string) {
    try {
        const page = await db.pageContent.findUnique({
            where: { slug }
        });
        return { success: true, data: page };
    } catch (error) {
        return { success: false, error: "Sayfa yüklenirken hata oluştu." };
    }
}

// Fetch all pages (only id, title, slug, updatedAt)
export async function getPagesList() {
    try {
        const pages = await db.pageContent.findMany({
            select: {
                id: true,
                slug: true,
                title: true,
                category: true,
                updatedAt: true,
            }
        });
        return { success: true, data: pages };
    } catch (error) {
        return { success: false, error: "Sayfa listesi alınamadı." };
    }
}

// Update or Create page content
export async function savePage(slug: string, title: string, content: string, category: string = "KURUMSAL") {
    try {
        if (!slug || !title) {
            return { success: false, error: "Başlık ve Url (slug) zorunludur." };
        }

        await db.pageContent.upsert({
            where: { slug },
            update: {
                title,
                content,
                category,
            },
            create: {
                slug,
                title,
                content,
                category,
            },
        });

        revalidatePath(`/admin/pages`);
        revalidatePath(`/kurumsal/${slug}`); // Assuming pages are under /kurumsal/[slug]
        return { success: true };

    } catch (error) {
        console.error("Save Page Error:", error);
        return { success: false, error: "Sayfa kaydedilirken hata oluştu." };
    }
}

// Delete a page
export async function deletePage(id: number) {
    try {
        await db.pageContent.delete({
            where: { id }
        });
        revalidatePath("/admin/pages");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Sayfa silinirken hata oluştu." };
    }
}

// Wrapper for useActionState
export async function upsertPage(prevState: any, formData: FormData) {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;

    return await savePage(slug, title, content, category);
}
