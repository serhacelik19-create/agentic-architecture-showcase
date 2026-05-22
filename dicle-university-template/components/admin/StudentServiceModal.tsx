"use client";

import { upsertStudentService } from "@/app/actions/student-services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useActionState, useEffect } from "react";
import { StudentService } from "@prisma/client";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { useState } from "react";

interface StudentServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: StudentService | null;
}

export default function StudentServiceModal({ isOpen, onClose, service }: StudentServiceModalProps) {
    const [state, formAction, isPending] = useActionState(upsertStudentService, { success: false, message: "" });
    const [selectedType, setSelectedType] = useState(service?.type || "LINK");
    const [editorContent, setEditorContent] = useState(service?.content || "");

    useEffect(() => {
        if (state.success && !isPending) {
            onClose();
        }
    }, [state.success, isPending, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
                    <h3 className="text-xl font-bold">{service ? "Hizmeti Düzenle" : "Yeni Hizmet Ekle"}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                </div>

                <form action={formAction} className="p-6 space-y-6">
                    <input type="hidden" name="id" value={service?.id || ""} />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Hizmet Tipi</Label>
                            <select
                                name="type"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                            >
                                <option value="LINK">Standart Link</option>
                                <option value="MENU">Yemek Menüsü (Otomatik)</option>
                                <option value="CALENDAR">Takvim / Geri Sayım (Otomatik)</option>
                                <option value="MODAL">Bilgi Penceresi (Modal)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>İkon (Lucide React Adı)</Label>
                            <Input name="icon" defaultValue={service?.icon || "Book"} placeholder="Örn: Book, bus, Coffee..." required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Başlık</Label>
                        <Input name="title" defaultValue={service?.title} placeholder="Hizmet Başlığı" required />
                    </div>

                    <div className="space-y-2">
                        <Label>Kısa Açıklama</Label>
                        <Input name="description" defaultValue={service?.description || ""} placeholder="Kartın altında görünecek kısa açıklama" />
                    </div>

                    {selectedType === 'LINK' && (
                        <div className="space-y-2">
                            <Label>Yönlendirilecek URL</Label>
                            <Input name="url" defaultValue={service?.url || ""} placeholder="https://..." required />
                        </div>
                    )}

                    {selectedType === 'MODAL' && (
                        <div className="space-y-2">
                            <Label>Pencere İçeriği</Label>
                            <RichTextEditor value={editorContent} onChange={setEditorContent} />
                            <input type="hidden" name="content" value={editorContent} />
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="active" defaultChecked={service?.active ?? true} id="active" className="w-4 h-4" />
                        <Label htmlFor="active">Bu hizmet aktif olarak gösterilsin</Label>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            {isPending ? "Kaydediliyor..." : "Kaydet"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
