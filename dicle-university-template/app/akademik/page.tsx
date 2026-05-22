"use client";

import { PageHeader } from "@/components/layout/PageLayout";
import { GraduationCap, BookOpen, School, ChevronDown, ChevronUp, MapPin, Phone, Mail } from "lucide-react";
import { ACADEMIC_UNITS, INSTITUTES, SCHOOLS, VOCATIONAL_SCHOOLS } from "@/data/academic-data";
import { useState } from "react";
import { cn } from "@/lib/utils";

const AcademicCard = ({ unit }: { unit: typeof ACADEMIC_UNITS[0] }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className={cn(
                "group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-all duration-300 overflow-hidden cursor-pointer h-fit",
                isOpen ? "ring-2 ring-[var(--primary)] shadow-lg" : "hover:border-blue-400 hover:shadow-md"
            )}
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className="p-5 flex items-start justify-between">
                <div className="flex gap-4">
                    <div className={cn(
                        "p-3 rounded-lg transition-colors h-fit",
                        isOpen ? "bg-blue-600 text-white" : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100"
                    )}>
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className={cn("font-bold text-lg mb-1 transition-colors", isOpen && "text-[var(--primary)]")}>
                            {unit.name}
                        </h3>
                        {unit.dean && (
                            <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Dekan</span>
                                {unit.dean}
                            </p>
                        )}
                        <p className="text-sm text-slate-500 line-clamp-2">
                            {unit.description}
                        </p>
                    </div>
                </div>
                <div className="text-slate-400">
                    {isOpen ? <ChevronUp className="w-5 h-5 text-[var(--primary)]" /> : <ChevronDown className="w-5 h-5 group-hover:text-slate-600" />}
                </div>
            </div>

            {/* Expandable Content */}
            <div className={cn(
                "bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 transition-all duration-300 ease-in-out",
                isOpen ? "max-h-[500px] opacity-100 p-5" : "max-h-0 opacity-0 p-0 overflow-hidden"
            )}>
                <div className="space-y-6">
                    {/* Departments Section */}
                    {unit.departments.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-blue-500" /> Bölümler
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {unit.departments.map((dept, idx) => (
                                    <span key={idx} className="text-xs px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-600 dark:text-slate-300">
                                        {dept}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Contact Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <div className="space-y-3">
                            <h4 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                <Phone className="w-4 h-4 text-green-500" /> İletişim
                            </h4>
                            <a href={`tel:${unit.phone}`} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-[var(--primary)] transition-colors" onClick={(e) => e.stopPropagation()}>
                                <span className="font-medium text-xs text-slate-400 w-12">Telefon:</span> {unit.phone}
                            </a>
                            <a href={`mailto:${unit.email}`} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-[var(--primary)] transition-colors" onClick={(e) => e.stopPropagation()}>
                                <span className="font-medium text-xs text-slate-400 w-12">E-Posta:</span> {unit.email}
                            </a>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-red-500" /> Adres & Web
                            </h4>
                            <p className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <span className="font-medium text-xs text-slate-400 w-12 shrink-0">Konum:</span>
                                {unit.address}
                            </p>
                            <a
                                href={unit.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] hover:underline mt-1"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Web Sitesini Ziyaret Et <ChevronDown className="w-3 h-3 -rotate-90" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Academic() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <PageHeader
                title="Akademik Birimler"
                description="Bilim ve araştırmanın merkezi olan fakülte, enstitü ve yüksekokullarımız."
            />

            <div className="container-custom py-12 space-y-16">

                {/* Faculties */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Fakülteler ({ACADEMIC_UNITS.length})</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {ACADEMIC_UNITS.map((unit) => (
                            <AcademicCard key={unit.id} unit={unit} />
                        ))}
                    </div>
                </section>

                {/* Institutes */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Enstitüler</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {INSTITUTES.map((inst, idx) => (
                            <AcademicCard key={inst.id} unit={inst} />
                        ))}
                    </div>
                </section>

                {/* Schools */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                            <School className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Yüksekokullar & Konservatuvar</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {SCHOOLS.map((sch, idx) => (
                            <AcademicCard key={sch.id} unit={sch} />
                        ))}
                    </div>
                </section>

                {/* Vocational Schools */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg text-teal-600 dark:text-teal-400">
                            <School className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Meslek Yüksekokulları ({VOCATIONAL_SCHOOLS.length})</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                        {VOCATIONAL_SCHOOLS.map((voc, idx) => (
                            <AcademicCard key={voc.id} unit={voc} />
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
