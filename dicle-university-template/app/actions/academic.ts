'use server';

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type AcademicUnit = {
    id: number;
    name: string;
    type: string; // FACULTY, INSTITUTE, SCHOOL, VOCATIONAL, CENTER
    slug: string;
    website: string | null;
    createdAt: Date;
    updatedAt: Date;
};

// Fetch all units, optionally filtered by type
export async function getAcademicUnits(type?: string) {
    try {
        const whereClause = type ? { type } : {};
        const units = await db.academicUnit.findMany({
            where: whereClause,
            orderBy: { name: 'asc' }
        });
        return { success: true, data: units };
    } catch (error) {
        return { success: false, error: "Akademik birimler yüklenirken hata oluştu." };
    }
}

// Fetch a single unit by slug
export async function getAcademicUnitBySlug(slug: string) {
    try {
        const unit = await db.academicUnit.findFirst({
            where: { slug }
        });
        return { success: true, data: unit };
    } catch (error) {
        return { success: false, error: "Birim yüklenirken hata oluştu." };
    }
}

// Create or Update Unit
export async function saveAcademicUnit(formData: FormData) {
    try {
        const idStr = formData.get("id") as string;
        const name = formData.get("name") as string;
        const type = formData.get("type") as string;
        const slug = formData.get("slug") as string;
        const website = formData.get("website") as string;
        const description = formData.get("description") as string;
        const leader = formData.get("leader") as string;
        const phone = formData.get("phone") as string;
        const email = formData.get("email") as string;
        const address = formData.get("address") as string;
        const departments = formData.get("departments") as string;

        if (!name || !type || !slug) {
            return { success: false, error: "Birim adı, tipi ve kısa link (slug) zorunludur." };
        }

        const data = {
            name,
            type,
            slug,
            website: website || null,
            description: description || null,
            leader: leader || null,
            phone: phone || null,
            email: email || null,
            address: address || null,
            departments: departments || null,
        };

        if (idStr) {
            // Update
            await db.academicUnit.update({
                where: { id: parseInt(idStr) },
                data
            });
        } else {
            // Create
            await db.academicUnit.create({
                data
            });
        }

        revalidatePath("/admin/academic");
        // Revalidate specific public pages
        revalidatePath(`/akademik/${type.toLowerCase()}`);

        return { success: true };

    } catch (error) {
        console.error("Save Academic Unit Error:", error);
        return { success: false, error: "Kaydetme işlemi başarısız oldu." };
    }
}

// Delete Unit
export async function deleteAcademicUnit(id: number) {
    try {
        await db.academicUnit.delete({
            where: { id }
        });
        revalidatePath("/admin/academic");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Silme işlemi başarısız oldu." };
    }
}
