"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Search, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function Navbar() {
    const { t } = useLanguage();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // UPDATED LINKS WITH REAL ROUTES
    const navLinks = [
        { name: t("nav.university"), hasMega: true, id: "university", href: "/universitemiz" },
        { name: t("nav.academic"), hasMega: true, id: "academic", href: "/akademik" },
        { name: t("nav.student"), hasMega: true, id: "student", href: "/ogrenci" },
        { name: t("nav.research"), hasMega: false, href: "/arastirma" },
        { name: t("nav.hospital"), hasMega: false, href: "/hastane" },
        { name: t("nav.staff"), hasMega: false, href: "/rehber" },
    ];

    return (
        <header
            className={cn(
                "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-transparent",
                isScrolled
                    ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800 py-2"
                    : "bg-transparent py-4 text-white"
            )}
        >
            <div className="container-custom flex items-center justify-between">
                {/* Logo Area */}
                <Link href="/" className="flex items-center gap-3 z-50">
                    {/* Placeholder for Logo */}
                    {/* Logo Image */}
                    <div className={cn("relative w-12 h-12 flex items-center justify-center")}>
                        <img
                            src="/logo.png?v=1"
                            alt="Dicle Üniversitesi Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className={cn("font-bold text-lg leading-none", isScrolled ? "text-[var(--primary)]" : "text-white")}>
                            DİCLE
                        </span>
                        <span className={cn("text-xs tracking-widest opacity-80", isScrolled ? "text-slate-600" : "text-slate-200")}>
                            ÜNİVERSİTESİ
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <div
                            key={link.name}
                            className="relative group px-3 py-2"
                            onMouseEnter={() => link.hasMega && setActiveMegaMenu(link.id!)}
                            onMouseLeave={() => link.hasMega && setActiveMegaMenu(null)}
                        >
                            <Link
                                href={link.href || "#"}
                                className={cn(
                                    "flex items-center gap-1 text-sm font-medium transition-colors",
                                    isScrolled
                                        ? "text-slate-700 hover:text-[var(--primary)]"
                                        : "text-white/90 hover:text-white"
                                )}
                            >
                                {link.name}
                                {link.hasMega && <ChevronDown className="w-4 h-4" />}
                            </Link>

                            {/* Mega Menu Overlay */}
                            {link.hasMega && activeMegaMenu === link.id && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-screen max-w-4xl">
                                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-100 dark:border-slate-800 p-6 flex gap-8 animate-fade-in overflow-hidden">
                                        {/* MEGA MENU CONTENT - DYNAMIC BASED ON ID */}
                                        <div className="w-1/3 bg-[var(--muted)] -m-6 p-6 mr-0">
                                            <h3 className="text-[var(--primary)] font-bold mb-2">{link.name}</h3>
                                            <p className="text-sm text-slate-500 mb-4">
                                                Detaylı bilgilere buradan ulaşabilirsiniz.
                                            </p>
                                            <Link href={link.href}>
                                                <Button size="sm" variant="outline" className="w-full">
                                                    Sayfaya Git &rarr;
                                                </Button>
                                            </Link>
                                        </div>
                                        <div className="w-2/3 grid grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-semibold mb-2 text-slate-900 dark:text-white">Bağlantılar</h4>
                                                <ul className="space-y-1">
                                                    {link.id === "university" ? (
                                                        <>
                                                            <li className="text-sm text-slate-600 dark:text-slate-400 hover:text-[var(--primary)] cursor-pointer">
                                                                <Link href="/universitemiz/hakkimizda">&rsaquo; Hakkımızda</Link>
                                                            </li>
                                                            <li className="text-sm text-slate-600 dark:text-slate-400 hover:text-[var(--primary)] cursor-pointer">
                                                                <Link href="/universitemiz/misyon-vizyon">&rsaquo; Misyon & Vizyon</Link>
                                                            </li>
                                                            <li className="text-sm text-slate-600 dark:text-slate-400 hover:text-[var(--primary)] cursor-pointer">
                                                                <Link href="/universitemiz/tarihce">&rsaquo; Tarihçe</Link>
                                                            </li>
                                                            <li className="text-sm text-slate-600 dark:text-slate-400 hover:text-[var(--primary)] cursor-pointer">
                                                                <Link href="/universitemiz/yonetim">&rsaquo; Yönetim</Link>
                                                            </li>
                                                            <li className="text-sm text-slate-600 dark:text-slate-400 hover:text-[var(--primary)] cursor-pointer">
                                                                <Link href="/universitemiz/basin-merkezi">&rsaquo; Basın Merkezi</Link>
                                                            </li>
                                                        </>
                                                    ) : link.id === "academic" ? (
                                                        <>
                                                            <li className="text-sm text-slate-600 dark:text-slate-400 hover:text-[var(--primary)] cursor-pointer">
                                                                <Link href="/akademik/fakulteler" className="block p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                                                                    <div className="font-semibold text-slate-900 group-hover:text-blue-700">Fakülteler</div>
                                                                    <div className="text-xs text-slate-500 mt-0.5">Tıp, Hukuk, Eğitim ve diğerleri</div>
                                                                </Link>
                                                                <Link href="/akademik/enstituler" className="block p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                                                                    <div className="font-semibold text-slate-900 group-hover:text-blue-700">Enstitüler</div>
                                                                    <div className="text-xs text-slate-500 mt-0.5">Fen, Sağlık, Sosyal Bilimler</div>
                                                                </Link>
                                                                <Link href="/akademik/yuksekokullar" className="block p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                                                                    <div className="font-semibold text-slate-900 group-hover:text-blue-700">Yüksekokullar</div>
                                                                    <div className="text-xs text-slate-500 mt-0.5">4 yıllık mesleki eğitim</div>
                                                                </Link>
                                                                <Link href="/akademik/meslek-yuksekokullari" className="block p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                                                                    <div className="font-semibold text-slate-900 group-hover:text-blue-700">Meslek Yüksekokulları</div>
                                                                    <div className="text-xs text-slate-500 mt-0.5">2 yıllık ön lisans programları</div>
                                                                </Link>
                                                            </li>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <li className="text-sm text-slate-600 dark:text-slate-400 hover:text-[var(--primary)] cursor-pointer">
                                                                <Link href="/ogrenci">&rsaquo; Öğrenci Bilgi Sistemi</Link>
                                                            </li>
                                                            <li className="text-sm text-slate-600 dark:text-slate-400 hover:text-[var(--primary)] cursor-pointer">
                                                                <Link href="/ogrenci/takvim">&rsaquo; Akademik Takvim</Link>
                                                            </li>
                                                        </>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Right Actions - LINKED */}
                <div className="hidden lg:flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={isScrolled ? "text-slate-700 dark:text-slate-200" : "text-white"}
                        onClick={() => {
                            // Dispatch custom event to open SearchModal
                            const event = new KeyboardEvent('keydown', {
                                key: 'k',
                                ctrlKey: true,
                                bubbles: true,
                                metaKey: true
                            });
                            window.dispatchEvent(event);
                        }}
                    >
                        <Search className="w-5 h-5" />
                    </Button>


                    <LanguageSelector isScrolled={isScrolled} />
                    <Link href="/aday-ogrenci">
                        <Button
                            variant={isScrolled ? "primary" : "secondary"}
                            className="ml-2 font-semibold"
                        >
                            {t("nav.candidate")}
                        </Button>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden text-primary"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen
                        ? <X className={cn("w-6 h-6", isScrolled ? "text-black" : "text-white")} />
                        : <Menu className={cn("w-6 h-6", isScrolled ? "text-black" : "text-white")} />
                    }
                </button>
            </div>

            {/* Mobile Menu (Simplified) */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 top-[70px] bg-white dark:bg-black z-40 p-6 overflow-y-auto">
                    <nav className="flex flex-col gap-4">
                        {navLinks.map(link => (
                            <Link
                                key={link.name}
                                href={link.href || "#"}
                                className="text-lg font-semibold py-2 border-b border-slate-100"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link href="/aday-ogrenci" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full mt-4" variant="primary">{t("nav.candidate")}</Button>
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
