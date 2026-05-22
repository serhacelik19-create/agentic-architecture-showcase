"use client";

import { upsertResearchItem } from "@/app/actions/research";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useActionState, useEffect } from "react";
import { ResearchItem } from "@prisma/client";

interface ResearchItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: ResearchItem | null;
    defaultType?: string;
}

export default function ResearchItemModal({ isOpen, onClose, item, defaultType = "HIGHLIGHT" }: ResearchItemModalProps) {
    const [state, formAction, isPending] = useActionState(upsertResearchItem, { success: false, message: "" });

    useEffect(() => {
        if (state.success && !isPending) {
            onClose();
        }
    }, [state.success, isPending, onClose]);

    if (!isOpen) return null;

    // Determine type (if editing, use item type; else use default passed from partial view)
    const type = item?.type || defaultType;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold">{item ? "Düzenle" : `Yeni ${type === 'HIGHLIGHT' ? 'Kart' : 'Merkez'} Ekle`}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                </div>

                <form action={formAction} className="p-6 space-y-4">
                    <input type="hidden" name="id" value={item?.id || ""} />
                    <input type="hidden" name="type" value={type} />

                    <div className="space-y-2">
                        <Label>Başlık</Label>
                        <Input name="title" defaultValue={item?.title} placeholder={type === 'HIGHLIGHT' ? "Örn: DÜBAP Projeleri" : "Örn: Kanser Araştırma Merkezi"} required />
                    </div>

                    {type === 'HIGHLIGHT' && (
                        <>
                            <div className="space-y-2">
                                <Label>İkon (Lucide React Adı)</Label>
                                <Input name="icon" defaultValue={item?.icon || ""} placeholder="Örn: Microscope" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Açıklama</Label>
                                <Input name="description" defaultValue={item?.description || ""} placeholder="Kısa açıklama metni" />
                            </div>
                        </>
                    )}

                    <div className="space-y-2">
                        <Label>Yönlendirme Linki</Label>
                        <Input name="url" defaultValue={item?.url || ""} placeholder="https://..." />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input type="checkbox" name="active" defaultChecked={item?.active ?? true} id="active" className="w-4 h-4" />
                        <Label htmlFor="active">Aktif Olarak Göster</Label>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {isPending ? "Kaydediliyor..." : "Kaydet"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
