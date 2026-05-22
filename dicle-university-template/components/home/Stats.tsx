"use client";

import React from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { Users, GraduationCap, Microscope, Trophy } from "lucide-react";
import { useEffect, useRef } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    const spring = useSpring(0, {
        stiffness: 30,
        damping: 15,
    });

    const displayValue = useTransform(spring, (current) =>
        Math.floor(current).toLocaleString() + suffix
    );

    useEffect(() => {
        if (inView) {
            spring.set(value);
        }
    }, [inView, spring, value]);

    return <motion.span ref={ref}>{displayValue}</motion.span>;
}

export function StatsSection() {
    const { t } = useLanguage();
    const stats = [
        {
            icon: <Users className="w-8 h-8 text-blue-500" />,
            label: t("nav.student"),
            value: 30000,
            suffix: "+",
            description: "Dinamik ve büyük bir öğrenci topluluğu"
        },
        {
            icon: <GraduationCap className="w-8 h-8 text-amber-500" />,
            label: t("footer.academic"),
            value: 27,
            suffix: "",
            description: "Fakülte, yüksekokul ve enstitüler"
        },
        {
            icon: <Microscope className="w-8 h-8 text-emerald-500" />,
            label: t("footer.researchCenters"),
            value: 30,
            suffix: "+",
            description: "Bölgenin bilimsel araştırma üssü"
        },
        {
            icon: <Trophy className="w-8 h-8 text-rose-500" />,
            label: t("footer.alumni"),
            value: 150000,
            suffix: "+",
            description: "Güçlü ve yaygın mezun ağı"
        }
    ];

    return (
        <section className="py-20 bg-white border-y border-slate-100 relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 bg-[var(--primary)] rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-[var(--secondary)] rounded-full blur-3xl" />
            </div>

            <div className="container-custom relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                        {t("home.stats")} <span className="text-[var(--primary)]">Dicle Üniversitesi</span>
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto italic">
                        50 yılı aşkın tecrübemizle, rakamların ötesinde bir başarı hikayesi yazıyoruz.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center group hover:border-[var(--primary)] transition-colors duration-500 shadow-sm hover:shadow-xl"
                        >
                            <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                {stat.icon}
                            </div>
                            <div className="block text-4xl font-extrabold text-slate-900 mb-2">
                                <Counter value={stat.value} suffix={stat.suffix} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 mb-2">
                                {stat.label}
                            </h3>
                            <p className="text-sm text-slate-500">
                                {stat.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
