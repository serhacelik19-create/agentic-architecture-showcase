"use client";

import { Utensils } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface FoodMenuProps {
    menu: any;
}

export function FoodMenu({ menu }: FoodMenuProps) {
    const { t, locale } = useLanguage();

    if (!menu) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col justify-center items-center p-8 text-center min-h-[200px]">
                <Utensils className="w-12 h-12 text-slate-300 mb-4" />
                <h3 className="font-bold text-slate-500">{t("food.noMenu")}</h3>
            </div>
        )
    }

    const dateStr = new Date(menu.date).toLocaleDateString(locale === 'tr' ? 'tr-TR' : locale === 'en' ? 'en-US' : 'ku-TR');

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col">
            <div className="bg-[var(--secondary)] p-4 text-white flex items-center justify-between">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <Utensils className="w-5 h-5" />
                    {t("food.title")}
                </h3>
                <span className="text-xs bg-white/20 px-2 py-1 rounded text-white font-medium">
                    {dateStr}
                </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-center gap-4">
                <div className="flex items-center gap-4 border-b border-dashed border-slate-200 pb-2">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg">1</div>
                    <div>
                        <span className="text-xs text-slate-400 uppercase font-semibold">{t("food.soup")}</span>
                        <p className="font-medium text-slate-800">{menu.soup}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 border-b border-dashed border-slate-200 pb-2">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-lg">2</div>
                    <div>
                        <span className="text-xs text-slate-400 uppercase font-semibold">{t("food.main")}</span>
                        <p className="font-medium text-slate-800">{menu.main}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 border-b border-dashed border-slate-200 pb-2">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg">3</div>
                    <div>
                        <span className="text-xs text-slate-400 uppercase font-semibold">{t("food.side")}</span>
                        <p className="font-medium text-slate-800">{menu.side}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg">4</div>
                    <div>
                        <span className="text-xs text-slate-400 uppercase font-semibold">{t("food.extra")}</span>
                        <p className="font-medium text-slate-800">{menu.extra}</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 p-3 text-center text-xs text-slate-500 font-medium">
                {t("food.calories")}: {menu.totalCal}
            </div>
        </div>
    );
}
