"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema for validation
const ChatIntentSchema = z.object({
    intentId: z.string().min(2, "ID en az 2 karakter olmalıdır"),
    patterns: z.string().min(2, "En az bir anahtar kelime giriniz"),
    response: z.string().min(2, "Cevap metni gereklidir"),
    isActive: z.boolean().optional(),
});

export async function upsertChatIntent(prevState: any, formData: FormData) {
    try {
        const id = formData.get("id");
        const rawData = {
            intentId: formData.get("intentId"),
            patterns: formData.get("keywords"), // mapped from form field 'keywords'
            response: formData.get("response"),
            isActive: Boolean(formData.get("isActive")),
        };

        const validated = ChatIntentSchema.parse(rawData);

        // Process patterns: split by comma if string, ensure JSON
        // The form sends a comma-separated string, we store it directly or as JSON array string?
        // The Plan said "JSON string". Let's standardize on storing as a JSON string of an array.
        const patternArray = validated.patterns.split(',').map(s => s.trim()).filter(s => s.length > 0);

        const dataToSave = {
            intentId: validated.intentId,
            patterns: JSON.stringify(patternArray),
            response: validated.response,
            isActive: true // Default to true for now
        };

        if (id) {
            await db.chatIntent.update({
                where: { id: parseInt(id as string) },
                data: dataToSave
            });
        } else {
            // Check uniqueness of intentId
            const existing = await db.chatIntent.findUnique({
                where: { intentId: validated.intentId as string }
            });

            if (existing) {
                return { success: false, message: "Bu Kimlik (ID) zaten kullanılıyor." };
            }

            await db.chatIntent.create({
                data: dataToSave
            });
        }

        revalidatePath("/admin/chatbot");
        return { success: true, message: "Bilgi başarıyla kaydedildi." };
    } catch (e) {
        console.error(e);
        return { success: false, message: "Bir hata oluştu." };
    }
}

export async function getChatIntents() {
    try {
        const intents = await db.chatIntent.findMany({
            orderBy: { createdAt: 'desc' }
        });

        // Parse JSON patterns for frontend use
        return {
            success: true,
            data: intents.map(i => ({
                ...i,
                patterns: JSON.parse(i.patterns) as string[]
            }))
        };
    } catch (e) {
        return { success: false, error: "Veriler yüklenemedi." };
    }
}

export async function deleteChatIntent(id: number) {
    try {
        await db.chatIntent.delete({ where: { id } });
        revalidatePath("/admin/chatbot");
        return { success: true, message: "Silindi." };
    } catch (e) {
        return { success: false, message: "Silinemedi." };
    }
}

import { findBestMatch, BotResponse } from "@/lib/chatbot-logic";
import { INTENTS } from "@/lib/chatbot-data";

export async function getChatBotResponse(query: string): Promise<BotResponse> {
    return await findBestMatch(query);
}

export async function seedChatIntents() {
    try {
        let count = 0;
        for (const intent of INTENTS) {
            const existing = await db.chatIntent.findUnique({
                where: { intentId: intent.id }
            });

            if (!existing) {
                await db.chatIntent.create({
                    data: {
                        intentId: intent.id,
                        patterns: JSON.stringify(intent.patterns),
                        response: intent.response,
                        actions: intent.action ? JSON.stringify(intent.action) : null,
                        isActive: true
                    }
                });
                count++;
            }
        }
        revalidatePath("/admin/chatbot");
        return { success: true, message: `${count} adet bilgi eklendi.` };
    } catch (e) {
        console.error(e);
        return { success: false, message: "Seed işlemi başarısız." };
    }
}
