"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Utensils, Newspaper, Calendar, Settings, LogOut, Building2, Users, ChevronRight, GraduationCap, MessageSquare, FlaskConical, Command } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
    // Dicle University Blue theme (approximate deep corporate blue)
    return (
        <aside className="w-72 bg-[#1e293b] text-slate-300 flex flex-col fixed h-full z-50 border-r border-slate-700/50 shadow-xl overflow-hidden font-sans">
            <div className="absolute inset-0 bg-blue-950/20 pointer-events-none" /> {/* Blue tint overlay */}

            {/* Branding Area */}
            <div className="h-20 flex items-center px-6 border-b border-slate-700/50 bg-[#1e293b] relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/40">
                        <Command className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-bold tracking-tight text-sm">YÖNETİM PANELİ</span>
                        <span className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold opacity-80">Dicle Üniversitesi</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-8 overflow-y-auto relative z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                <div>
                    <SectionHeader title="GENEL BAKIŞ" />
                    <div className="space-y-1">
                        <NavLink href="/admin" icon={<LayoutDashboard size={18} />} label="Kontrol Paneli" exact />
                    </div>
                </div>

                <div>
                    <SectionHeader title="SAYFA YÖNETİMİ" />
                    <div className="space-y-1">
                        <NavLink href="/admin/pages" icon={<Building2 size={18} />} label="Kurumsal Sayfalar" />
                        <NavLink href="/admin/academic" icon={<GraduationCap size={18} />} label="Akademik Birimler" />
                    </div>
                </div>

                <div>
                    <SectionHeader title="HİZMETLER & İÇERİK" />
                    <div className="space-y-1">
                        <NavLink href="/admin/student-info" icon={<Users size={18} />} label="Öğrenci Bilgileri" />
                        <NavLink href="/admin/staff" icon={<Users size={18} />} label="Personel Rehberi" />
                        <NavLink href="/admin/research" icon={<FlaskConical size={18} />} label="Araştırma" />
                        <NavLink href="/admin/hospital" icon={<Building2 size={18} />} label="Hastane Yönetimi" />
                        <NavLink href="/admin/food-menu" icon={<Utensils size={18} />} label="Yemek Hakkında" />
                    </div>
                </div>

                <div>
                    <SectionHeader title="İLETİŞİM" />
                    <div className="space-y-1">
                        <NavLink href="/admin/news" icon={<Newspaper size={18} />} label="Haberler & Duyurular" />
                        <NavLink href="/admin/events" icon={<Calendar size={18} />} label="Akademik Takvim" />
                        <NavLink href="/admin/chatbot" icon={<MessageSquare size={18} />} label="Asistan / Chatbot" />
                    </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-700/50">
                    <div className="space-y-1">
                        <NavLink href="/admin/users" icon={<Users size={18} />} label="Kullanıcılar" />
                        <NavLink href="#" icon={<Settings size={18} />} label="Ayarlar" />
                    </div>
                </div>
            </nav>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-slate-700/50 bg-[#1e293b] relative z-10">
                <form action={async () => {
                    await fetch('/api/auth/signout', { method: 'POST' });
                    window.location.href = '/login';
                }}>
                    <button type="submit" className="flex items-center gap-3 px-3 py-2.5 w-full text-left rounded-lg hover:bg-white/5 transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold border border-blue-600 shadow-sm">
                            A
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Admin</p>
                            <p className="text-[11px] text-blue-200/70 truncate">Oturumu Kapat</p>
                        </div>
                        <LogOut size={16} className="text-slate-400 group-hover:text-red-400 transition-colors" />
                    </button>
                </form>
            </div>
        </aside>
    );
}

function SectionHeader({ title }: { title: string }) {
    return (
        <h3 className="px-3 text-[10px] font-bold text-blue-200/50 uppercase tracking-widest mb-2">
            {title}
        </h3>
    );
}

function NavLink({ href, icon, label, exact = false }: { href: string; icon: React.ReactNode; label: string; exact?: boolean }) {
    const pathname = usePathname();
    const isActive = exact ? pathname === href : pathname.startsWith(href);

    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}
