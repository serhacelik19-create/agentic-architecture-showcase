'use server';

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Polyfill for pdf-parse (pdfjs-dist) in Node environment (Required for v2)
if (typeof global.DOMMatrix === 'undefined') {
    // @ts-ignore
    global.DOMMatrix = class DOMMatrix {
        a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
        is2D = true;
        isIdentity = true;
        constructor() { }
    };
}

// Robust Import for pdf-parse (Handles both v1 and v2 formats)
const pdfLib = require("pdf-parse");

export async function importEventsFromPDF(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        if (!file) {
            return { success: false, error: "Lütfen bir dosya seçin." };
        }

        console.log("--- PDF IMPORT STARTED ---");
        const buffer = Buffer.from(await file.arrayBuffer());

        let text = "";

        // Determine which API to use
        // Check if it's the v2 Class-based API
        if (pdfLib.PDFParse || (pdfLib.default && pdfLib.default.PDFParse)) {
            console.log("Detected pdf-parse v2 (Class API)");
            const PDFParseClass = pdfLib.PDFParse || pdfLib.default.PDFParse;

            // @ts-ignore
            const parser = new PDFParseClass({ data: buffer });
            const result = await parser.getText();
            text = result.text;

        } else if (typeof pdfLib === 'function') {
            console.log("Detected pdf-parse v1 (Function API)");
            const data = await pdfLib(buffer);
            text = data.text;

        } else if (pdfLib.default && typeof pdfLib.default === 'function') {
            console.log("Detected pdf-parse v1 (Function API via default)");
            const data = await pdfLib.default(buffer);
            text = data.text;

        } else {
            console.error("Unknown pdf-parse export structure:", Object.keys(pdfLib));
            return { success: false, error: "PDF kütüphanesi yüklenemedi. (Sürüm uyumsuzluğu)" };
        }

        console.log("PDF Text Preview:", text ? text.substring(0, 500) : "Empty");

        if (!text) {
            return { success: false, error: "PDF içeriği boş veya okunamadı." };
        }

        // Expanded Regex to match dates like "15 EYLÜL 2024", "15.EYLÜL.2024", "15-19 EYLÜL 2024", "15 - 19 HAZİRAN 2024"
        const dateRegex = /(\d{1,2}(?:[\s.-]*\d{1,2})?)[\s.-]+(OCAK|ŞUBAT|MART|NİSAN|MAYIS|HAZİRAN|TEMMUZ|AĞUSTOS|EYLÜL|EKİM|KASIM|ARALIK)[\s.-]+(\d{4})/gi;

        const lines = text.split('\n');
        let importedCount = 0;

        for (const line of lines) {
            const cleanLine = line.trim();
            if (!cleanLine) continue;

            const match = cleanLine.match(dateRegex);

            if (match) {
                console.log("Date Match Found:", match[0]);

                // Precise extraction
                const regex = /(\d{1,2})(?:[\s.-]*\d{1,2})?[\s.-]+(OCAK|ŞUBAT|MART|NİSAN|MAYIS|HAZİRAN|TEMMUZ|AĞUSTOS|EYLÜL|EKİM|KASIM|ARALIK)[\s.-]+(\d{4})/i;
                const parts = cleanLine.match(regex);

                if (parts) {
                    const day = parseInt(parts[1]);
                    const monthName = parts[2].toLocaleUpperCase('tr-TR');
                    const year = parseInt(parts[3]);

                    const months = {
                        "OCAK": 0, "ŞUBAT": 1, "MART": 2, "NİSAN": 3, "MAYIS": 4, "HAZİRAN": 5,
                        "TEMMUZ": 6, "AĞUSTOS": 7, "EYLÜL": 8, "EKİM": 9, "KASIM": 10, "ARALIK": 11
                    };

                    const month = months[monthName as keyof typeof months];

                    if (month !== undefined) {
                        const date = new Date(year, month, day);

                        // Clean title: Remove the date match and separators
                        let title = cleanLine.replace(match[0], "").trim();
                        title = title.replace(/^[:\-\s.,]+/, "").trim(); // Remove leading punctuation

                        if (title.length > 5) {
                            await db.event.create({
                                data: {
                                    title,
                                    date,
                                    location: "Kampüs",
                                    description: "Akademik Takvimden Otomatik İçe Aktarıldı"
                                }
                            });
                            importedCount++;
                        }
                    }
                }
            }
        }

        console.log("Total Imported:", importedCount);
        console.log("--- PDF IMPORT END ---");

        revalidatePath("/admin/events");
        revalidatePath("/");

        return { success: true, count: importedCount };

    } catch (error) {
        console.error("PDF Import General Error:", error);
        return { success: false, error: "PDF işlenirken genel bir hata oluştu." };
    }
}

export type Event = {
    id: number;
    title: string;
    date: Date;
    location: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
};

export async function getEvents() {
    try {
        const events = await db.event.findMany({
            orderBy: {
                date: 'asc',
            },
        });
        return { success: true, data: events };
    } catch (error) {
        return { success: false, error: "Etkinlikler yüklenirken bir hata oluştu." };
    }
}

export async function createEvent(formData: FormData) {
    try {
        const title = formData.get("title") as string;
        const dateStr = formData.get("date") as string;
        const location = formData.get("location") as string;
        const description = formData.get("description") as string;

        if (!title || !dateStr || !location) {
            return { success: false, error: "Lütfen tüm zorunlu alanları doldurun." };
        }

        await db.event.create({
            data: {
                title,
                date: new Date(dateStr),
                location,
                description,
            },
        });

        revalidatePath("/admin/events");
        revalidatePath("/"); // Update homepage calendar
        return { success: true };
    } catch (error) {
        return { success: false, error: "Etkinlik oluşturulurken bir hata oluştu." };
    }
}

export async function updateEvent(id: number, formData: FormData) {
    try {
        const title = formData.get("title") as string;
        const dateStr = formData.get("date") as string;
        const location = formData.get("location") as string;
        const description = formData.get("description") as string;

        if (!title || !dateStr || !location) {
            return { success: false, error: "Lütfen tüm zorunlu alanları doldurun." };
        }

        await db.event.update({
            where: { id },
            data: {
                title,
                date: new Date(dateStr),
                location,
                description,
            },
        });

        revalidatePath("/admin/events");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Etkinlik güncellenirken bir hata oluştu." };
    }
}

export async function deleteEvent(id: number) {
    try {
        await db.event.delete({
            where: { id },
        });

        revalidatePath("/admin/events");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Etkinlik silinirken bir hata oluştu." };
    }
}
