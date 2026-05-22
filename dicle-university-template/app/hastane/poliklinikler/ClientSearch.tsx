"use client";

import { useState } from "react";
import { Search, HeartPulse, Stethoscope, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import IconRenderer from "@/components/ui/IconRenderer";
import { HospitalPolyclinic } from "@prisma/client";
import Link from "next/link"; // Ensure Link is imported if needed, though not used in simple div cards

export default function ClientSearch({ clinics }: { clinics: HospitalPolyclinic[] }) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredClinics = clinics.filter(clinic =>
        clinic.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg -mt-20 relative z-20 mb-12 border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <Input
                        placeholder="Poliklinik veya bölüm ara..."
                        className="pl-12 h-14 text-lg bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 transition-colors rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {filteredClinics.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredClinics.map((clinic) => (
                        <div key={clinic.id} className="group p-6 bg-white dark:bg-slate-900 rounded-xl hover:shadow-lg hover:border-rose-200 dark:hover:border-rose-900/30 hover:-translate-y-1 transition-all duration-300 border border-slate-100 dark:border-slate-800 flex items-center gap-4 cursor-default">
                            <div className="w-14 h-14 rounded-xl bg-rose-50 dark:bg-rose-900/10 flex items-center justify-center text-rose-500 group-hover:bg-rose-100 group-hover:scale-110 transition-all flex-shrink-0">
                                <IconRenderer name={clinic.icon || "Activity"} size={28} />
                            </div>
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-lg leading-snug group-hover:text-rose-600 transition-colors">
                                {clinic.name}
                            </h3>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-12 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-center flex flex-col items-center justify-center text-slate-400">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-6">
                        <Search size={32} className="opacity-50" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Sonuç Bulunamadı</h3>
                    <p className="max-w-xs mx-auto">"{searchQuery}" aramasıyla eşleşen bir poliklinik kaydı bulunmuyor.</p>
                </div>
            )}
        </>
    );
}
