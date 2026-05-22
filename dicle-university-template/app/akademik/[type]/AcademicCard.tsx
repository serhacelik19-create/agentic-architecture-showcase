"use client";

import { useState } from "react";
import { GraduationCap, BookOpen, School, ChevronDown, ChevronUp, MapPin, Phone, Mail, User, ArrowRight, LayoutDashboard, ChevronRight, Globe } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AcademicCard({ unit }: { unit: any }) {
    const [isOpen, setIsOpen] = useState(false);

    // Parse departments if it's a string, or use as is
    const departments = unit.departments ? unit.departments.split(',').map((d: string) => d.trim()).filter((d: string) => d) : [];

    return (
        <div
            className={cn(
                "group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-all duration-300 overflow-hidden cursor-pointer h-fit",
                isOpen ? "ring-2 ring-indigo-500 shadow-lg" : "hover:border-indigo-300 hover:shadow-md"
            )}
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className="p-6 flex gap-4">
                {/* Icon */}
                <div className={cn(
                    "shrink-0 h-14 w-14 rounded-xl flex items-center justify-center transition-colors shadow-lg",
                    isOpen ? "bg-indigo-600 text-white shadow-indigo-600/20" : "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600"
                )}>
                    <GraduationCap className="h-7 w-7" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <h3 className={cn("text-xl font-bold text-slate-900 dark:text-white mb-1 transition-colors", isOpen && "text-indigo-600")}>
                            {unit.name}
                        </h3>
                        {isOpen ? <ChevronUp className="w-5 h-5 text-indigo-500" /> : <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />}
                    </div>

                    {unit.leader && (
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                                Dekan/Müdür
                            </span>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                {unit.leader}
                            </span>
                        </div>
                    )}

                    <p className={cn("text-sm text-slate-500 dark:text-slate-400", !isOpen && "line-clamp-2")}>
                        {unit.description || 'Dicle Üniversitesi bünyesinde eğitim veren köklü birimimiz.'}
                    </p>
                </div>
            </div>

            {/* Expandable Content */}
            <div className={cn(
                "bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 transition-all duration-300 ease-in-out",
                isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            )}>
                {/* Departments */}
                {departments.length > 0 && (
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-indigo-500" /> Bölümler
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {departments.map((dept: string, idx: number) => (
                                <span key={idx} className="text-xs px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-600 dark:text-slate-300">
                                    {dept}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Contact Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    <div className="space-y-4">
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                            <Phone className="w-4 h-4 text-green-500" /> İletişim
                        </h4>

                        <div className="space-y-2">
                            {unit.phone && (
                                <a href={`tel:${unit.phone}`} className="flex flex-col group/link" onClick={(e) => e.stopPropagation()}>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Telefon</span>
                                    <span className="text-sm text-slate-600 group-hover/link:text-indigo-600 transition-colors">{unit.phone}</span>
                                </a>
                            )}
                            {unit.email && (
                                <a href={`mailto:${unit.email}`} className="flex flex-col group/link" onClick={(e) => e.stopPropagation()}>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">E-Posta</span>
                                    <span className="text-sm text-slate-600 group-hover/link:text-indigo-600 transition-colors">{unit.email}</span>
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-red-500" /> Adres ve Web
                        </h4>

                        <div className="space-y-2">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Konum</span>
                                <span className="text-sm text-slate-600">{unit.address || 'Kampüs, Sur / Diyarbakır'}</span>
                            </div>

                                <div className="flex flex-col gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                                    {(() => {
                                        const typeToSlug: Record<string, string> = {
                                            'FACULTY': 'fakulteler',
                                            'INSTITUTE': 'enstituler',
                                            'SCHOOL': 'yuksekokullar',
                                            'VOCATIONAL': 'meslek-yuksekokullari',
                                            'CENTER': 'arastirma-merkezleri',
                                            'DEPARTMENT': 'rektorluk-birimleri'
                                        };
                                        const typeSlug = typeToSlug[unit.type] || unit.type.toLowerCase();
                                        return (
                                            <Link
                                                href={`/akademik/${typeSlug}/${unit.slug}`}
                                                className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all shadow-md shadow-indigo-600/10"
                                            >
                                                Birim Sayfasını Gör <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        );
                                    })()}
                                    {unit.website && (
                                        <a
                                            href={unit.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-semibold transition-all border border-slate-200 dark:border-slate-700"
                                        >
                                            Harici Web Sitesi <Globe className="ml-1 h-3 w-3" />
                                        </a>
                                    )}
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
