"use client";

import { upsertFoodMenu } from "@/app/actions/food-menu";
import { useActionState } from "react";

export default function FoodMenuForm() {
    const [state, formAction, isPending] = useActionState(upsertFoodMenu, { message: "", success: false });

    // Default to today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-sm shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">Menü Ekle / Güncelle</h2>

            <form action={formAction} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Tarih</label>
                    <input
                        type="date"
                        name="date"
                        defaultValue={today}
                        className="w-full p-2 border border-slate-300 rounded-sm dark:bg-slate-700 dark:border-slate-600 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Çorba</label>
                        <input type="text" name="soup" placeholder="Örn: Mercimek Çorbası" className="w-full p-2 border border-slate-300 rounded-sm dark:bg-slate-700 dark:border-slate-600 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Ana Yemek</label>
                        <input type="text" name="main" placeholder="Örn: Orman Kebabı" className="w-full p-2 border border-slate-300 rounded-sm dark:bg-slate-700 dark:border-slate-600 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Yan Yemek</label>
                        <input type="text" name="side" placeholder="Örn: Pirinç Pilavı" className="w-full p-2 border border-slate-300 rounded-sm dark:bg-slate-700 dark:border-slate-600 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Ekstra</label>
                        <input type="text" name="extra" placeholder="Örn: Mevsim Salata" className="w-full p-2 border border-slate-300 rounded-sm dark:bg-slate-700 dark:border-slate-600 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" required />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Toplam Kalori</label>
                    <input type="number" name="totalCal" placeholder="850" className="w-full p-2 border border-slate-300 rounded-sm dark:bg-slate-700 dark:border-slate-600 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" required />
                </div>

                <div className="pt-4">
                    <button
                        disabled={isPending}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-sm font-medium disabled:opacity-50 transition-colors shadow-sm"
                    >
                        {isPending ? "Kaydediliyor..." : "Kaydet"}
                    </button>
                </div>

                {state.message && (
                    <p className={`text-sm mt-2 ${state.success ? "text-green-500" : "text-red-500"}`}>
                        {state.message}
                    </p>
                )}
            </form>
        </div>
    );
}
