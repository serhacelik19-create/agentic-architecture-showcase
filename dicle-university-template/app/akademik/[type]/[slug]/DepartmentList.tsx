"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, GraduationCap, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DepartmentList({ departments, color }: { departments: string[], color?: string }) {
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
    const primaryColor = color || '#4f46e5';

    if (departments.length === 0) return null;

    const getDepartmentDetail = (name: string) => {
        if (name.toLowerCase().includes('klinik')) {
            return "Klinik Bilimler Bölümü; Diş Hekimliğinde uzmanlık eğitimi verilen tüm klinik anabilim dallarını (Ortodonti, Pedodonti, Periodontoloji vb.) kapsamaktadır.";
        }
        if (name.toLowerCase().includes('temel')) {
            return "Temel Bilimler Bölümü; Diş hekimliği eğitiminin temelini oluşturan biyolojik ve tıbbi derslerin verildiği (Anatomi, Fizyoloji, Mikrobiyoloji vb.) bölümdür.";
        }
        return "Bu bölüm hakkında detaylı bilgi yakında eklenecektir. Eğitim ve araştırma faaliyetlerimiz kesintisiz devam etmektedir.";
    };

    return (
        <section id="bolumler" className="space-y-6 pt-6">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg" style={{ backgroundColor: primaryColor }}>
                    <Building2 className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Akademik Bölümler</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {departments.map((dept, idx) => {
                    const isExpanded = expandedIdx === idx;
                    return (
                        <div 
                            key={idx} 
                            className={cn(
                                "flex flex-col bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer",
                                isExpanded ? "border-indigo-500 ring-4 ring-indigo-500/5 shadow-xl" : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-sm"
                            )}
                            onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                        >
                                <div 
                                    className={cn(
                                        "flex items-center justify-between p-6 bg-white dark:bg-slate-900",
                                        isExpanded && "bg-slate-50 dark:bg-slate-800"
                                    )}
                                >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-inner" style={{ backgroundColor: isExpanded ? primaryColor : 'transparent', border: isExpanded ? 'none' : `1px solid ${primaryColor}20` }}>
                                        <GraduationCap className={cn("w-6 h-6 transition-colors", isExpanded ? "text-white" : "")} style={{ color: isExpanded ? '#fff' : primaryColor }} />
                                    </div>
                                    <span className="font-bold text-lg text-slate-900 dark:text-white">{dept}</span>
                                </div>
                                {isExpanded ? <ChevronDown className="w-5 h-5 opacity-70" style={{ color: primaryColor }} /> : <ChevronRight className="w-5 h-5 text-slate-300" />}
                            </div>

                            <div className={cn(
                                "transition-all duration-300 ease-in-out px-6 overflow-hidden bg-slate-50 dark:bg-slate-950/50",
                                isExpanded ? "max-h-[300px] py-6 opacity-100 border-t border-slate-100 dark:border-slate-800" : "max-h-0 py-0 opacity-0 border-t-0"
                            )}>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    {getDepartmentDetail(dept)}
                                </p>
                                <div className="mt-4 flex gap-4">
                                    <button className="text-xs font-bold hover:underline uppercase tracking-wider transition-colors" style={{ color: primaryColor }}>Anabilim Dalları</button>
                                    <button className="text-xs font-bold hover:underline uppercase tracking-wider transition-colors" style={{ color: primaryColor }}>Ders Programı</button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
