
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap, Trash2, BookOpen, School, Globe, Building, ChevronDown, ChevronRight, User, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteAcademicUnit } from "@/app/actions/academic";

export default function AcademicAdminList({ allUnits }: { allUnits: any[] }) {
    const [openGroup, setOpenGroup] = useState<string | null>("FACULTY");

    const groups = [
        { title: "Fakülteler", type: "FACULTY", icon: <GraduationCap size={16} /> },
        { title: "Enstitüler", type: "INSTITUTE", icon: <BookOpen size={16} /> },
        { title: "Yüksekokullar", type: "SCHOOL", icon: <School size={16} /> },
        { title: "Meslek Yüksekokulları", type: "VOCATIONAL", icon: <School size={16} /> },
        { title: "Araştırma Merkezleri", type: "CENTER", icon: <Globe size={16} /> },
        { title: "Diğer Birimler", type: "DEPARTMENT", icon: <Building size={16} /> },
    ];

    const toggleGroup = (type: string) => {
        setOpenGroup(openGroup === type ? null : type);
    };

    return (
        <div className="space-y-3">
            {groups.map((group) => {
                const groupUnits = allUnits?.filter(u => u.type === group.type) || [];
                if (groupUnits.length === 0) return null;
                const isOpen = openGroup === group.type;

                return (
                    <div key={group.type} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                        {/* Group Header */}
                        <button
                            onClick={() => toggleGroup(group.type)}
                            className={cn(
                                "w-full px-4 py-3 flex items-center gap-3 transition-colors text-left",
                                isOpen ? "bg-indigo-50 dark:bg-indigo-900/20" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            )}
                        >
                            <span className={cn("transition-transform duration-200", isOpen ? "rotate-90" : "")}>
                                <ChevronRight size={16} className="text-slate-400" />
                            </span>
                            <span className="text-indigo-600 shrink-0">{group.icon}</span>
                            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex-1">
                                {group.title}
                            </h4>
                            <span className="text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 px-2 py-0.5 rounded-full shadow-sm">
                                {groupUnits.length}
                            </span>
                        </button>

                        {/* Group Content (Accordion) */}
                        <div className={cn(
                            "overflow-hidden transition-all duration-300 ease-in-out",
                            isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                        )}>
                            <div className="p-2 space-y-2 bg-slate-50/50 dark:bg-slate-950/20">
                                {groupUnits.map((unit) => (
                                    <div key={unit.id} className="group bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-indigo-200 hover:shadow-md transition-all relative overflow-hidden">
                                        <div className="absolute top-1.5 right-1.5 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" asChild className="h-7 w-7 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                                                <a href={`?editId=${unit.id}`}>
                                                    <Pencil size={12} />
                                                </a>
                                            </Button>
                                            <form action={async () => {
                                                if (confirm(`${unit.name} birimini silmek istediğinize emin misiniz?`)) {
                                                    await deleteAcademicUnit(unit.id);
                                                }
                                            }}>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                                                    <Trash2 size={12} />
                                                </Button>
                                            </form>
                                        </div>

                                        <div className="p-3 pr-16">
                                            <h5 className="font-semibold text-slate-800 dark:text-slate-200 text-sm leading-tight group-hover:text-indigo-600 transition-colors">
                                                {unit.name}
                                            </h5>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className="text-[10px] font-mono text-slate-400">/{unit.slug}</span>
                                                {unit.leader && (
                                                    <span className="text-[10px] text-slate-400 flex items-center gap-1 border-l border-slate-200 pl-2 ml-1">
                                                        <User size={10} /> {unit.leader.split(' ').pop()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
