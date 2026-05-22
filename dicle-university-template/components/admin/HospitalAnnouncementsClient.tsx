"use client";

import { useState, useActionState, useEffect } from "react";
import { HospitalAnnouncement } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Megaphone, Calendar, CheckCircle2 } from "lucide-react";
import { upsertHospitalAnnouncement, deleteHospitalAnnouncement } from "@/app/actions/hospital";

function AnnouncementForm({ item, onClose }: { item?: HospitalAnnouncement | null, onClose: () => void }) {
    const [state, formAction, isPending] = useActionState(upsertHospitalAnnouncement, { success: false, message: "" });

    useEffect(() => {
        if (state.success) onClose();
    }, [state.success, onClose]);

    return (
        <form action={formAction} className="space-y-4 pt-4">
            <input type="hidden" name="id" value={item?.id || ""} />
            <div className="space-y-2">
                <label className="text-sm font-medium">Başlık</label>
                <Input name="title" defaultValue={item?.title} placeholder="Duyuru Başlığı" required className="bg-slate-50 dark:bg-slate-900" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">İçerik</label>
                <Textarea name="content" defaultValue={item?.content} placeholder="Duyuru detayları..." required className="bg-slate-50 dark:bg-slate-900 min-h-[100px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Tarih</label>
                    <Input
                        type="date"
                        name="date"
                        defaultValue={item?.date ? new Date(item.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                        className="bg-slate-50 dark:bg-slate-900"
                    />
                </div>
                <div className="flex items-end pb-3">
                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-full">
                        <input type="checkbox" name="active" defaultChecked={item?.active ?? true} className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
                        <span className="text-sm font-medium">Aktif Yayınla</span>
                    </label>
                </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button type="submit" disabled={isPending} className="bg-rose-600 hover:bg-rose-700 text-white">
                    {isPending ? "Kaydediliyor..." : "Kaydet"}
                </Button>
            </div>
        </form>
    );
}

export default function HospitalAnnouncementsClient({ items }: { items: HospitalAnnouncement[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<HospitalAnnouncement | null>(null);

    const handleDelete = async (id: number) => {
        if (confirm("Silmek istediğinize emin misiniz?")) await deleteHospitalAnnouncement(id);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
                <div>
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Duyuru Listesi</h3>
                    <p className="text-sm text-slate-500">Hastane sayfasında yayınlanan güncel duyurular.</p>
                </div>
                <Button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="gap-2 bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-900/20">
                    <Plus size={16} /> Yeni Duyuru
                </Button>
            </div>

            <div className="grid gap-4">
                {items.map((item) => (
                    <div key={item.id} className="group bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-500/30 transition-all hover:shadow-md flex justify-between items-start relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500/20 group-hover:bg-rose-500 transition-colors" />

                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-lg bg-rose-50 dark:bg-rose-900/20 flex flex-col items-center justify-center text-rose-600 dark:text-rose-400 font-bold border border-rose-100 dark:border-rose-900/30">
                                <span className="text-lg leading-none">{new Date(item.date).getDate()}</span>
                                <span className="text-[10px] uppercase">{new Date(item.date).toLocaleDateString('tr-TR', { month: 'short' })}</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-rose-600 transition-colors">{item.title}</h4>
                                <p className="text-sm text-slate-500 line-clamp-1 mt-1">{item.content}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${item.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                {item.active ? <CheckCircle2 size={12} /> : null}
                                {item.active ? "Yayında" : "Pasif"}
                            </div>
                            <div className="flex gap-1 pl-2 border-l border-slate-200 dark:border-slate-800">
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-600" onClick={() => { setEditingItem(item); setIsModalOpen(true); }}>
                                    <Edit size={14} />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                        <Megaphone size={48} className="mb-4 opacity-20" />
                        <p>Henüz duyuru eklenmemiş.</p>
                    </div>
                )}
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingItem ? "Duyuruyu Düzenle" : "Yeni Duyuru Ekle"}</DialogTitle>
                    </DialogHeader>
                    <AnnouncementForm item={editingItem} onClose={() => setIsModalOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
}
