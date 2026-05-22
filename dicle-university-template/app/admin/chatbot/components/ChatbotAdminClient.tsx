"use client";

import { useState } from "react";
import { ChatbotForm } from "@/components/admin/ChatbotForm";
import { ChatbotList } from "@/components/admin/ChatbotList";

export default function ChatbotAdminClient({ initialIntents }: { initialIntents: any[] }) {
    const [editingIntent, setEditingIntent] = useState<any | null>(null);
    const [key, setKey] = useState(0); // Force re-render list on update
    const [isSeeding, setIsSeeding] = useState(false);

    const handleSuccess = () => {
        setEditingIntent(null);
        setKey(prev => prev + 1);
    };

    const handleSeed = async () => {
        setIsSeeding(true);
        try {
            const { seedChatIntents } = await import("@/app/actions/chatbot");
            await seedChatIntents();
            setKey(prev => prev + 1);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSeeding(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 order-2 lg:order-1">
                <ChatbotForm
                    initialData={editingIntent}
                    onSuccess={handleSuccess}
                    key={editingIntent ? `edit-${editingIntent.id}` : 'create'}
                />
            </div>

            <div className="lg:col-span-2 order-1 lg:order-2">
                <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="font-semibold text-slate-900 dark:text-white">Kayıtlı Bilgiler</h2>
                        {initialIntents && initialIntents.length === 0 && (
                            <button
                                onClick={handleSeed}
                                disabled={isSeeding}
                                className="text-xs text-indigo-600 hover:text-indigo-800 disabled:opacity-50 underline"
                            >
                                {isSeeding ? "Yükleniyor..." : "Varsayılan Verileri Yükle"}
                            </button>
                        )}
                    </div>
                    <ChatbotList
                        intents={initialIntents}
                        onEdit={setEditingIntent}
                    />
                </div>
            </div>
        </div>
    );
}
