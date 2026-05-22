"use client";

import { useState } from "react";
import { HospitalPolyclinic } from "@prisma/client";
import { Stethoscope, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import IconRenderer from "@/components/ui/IconRenderer";
import { cn } from "@/lib/utils";

interface PolyclinicsListProps {
    polyclinics: HospitalPolyclinic[];
}

export default function PolyclinicsList({ polyclinics }: PolyclinicsListProps) {
    const [showAll, setShowAll] = useState(false);

    // Default limit
    const INITIAL_LIMIT = 9;

    const displayedPolyclinics = showAll
        ? polyclinics
        : polyclinics.slice(0, INITIAL_LIMIT);

    return (
        <section>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
                    <span className="p-2 bg-rose-100 dark:bg-rose-900/20 text-rose-600 rounded-lg">
                        <Stethoscope size={24} />
                    </span>
                    Polikliniklerimiz
                </h2>

                {polyclinics.length > INITIAL_LIMIT && (
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-sm font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1 group transition-colors"
                    >
                        {showAll ? "Daha Az Gör" : "Tüm Bölümler"}
                        {showAll ? (
                            <ChevronUp size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                        ) : (
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        )}
                    </button>
                )}
            </div>

            {polyclinics.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayedPolyclinics.map((clinic) => (
                        <div key={clinic.id} className="group p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-rose-100 transition-all flex items-center gap-4 animate-in fade-in duration-300">
                            <div className="w-12 h-12 rounded-lg bg-rose-50 dark:bg-rose-900/10 flex items-center justify-center text-rose-500 group-hover:bg-rose-100 group-hover:scale-105 transition-all flex-shrink-0">
                                <IconRenderer name={clinic.icon || "Activity"} size={24} />
                            </div>
                            <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm md:text-base leading-snug">
                                {clinic.name}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-12 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-center flex flex-col items-center justify-center text-slate-400">
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-4">
                        <Stethoscope size={32} className="opacity-50" />
                    </div>
                    <p className="font-medium">Henüz poliklinik eklenmemiş.</p>
                </div>
            )}
        </section>
    );
}
