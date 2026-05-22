"use client";

import { useState, useActionState, useEffect } from "react";
import { HospitalPolyclinic } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Search, HeartPulse, HelpCircle } from "lucide-react";
import { upsertPolyclinic, deletePolyclinic } from "@/app/actions/hospital";
import IconRenderer from "@/components/ui/IconRenderer";

export default function PolyclinicsClient({ items }: { items: HospitalPolyclinic[] }) {
    const [newItemName, setNewItemName] = useState("");
    const [newItemIcon, setNewItemIcon] = useState("Activity");
    const [searchTerm, setSearchTerm] = useState("");

    const [state, formAction, isPending] = useActionState(upsertPolyclinic, { success: false, message: "" });

    useEffect(() => {
        if (state.success) {
            setNewItemName("");
            setNewItemIcon("Activity");
        }
    }, [state.success, state.message]);

    const handleDelete = async (id: number) => {
        if (confirm("Silmek istediğinize emin misiniz?")) await deletePolyclinic(id);
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header & Add Section */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
                        <Plus size={18} />
                    </div>
                    Poliklinik Yönetimi
                </h3>
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <form action={formAction} className="flex flex-col md:flex-row gap-2 w-full md:w-3/4">
                        <div className="relative flex-[2]">
                            <Input
                                name="name"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                placeholder="Poliklinik Adı (Örn: Kardiyoloji)"
                                className="bg-slate-50 dark:bg-slate-950 pl-10 h-10"
                                required
                            />
                            <HeartPulse size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>

                        <div className="relative flex-1 group">
                            <Input
                                name="icon"
                                value={newItemIcon}
                                onChange={(e) => setNewItemIcon(e.target.value)}
                                placeholder="İkon (Örn: Brain)"
                                className="bg-slate-50 dark:bg-slate-950 pl-10 h-10"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <IconRenderer name={newItemIcon} size={16} />
                            </div>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-help" title="Lucide ikon ismini girin (örn: Heart, Eye, Brain)">
                                <HelpCircle size={14} />
                            </div>
                        </div>

                        <input type="hidden" name="active" value="on" />
                        <Button type="submit" disabled={isPending} className="bg-rose-600 hover:bg-rose-700 text-white min-w-[100px] h-10">
                            {isPending ? "..." : "Ekle"}
                        </Button>
                    </form>

                    <div className="relative w-full md:w-1/4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Ara..."
                            className="pl-9 h-10 bg-slate-50 dark:bg-slate-950"
                        />
                    </div>
                </div>
            </div>

            {/* Reference Style Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredItems.map((item) => (
                    <div
                        key={item.id}
                        className="group flex items-center p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md hover:border-rose-200 transition-all gap-4"
                    >
                        {/* Icon Box */}
                        <div className="w-12 h-12 rounded-lg bg-rose-50 dark:bg-rose-900/10 flex items-center justify-center text-rose-500 shrink-0 group-hover:bg-rose-100 transition-colors">
                            {/* @ts-ignore */}
                            <IconRenderer name={item.icon || "Activity"} size={22} />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-rose-600 transition-colors text-[15px]">
                                {item.name}
                            </h4>
                            <p className="text-xs text-slate-400 mt-0.5 truncate">{item.icon}</p>
                        </div>

                        <button
                            onClick={() => handleDelete(item.id)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                            title="Sil"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
