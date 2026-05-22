"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function StudentInfoCard() {
    return (
        <div className="bg-[#F8FAFC] dark:bg-slate-900 rounded-lg p-6 flex flex-col md:flex-row gap-8 items-start justify-between border border-slate-100 dark:border-slate-800">
            {/* Left Side */}
            <div className="flex flex-col gap-4 max-w-sm">
                <h3 className="text-[#0f172a] dark:text-white text-xl font-bold">Öğrenci</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    Detaylı bilgilere buradan ulaşabilirsiniz.
                </p>
                <Link
                    href="/ogrenci"
                    className="inline-flex items-center justify-center px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-medium rounded-md transition-colors w-fit group"
                >
                    Sayfaya Git
                    <span className="ml-1 group-hover:translate-x-0.5 transition-transform">→</span>
                </Link>
            </div>

            {/* Right Side - Links */}
            <div className="flex flex-col gap-1 w-full md:w-auto min-w-[200px]">
                <h4 className="text-[#0f172a] dark:text-white font-semibold mb-2">Bağlantılar</h4>

                <Link href="https://obs.dicle.edu.tr/" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-[var(--primary)] dark:hover:text-[#4F46E5] transition-colors py-1">
                    <ChevronRight size={14} className="text-slate-400" />
                    <span className="text-sm">Öğrenci Bilgi Sistemi</span>
                </Link>

                <Link href="/ogrenci/takvim" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-[var(--primary)] dark:hover:text-[#4F46E5] transition-colors py-1">
                    <ChevronRight size={14} className="text-slate-400" />
                    <span className="text-sm">Akademik Takvim</span>
                </Link>
            </div>
        </div>
    );
}
