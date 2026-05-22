
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { headers } from "next/headers";

export async function logAction(
    action: string,
    entity: string,
    entityId?: string,
    details?: any
) {
    try {
        const session = await auth();
        // Fallback for system actions or initial setup
        const userId = session?.user?.id || "system";

        // Get IP limit - basic implementation for now 
        const headersList = await headers();
        const ip = headersList.get("x-forwarded-for") || "unknown";

        await db.auditLog.create({
            data: {
                userId,
                action,
                entity,
                entityId: entityId ? String(entityId) : null,
                details: details ? JSON.stringify(details) : null,
                ipAddress: ip,
            },
        });
    } catch (error) {
        console.error("Failed to create audit log:", error);
        // We don't throw here to ensure the main action completes even if logging fails
    }
}
