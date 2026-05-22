"use client";

import { useState } from "react";
import { ResearchItem } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import ResearchItemModal from "./ResearchItemModal";
import { deleteResearchItem } from "@/app/actions/research";
import * as Icons from "lucide-react";

export default function ResearchHighlightsClient({ items }: { items: ResearchItem[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ResearchItem | null>(null);

    const handleDelete = async (id: number) => {
        if (confirm("Silmek istediğinize emin misiniz?")) await deleteResearchItem(id);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} size="sm" className="gap-2">
                    <Plus size={16} /> Yeni Kart Ekle
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => {
                    const Icon = (Icons as any)[item.icon || "Circle"] || Icons.Circle;
                    return (
                        <Card key={item.id} className="p-4 relative group">
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingItem(item); setIsModalOpen(true); }}>
                                    <Edit size={14} className="text-blue-600" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(item.id)}>
                                    <Trash2 size={14} className="text-red-600" />
                                </Button>
                            </div>
                            <Icon className="w-8 h-8 text-slate-400 mb-3" />
                            <h4 className="font-semibold text-slate-800 dark:text-white mb-2">{item.title}</h4>
                            <p className="text-xs text-slate-500 line-clamp-3">{item.description}</p>
                        </Card>
                    );
                })}
            </div>

            {isModalOpen && (
                <ResearchItemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} item={editingItem} defaultType="HIGHLIGHT" />
            )}
        </div>
    );
}
