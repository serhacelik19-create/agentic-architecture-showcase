import { db } from "@/lib/db";
import { Utensils, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function FoodMenuCard({ title, icon, color, bg }: { title: string, icon: any, color: string, bg: string }) {
    // Get today's date at 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextDay = new Date(today);
    nextDay.setDate(nextDay.getDate() + 1);

    const menu = await db.foodMenu.findFirst({
        where: {
            date: {
                gte: today,
                lt: nextDay
            }
        }
    });

    const Icon = icon;

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all group flex flex-col h-full">
            <div className={`w-12 h-12 ${bg} ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>

            <div className="flex-1 mb-6">
                {menu ? (
                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <div className="font-medium text-orange-600 dark:text-orange-400">Bugünün Menüsü:</div>
                        <ul className="list-disc list-inside space-y-1">
                            <li>{menu.soup}</li>
                            <li>{menu.main}</li>
                            <li>{menu.side}</li>
                            <li>{menu.extra}</li>
                        </ul>
                        <div className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                            {menu.totalCal} kcal
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 gap-2 py-4">
                        <Utensils size={24} className="opacity-20" />
                        <p className="text-sm">Bugün için yemek menüsü girilmemiş.</p>
                    </div>
                )}
            </div>

            <Button variant="outline" className="w-full" asChild>
                <Link href="/saglik-kultur-spor/yemekhane">Tüm Listeyi Gör</Link>
            </Button>
        </div>
    );
}
