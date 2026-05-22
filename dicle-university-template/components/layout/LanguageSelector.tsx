"use client";

import React, { useState } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const languages = [
    { code: "tr", name: "Türkçe", flag: "🇹🇷" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "ku", name: "Kürtçe", flag: "☀️" }, // Using sun emoji for Kurdish symbol as Kurds often use it
];

import { useLanguage } from "@/components/providers/LanguageProvider";

export default function LanguageSelector({ isScrolled }: { isScrolled: boolean }) {
    const { locale, setLocale } = useLanguage();

    return (
        <Select value={locale} onValueChange={(val) => setLocale(val as any)}>
            <SelectTrigger
                className={cn(
                    "flex items-center gap-2 border-none bg-transparent shadow-none focus:ring-0 px-2 h-9 w-auto hover:bg-slate-100 transition-colors",
                    isScrolled ? "text-slate-700" : "text-white"
                )}
            >
                <Globe className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">{locale}</span>
            </SelectTrigger>
            <SelectContent align="end" className="bg-white border-slate-200">
                {languages.map((l) => (
                    <SelectItem
                        key={l.code}
                        value={l.code}
                        className="flex items-center gap-3 cursor-pointer py-2"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-lg">{l.flag}</span>
                            <span className="font-medium">{l.name}</span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
