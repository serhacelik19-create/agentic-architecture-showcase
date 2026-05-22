
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, Edit, ChevronRight, Layout, ShieldCheck, HelpCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { deletePage } from "@/app/actions/pages";
import Link from "next/link";

export default function PagesAdminList({ pages }: { pages: any[] }) {
    const [openGroup, setOpenGroup] = useState<string | null>("KURUMSAL");

    const groups = [
        { title: "Kurumsal Sayfalar", type: "KURUMSAL", icon: <Info size={16} /> },
        { title: "İdari Birimler", type: "IDARI", icon: <ShieldCheck size={16} /> },
        { title: "Bilgi Merkezi", type: "BILGI", icon: <HelpCircle size={16} /> },
        { title: "Hizmetler", type: "HIZMET", icon: <Layout size={16} /> },
    ];

    const toggleGroup = (type: string) => {
        setOpenGroup(openGroup === type ? null : type);
    };

    return (
        <div className="space-y-3">
            {groups.map((group) => {
                const groupPages = pages?.filter(p => p.category === group.type) || [];
                if (groupPages.length === 0) return null;
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
                                {groupPages.length}
                            </span>
                        </button>

                        {/* Group Content (Accordion) */}
                        <div className={cn(
                            "overflow-hidden transition-all duration-300 ease-in-out",
                            isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                        )}>
                            <div className="p-2 space-y-2 bg-slate-50/50 dark:bg-slate-950/20">
                                {groupPages.map((page) => (
                                    <div key={page.id} className="group bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-indigo-200 hover:shadow-md transition-all relative overflow-hidden">
                                        <div className="absolute top-1.5 right-1.5 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" asChild className="h-7 w-7 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                                                <Link href={`/admin/pages/${page.slug}`}>
                                                    <Edit size={12} />
                                                </Link>
                                            </Button>
                                            <form action={async () => {
                                                if (confirm(`${page.title} sayfasını silmek istediğinize emin misiniz?`)) {
                                                    await deletePage(page.id);
                                                }
                                            }}>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                                                    <Trash2 size={12} />
                                                </Button>
                                            </form>
                                        </div>

                                        <div className="p-3 pr-16">
                                            <h5 className="font-semibold text-slate-800 dark:text-slate-200 text-sm leading-tight group-hover:text-indigo-600 transition-colors">
                                                {page.title}
                                            </h5>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className="text-[10px] font-mono text-slate-400">/{page.slug}</span>
                                                <span className="text-[9px] text-slate-300 ml-auto">
                                                    Güncelleme: {new Date(page.updatedAt).toLocaleDateString("tr-TR")}
                                                </span>
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
