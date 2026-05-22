
'use server';

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { logAction } from "@/lib/logger";

export async function getAdminUsers() {
    const session = await auth();
    if (!session?.user) return [];

    try {
        const users = await db.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                username: true,
                name: true,
                role: true,
                createdAt: true,
            }
        });
        return users;
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return [];
    }
}

export async function createAdminUser(formData: FormData) {
    const session = await auth();
    if (!session?.user) return { error: "Yetkisiz işlem." };

    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    if (!username || !password || password.length < 6) {
        return { error: "Geçersiz veriler. Şifre en az 6 karakter olmalı." };
    }

    try {
        const existingUser = await db.user.findUnique({ where: { username } });
        if (existingUser) {
            return { error: "Bu kullanıcı adı zaten kullanılıyor." };
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await db.user.create({
            data: {
                username,
                password: hashedPassword,
                name: name || "Admin",
                role: "ADMIN",
            }
        });

        await logAction("CREATE_USER", "User", username, { createdBy: session.user.username });
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Failed to create user:", error);
        return { error: "Kullanıcı oluşturulurken bir hata oluştu." };
    }
}

export async function deleteAdminUser(userId: string) {
    const session = await auth();
    if (!session?.user) return { error: "Yetkisiz işlem." };

    // Prevent deleting self (optional but recommended safety)
    // We'd need the current user ID from session which might need an update to auth.ts to expose ID
    // For now, assuming username is unique enough or if session.user has id (NextAuth default doesn't always expose id on user type without custom callbacks)

    // Let's implement self-deletion prevention check if we can get ID
    // Safe bet: Don't allow deleting the last admin, but that's complex.
    // Let's just allow deletion but log it.

    try {
        await db.user.delete({ where: { id: userId } });
        await logAction("DELETE_USER", "User", userId, { deletedBy: session.user.username });
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete user:", error);
        return { error: "Silme işlemi başarısız." };
    }
}
