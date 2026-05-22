"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Users,
    Database,
    BarChart3,
    Settings,
    ChefHat,
    LogOut,
    ShieldCheck,
    MessageSquare
} from "lucide-react"

const routes = [
    {
        label: "Genel Bakış",
        icon: LayoutDashboard,
        href: "/",
        color: "text-sky-500",
    },
    {
        label: "Kullanıcılar",
        icon: Users,
        href: "/users",
        color: "text-violet-500",
    },
    {
        label: "İçerik",
        icon: Database,
        href: "/content",
        color: "text-pink-700",
    },
    {
        label: "Analitik",
        icon: BarChart3,
        href: "/analytics",
        color: "text-orange-700",
    },
    {
        label: "Ayarlar",
        icon: Settings,
        href: "/settings",
    },
    {
        label: "Yöneticiler",
        icon: ShieldCheck,
        href: "/admins",
        color: "text-emerald-500",
    },
    {
        label: "Canlı Destek",
        icon: MessageSquare,
        href: "/support",
        color: "text-blue-500",
    },
]

import { ThemeToggle } from "./theme-toggle"

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
            <div className="px-6 py-8 flex-1">
                <Link href="/" className="flex items-center mb-10 group">
                    <div className="relative w-10 h-10 mr-3 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 group-hover:scale-105 transition-transform">
                        <ChefHat className="text-white w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                            ChefVision
                        </h1>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">Admin Panel</span>
                    </div>
                </Link>

                <div className="space-y-1.5">
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-4">Navigasyon</p>
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-[14px] group flex p-3.5 w-full justify-start font-semibold cursor-pointer rounded-xl transition-all duration-300 relative overflow-hidden",
                                pathname === route.href
                                    ? "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
                                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-200"
                            )}
                        >
                            {pathname === route.href && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 rounded-r-full" />
                            )}
                            <div className="flex items-center flex-1">
                                <route.icon className={cn(
                                    "h-5 w-5 mr-3.5 transition-all duration-300",
                                    pathname === route.href ? "text-indigo-600 dark:text-indigo-400 scale-110" : "text-slate-400 dark:text-slate-500 group-hover:text-indigo-500"
                                )} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="px-6 py-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between gap-x-3 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-2xl">
                    <ThemeToggle />
                    <div
                        className="text-sm group flex p-3 flex-1 justify-start font-bold cursor-pointer text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        onClick={() => {
                            localStorage.removeItem('admin_token');
                            window.location.href = '/login';
                        }}
                    >
                        <div className="flex items-center flex-1">
                            <LogOut className="h-5 w-5 mr-3 text-slate-400 group-hover:text-red-500 transition-colors" />
                            <span className="hidden lg:block">Çıkış</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
