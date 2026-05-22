"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/Stats";
import { QuickAccess } from "@/components/home/QuickAccess";
import { NewsSection } from "@/components/home/NewsGrid";
import { FoodMenu } from "@/components/widgets/FoodMenu";
import { EventCalendar } from "@/components/widgets/EventCalendar";
import { SocialFeed } from "@/components/home/SocialFeed";
import { SearchBar } from "@/components/home/SearchBar";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function HomepageClient({ formattedNews, formattedMenu, formattedEvents }: any) {
    const { t } = useLanguage();
    return (
        <main className="min-h-screen bg-white">
            <HeroSection />

            {/* Search Bar Overlay */}
            <div className="relative z-20 -mt-16 mb-12">
                <div className="container-custom">
                    <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center gap-8 border-b-4 border-[var(--primary)] mx-4 md:mx-0">
                        <SearchBar />
                    </div>
                </div>
            </div>

            <div className="container-custom pb-20 space-y-12">
                <div className="w-full">
                    <h2 className="text-2xl font-bold mb-6 text-slate-900 border-l-4 border-[var(--primary)] pl-4">
                        {t("home.newsTitle")}
                    </h2>
                    <NewsSection initialData={formattedNews} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-slate-900 border-l-4 border-[var(--secondary)] pl-4">
                            {t("home.studentLife")}
                        </h2>
                        <FoodMenu menu={formattedMenu} />
                    </div>

                    <div className="md:pt-14">
                        <EventCalendar initialEvents={formattedEvents} />
                    </div>
                </div>
            </div>

            <QuickAccess menu={formattedMenu} />
            <StatsSection />
            <SocialFeed />
        </main>
    );
}
