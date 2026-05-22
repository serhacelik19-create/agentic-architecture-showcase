"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarDays, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface NewsSectionProps {
    initialData: any[];
}

export function NewsSection({ initialData }: NewsSectionProps) {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<"Haber" | "Duyuru" | "Etkinlik">("Haber");

    const data = Array.isArray(initialData) ? initialData : [];

    // Filter items based on active tab
    const filteredNews = data.filter(item => {
        if (activeTab === "Haber") return item.category === "Genel" || item.category === "Haber";
        return item.category === activeTab;
    });

    return (
        <div className="w-full">
            {/* Tabs */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {["Haber", "Duyuru", "Etkinlik"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={cn(
                                "px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border-2",
                                activeTab === tab
                                    ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md transform scale-105"
                                    : "bg-transparent text-slate-500 border-slate-200 hover:border-[var(--primary)] hover:text-[var(--primary)]"
                            )}
                        >
                            {t(`tab.${tab.toLowerCase()}`)}
                        </button>
                    ))}
                </div>

                {/* Desktop View All - Mobile shown below */}
                <Button variant="ghost" className="hidden md:flex text-[var(--primary)] font-bold hover:bg-blue-50">
                    Tümünü Gör <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>

            {/* Slider Content */}
            <div className="w-full">
                {filteredNews.length > 0 ? (
                    <Swiper
                        key={activeTab} // Force re-render on tab change to reset slider position
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={24}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true, dynamicBullets: true }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                            1280: { slidesPerView: 4 },
                        }}
                        className="py-12 px-4 -mx-4 pb-16" // Increased padding for arrows and shadow
                        style={{
                            "--swiper-navigation-size": "20px",
                            "--swiper-theme-color": "var(--primary)",
                        } as React.CSSProperties}
                    >
                        {filteredNews.map((item) => (
                            <SwiperSlide key={item.id} className="h-auto pt-2 pb-8"> {/* Padding for hover effects */}
                                <Link href={`/haber/${item.id}`} className="group cursor-pointer flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:border-[var(--primary)] hover:shadow-xl transition-all duration-300">
                                    <article className="flex flex-col h-full w-full">
                                        <div className="relative h-48 overflow-hidden bg-slate-200 dark:bg-slate-800">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-100 dark:bg-slate-800">
                                                    <span className="text-xs font-semibold">Görsel Yok</span>
                                                </div>
                                            )}
                                            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[var(--primary)] uppercase tracking-wider shadow-sm z-10">
                                                {item.category}
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>

                                        <div className="p-5 flex flex-col flex-1">
                                            <div className="flex items-center gap-2 text-slate-400 text-xs mb-3 font-medium">
                                                <CalendarDays className="w-3.5 h-3.5" />
                                                {new Date(item.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </div>

                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 leading-snug group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                                                {item.title}
                                            </h3>

                                            <p className="text-slate-500 text-sm line-clamp-3 mb-4 leading-relaxed">
                                                {item.content}
                                            </p>

                                            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center text-[var(--primary)] text-xs font-bold uppercase tracking-wide group-hover:gap-2 transition-all">
                                                Detaylar <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="w-full h-40 flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 text-slate-400">
                        Bu kategoride henüz içerik bulunmuyor.
                    </div>
                )}
            </div>

            <div className="mt-6 text-center md:hidden">
                <Button variant="outline" className="w-full rounded-full">
                    Tüm {activeTab}leri Gör
                </Button>
            </div>
        </div>
    );
}
