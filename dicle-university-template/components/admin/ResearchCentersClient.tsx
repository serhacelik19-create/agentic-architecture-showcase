"use client";

import { useState } from "react";
import { ResearchItem } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Globe } from "lucide-react";
import ResearchItemModal from "./ResearchItemModal";
import { deleteResearchItem } from "@/app/actions/research";

export default function ResearchCentersClient({ items }: { items: ResearchItem[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ResearchItem | null>(null);

    const handleDelete = async (id: number) => {
        if (confirm("Bu merkezi silmek istediğinize emin misiniz?")) await deleteResearchItem(id);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} size="sm" variant="outline" className="gap-2">
                    <Plus size={16} /> Yeni Merkez Ekle
                </Button>
            </div>

            <div className="space-y-2">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 group">
                        <div className="flex items-center gap-3">
                            <Globe className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.title}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingItem(item); setIsModalOpen(true); }}>
                                <Edit size={14} className="text-blue-600" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(item.id)}>
                                <Trash2 size={14} className="text-red-600" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <ResearchItemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} item={editingItem} defaultType="CENTER" />
            )}
        </div>
    );
}
