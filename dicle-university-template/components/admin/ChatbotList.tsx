"use client";

import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { deleteChatIntent } from "@/app/actions/chatbot";
import { useState } from "react";

interface ChatbotListProps {
    intents: any[];
    onEdit: (intent: any) => void;
}

export function ChatbotList({ intents, onEdit }: ChatbotListProps) {
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        if (!confirm("Silmek istediğinize emin misiniz?")) return;
        setDeletingId(id);
        await deleteChatIntent(id);
        setDeletingId(null);
    };

    if (intents.length === 0) {
        return <div className="text-slate-500 italic">Henüz kayıtlı bilgi yok.</div>;
    }

    return (
        <div className="space-y-4">
            {intents.map((intent) => (
                <div key={intent.id} className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">
                                {intent.intentId}
                            </span>
                            <div className="mt-2 flex flex-wrap gap-1">
                                {intent.patterns.map((p: string, i: number) => (
                                    <span key={i} className="text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600" onClick={() => onEdit(intent)}>
                                <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-red-600"
                                onClick={() => handleDelete(intent.id)}
                                disabled={deletingId === intent.id}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3 rounded border border-slate-100 dark:border-slate-800">
                        {intent.response}
                    </div>
                </div>
            ))}
        </div>
    );
}
