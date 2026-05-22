import { db } from "@/lib/db";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function CalendarCard({ title, icon, color, bg }: { title: string, icon: any, color: string, bg: string }) {
    const today = new Date();

    // Fetch upcoming event
    const event = await db.event.findFirst({
        where: {
            date: {
                gte: today
            }
        },
        orderBy: {
            date: 'asc'
        }
    });

    const Icon = icon;

    // Calculate days remaining
    let daysLeft = 0;
    if (event) {
        const diffTime = Math.abs(event.date.getTime() - today.getTime());
        daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all group flex flex-col h-full">
            <div className={`w-12 h-12 ${bg} ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>

            <div className="flex-1 mb-6">
                {event ? (
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-100 dark:border-purple-800/30">
                        <div className="flex items-start gap-3">
                            <div className="flex flex-col items-center bg-white dark:bg-slate-800 rounded p-1.5 min-w-[50px] shadow-sm">
                                <span className="text-xs text-slate-500 uppercase font-bold">
                                    {event.date.toLocaleString('tr-TR', { month: 'short' })}
                                </span>
                                <span className="text-xl font-bold text-slate-900 dark:text-white">
                                    {event.date.getDate()}
                                </span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2 leading-snug">
                                    {event.title}
                                </h4>
                                <div className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 mt-1.5 font-medium">
                                    <Clock size={12} />
                                    <span>{daysLeft === 0 ? "Bugün" : `${daysLeft} gün kaldı`}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Yaklaşan etkinlik bulunmuyor.
                    </p>
                )}
            </div>

            <Button variant="outline" className="w-full" asChild>
                <Link href="/ogrenci/takvim">Tüm Takvimi Gör</Link>
            </Button>
        </div>
    );
}
