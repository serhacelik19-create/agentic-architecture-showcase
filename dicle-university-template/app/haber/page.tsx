import { NEWS_DATA } from "@/data/news-data";
import { PageHeader } from "@/components/layout/PageLayout";
import { Calendar, ArrowRight, ChevronRight, Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewsPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <PageHeader
                title="Haberler & Duyurular"
                description="Dicle Üniversitesi'nden en güncel gelişmeler, akademik takvim ve etkinlikler."
            />

            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
                    {NEWS_DATA.map((item) => (
                        <div key={item.id} className="group flex flex-col md:flex-row bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-slate-200 dark:border-slate-800">
                            <div className="relative w-full md:w-2/5 h-48 md:h-auto overflow-hidden">
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[var(--primary)] flex items-center gap-2">
                                    <Tag className="w-3 h-3" /> {item.category}
                                </div>
                            </div>
                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-3 font-medium">
                                        <Calendar className="w-3 h-3" />
                                        <span>{item.date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                                        <Link href={`/haber/${item.id}`}>{item.title}</Link>
                                    </h3>
                                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-4">{item.content}</p>
                                </div>
                                <Button variant="link" className="p-0 h-auto self-start text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-2 transition-transform">
                                    <Link href={`/haber/${item.id}`} className="flex items-center">
                                        Devamını Oku <ChevronRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Button variant="outline" size="lg" className="rounded-full px-8">
                        Daha Eski Haberler
                    </Button>
                </div>
            </div>
        </main>
    );
}
