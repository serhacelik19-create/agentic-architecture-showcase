"use client";

import { deleteFoodMenu } from "@/app/actions/food-menu";
import { useState } from "react";

type FoodMenu = {
    id: number;
    date: Date;
    soup: string;
    main: string;
    side: string;
    extra: string;
    totalCal: number;
    createdAt: Date;
    updatedAt: Date;
};

export default function FoodMenuList({ menus }: { menus: FoodMenu[] }) {
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        if (!confirm("Bu menüyü silmek istediğinize emin misiniz?")) return;

        setDeletingId(id);
        const result = await deleteFoodMenu(id);
        setDeletingId(null);

        if (!result.success) {
            alert(result.message);
        }
    };

    if (menus.length === 0) {
        return <p className="text-slate-500 italic">Henüz eklenmiş bir menü yok.</p>;
    }

    return (
        <div className="space-y-4">
            {menus.map((menu) => (
                <div key={menu.id} className="bg-white dark:bg-slate-800 p-4 rounded-sm shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">
                                {new Date(menu.date).toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                            <span className="text-sm text-slate-500">
                                {menu.totalCal} kcal
                            </span>
                        </div>
                        <div className="text-sm text-slate-700 dark:text-slate-300 grid grid-cols-2 md:grid-cols-4 gap-2">
                            <span className="font-medium">🍜 {menu.soup}</span>
                            <span className="font-medium">🍲 {menu.main}</span>
                            <span className="font-medium">🍚 {menu.side}</span>
                            <span className="font-medium">🥗 {menu.extra}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => handleDelete(menu.id)}
                        disabled={deletingId === menu.id}
                        className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 border border-red-200 rounded hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                    >
                        {deletingId === menu.id ? "Siliniyor..." : "Sil"}
                    </button>
                </div>
            ))}
        </div>
    );
}
