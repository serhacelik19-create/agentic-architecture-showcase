import { Coffee, CalendarX } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FoodMenuWidgetProps {
    menu: any;
}

export function FoodMenuWidget({ menu }: FoodMenuWidgetProps) {
    return (
        <Link
            href="/saglik-kultur-spor/yemekhane"
            className="group relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-6 transition-all hover:-translate-y-2 hover:shadow-xl flex flex-col h-full"
        >
            <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center text-white mb-4 shadow-md transition-transform group-hover:scale-110 bg-orange-500")}>
                <Coffee className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[var(--primary)] transition-colors">
                Yemekhane
            </h3>

            {menu ? (
                <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <p className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        Bugünün Menüsü:
                    </p>
                    <p className="line-clamp-1">🥣 {menu.soup}</p>
                    <p className="line-clamp-1">🍖 {menu.main}</p>
                    <p className="line-clamp-1">🍚 {menu.side}</p>
                    <p className="text-xs text-slate-400 mt-2">{menu.totalCal} kcal</p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    <p className="text-slate-500 text-sm">
                        Günlük menü ve bakiye işlemleri
                    </p>
                    <div className="flex items-center gap-2 text-xs text-orange-500 font-medium bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-md w-fit mt-1">
                        <CalendarX className="w-3 h-3" />
                        Menü girilmedi
                    </div>
                </div>
            )}

            {/* Decorative Background Icon */}
            <Coffee className="absolute -bottom-4 -right-4 w-32 h-32 text-slate-100 dark:text-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </Link>
    );
}
