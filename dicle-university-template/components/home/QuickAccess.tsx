"use client";

import Link from "next/link";
import { BookOpen, Coffee, Calendar, Bus, Map, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { FoodMenuWidget } from "./FoodMenuWidget";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface QuickAccessProps {
    menu: any;
}

export function QuickAccess({ menu }: QuickAccessProps) {
    const { t } = useLanguage();

    const widgets = [
        {
            title: t("footer.map"),
            icon: Map,
            color: "bg-green-600",
            href: "https://www.google.com/maps/place/Dicle+%C3%9Cniversitesi/@37.9088607,40.274719,15z",
            description: t("footer.map")
        },
        {
            title: t("home.library"),
            icon: BookOpen,
            color: "bg-indigo-600",
            href: "http://www.dicle.edu.tr/tr/birimler/daire-baskanliklari/kutuphane-ve-dokumantasyon-daire-baskanligi",
            description: t("home.library")
        },
        {
            title: t("footer.calendar"),
            icon: Calendar,
            color: "bg-blue-600",
            href: "/ogrenci/takvim",
            description: t("footer.calendar")
        }
    ];

    return (
        <section className="py-20 bg-slate-50">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Dynamic Food Menu Widget */}
                    <FoodMenuWidget menu={menu} />

                    {widgets.map((widget, idx) => {
                        const Icon = widget.icon;
                        return (
                            <Link
                                key={idx}
                                href={widget.href}
                                className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-slate-100 p-6 transition-all hover:-translate-y-2 hover:shadow-xl"
                            >
                                <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center text-white mb-6 shadow-md transition-transform group-hover:scale-110", widget.color)}>
                                    <Icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[var(--primary)] transition-colors">
                                    {widget.title}
                                </h3>
                                <p className="text-slate-500 text-sm">
                                    {widget.description}
                                </p>

                                {/* Decorative Background Icon */}
                                <Icon className="absolute -bottom-4 -right-4 w-32 h-32 text-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
