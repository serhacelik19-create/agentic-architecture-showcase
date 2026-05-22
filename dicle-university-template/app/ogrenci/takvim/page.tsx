import { PageHeader } from "@/components/layout/PageLayout";
import { Calendar, AlertCircle } from "lucide-react";
import { getAcademicCalendarItems } from "@/app/actions/academic-calendar";

export default async function AcademicCalendarPage() {
    const { data: events, error } = await getAcademicCalendarItems();

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
            <PageHeader
                title="Akademik Takvim"
                description="2025-2026 Eğitim Öğretim Yılı Akademik Takvimi"
            />

            <div className="container-custom py-16">
                <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700">
                    <div className="p-6 bg-[var(--primary)] text-white flex items-center gap-4">
                        <Calendar className="w-8 h-8 opacity-80" />
                        <h2 className="text-xl font-bold">Önlisans ve Lisans Takvimi</h2>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                        {error ? (
                            <div className="p-8 text-center text-red-500 flex flex-col items-center gap-2">
                                <AlertCircle className="w-8 h-8" />
                                <p>{error}</p>
                            </div>
                        ) : (
                            events && events.length > 0 ? (
                                events.map((item) => (
                                    <div key={item.id} className="p-6 flex flex-col md:flex-row md:items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <div className="md:w-1/4">
                                            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                                {item.term}
                                            </span>
                                        </div>
                                        <div className="md:w-1/4 font-mono font-semibold text-slate-500 dark:text-slate-400">
                                            {item.date}
                                        </div>
                                        <div className="md:w-1/2 font-medium text-slate-900 dark:text-white">
                                            {item.event}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center text-slate-500">
                                    Takvim verisi bulunamadı.
                                </div>
                            )
                        )}
                    </div>

                    <div className="p-6 bg-slate-50 dark:bg-slate-900/50 text-center text-sm text-slate-500">
                        * Takvimde değişiklik yapma hakkı senatomuza aittir. Güncel duyuruları takip ediniz.
                    </div>
                </div>
            </div>
        </main>
    );
}
