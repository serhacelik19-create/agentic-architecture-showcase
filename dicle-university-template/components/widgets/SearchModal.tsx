"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Command, BookOpen, Newspaper, Link as LinkIcon, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ACADEMIC_UNITS, INSTITUTES, SCHOOLS, VOCATIONAL_SCHOOLS } from "@/data/academic-data";
import { NEWS_DATA } from "@/data/news-data";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface SearchResult {
    id: string;
    title: string;
    description?: string;
    category: "Akademik" | "Haber" | "Duyuru" | "Hızlı Erişim";
    href: string;
}

export function SearchModal() {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    // Global shortcut Ctrl+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Focus input when open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    // Search Logic
    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        const normalizedQuery = query.toLowerCase().trim();
        const searchResults: SearchResult[] = [];

        // 1. Search Academic Units
        [...ACADEMIC_UNITS, ...INSTITUTES, ...SCHOOLS, ...VOCATIONAL_SCHOOLS].forEach(unit => {
            if (unit.name.toLowerCase().includes(normalizedQuery)) {
                searchResults.push({
                    id: unit.id,
                    title: unit.name,
                    category: "Akademik",
                    href: unit.type === "Faculty" ? `/akademik` : `/akademik`
                });
            }
        });

        // 2. Search News
        NEWS_DATA.forEach(news => {
            if (news.title.toLowerCase().includes(normalizedQuery)) {
                searchResults.push({
                    id: news.id,
                    title: news.title,
                    category: news.category === "Haber" ? "Haber" : "Duyuru",
                    href: `/haber/${news.id}`
                });
            }
        });

        // 3. Constant Links
        const quickLinks = [
            { title: t("nav.candidate"), href: "/aday-ogrenci" },
            { title: t("footer.virtualTour"), href: "/sanal-tur" },
            { title: t("nav.university"), href: "/universitemiz" },
            { title: t("footer.about"), href: "/universitemiz/tarihce" },
            { title: "Öğrenci Bilgi Sistemi (OBS)", href: "https://obs.dicle.edu.tr" }
        ];

        quickLinks.forEach(link => {
            if (link.title.toLowerCase().includes(normalizedQuery)) {
                searchResults.push({
                    id: link.href,
                    title: link.title,
                    category: "Hızlı Erişim",
                    href: link.href
                });
            }
        });

        setResults(searchResults.slice(0, 8));
    }, [query, t]);

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 left-6 z-[60] bg-[var(--primary)] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform lg:hidden border-4 border-white/20"
            >
                <Search className="w-6 h-6" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
                        >
                            {/* Input Area */}
                            <div className="flex items-center p-4 border-b border-slate-100">
                                <Search className="w-5 h-5 text-slate-400 mr-3" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder={t("search.trigger")}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none text-slate-900 text-lg"
                                />
                                <div className="flex items-center gap-2">
                                    <span className="hidden sm:flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-500">
                                        ESC
                                    </span>
                                    <button onClick={() => setIsOpen(false)}>
                                        <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Results Area */}
                            <div className="max-h-[60vh] overflow-y-auto p-2">
                                {query.length === 0 ? (
                                    <div className="p-8 text-center space-y-4">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-400">
                                            <Command className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="text-slate-900 font-medium">{t("search.quickSearch")}</p>
                                            <p className="text-sm text-slate-500">{t("search.description")}</p>
                                        </div>
                                        <div className="flex justify-center gap-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                                            <span className="bg-slate-50 px-2 py-1 rounded">{t("nav.academic")}</span>
                                            <span className="bg-slate-50 px-2 py-1 rounded">{t("tab.duyuru")}</span>
                                            <span className="bg-slate-50 px-2 py-1 rounded">{t("nav.staff")}</span>
                                        </div>
                                    </div>
                                ) : results.length > 0 ? (
                                    <div className="space-y-1">
                                        {results.map((result, idx) => (
                                            <Link
                                                key={result.id + idx}
                                                href={result.href}
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center p-3 rounded-xl hover:bg-slate-50 group transition-colors"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                                    {result.category === "Akademik" && <BookOpen className="w-5 h-5 text-blue-500" />}
                                                    {result.category === "Haber" && <Newspaper className="w-5 h-5 text-emerald-500" />}
                                                    {result.category === "Duyuru" && <Newspaper className="w-5 h-5 text-amber-500" />}
                                                    {result.category === "Hızlı Erişim" && <LinkIcon className="w-5 h-5 text-rose-500" />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-slate-900 line-clamp-1">{result.title}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{result.category}</p>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all" />
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-slate-500">
                                        <p>{t("search.noResults")}: <span className="font-bold text-slate-900">"{query}"</span></p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                                <div className="flex gap-4">
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 rounded border border-slate-200 bg-white">Enter</kbd> {t("search.select")}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 rounded border border-slate-200 bg-white">↑↓</kbd> {t("search.navigate")}
                                    </span>
                                </div>
                                <span className="flex items-center gap-1 italic">
                                    Dicle Üniversitesi Akıllı Arama
                                </span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
