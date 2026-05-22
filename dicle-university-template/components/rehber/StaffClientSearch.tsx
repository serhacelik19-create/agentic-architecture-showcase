"use client";

import { useState, useTransition } from "react";
import { Search, Building, Phone, Mail, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StaffMember {
    id: number;
    name: string;
    title: string | null;
    department: string;
    phone: string | null;
    email: string | null;
    room: string | null;
    avatar: string | null;
}

interface Props {
    initialStaff: StaffMember[];
    departments: string[];
}

export default function StaffClientSearch({ initialStaff, departments }: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDept, setSelectedDept] = useState("Tümü");

    // Client-side filtering for instant feedback since dataset is small (university staff dir might grow but this is safer for now)
    // If it gets huge, we can switch to server-side search params with useTRansition or useDebounce.
    const filteredStaff = initialStaff.filter(person => {
        const matchesSearch =
            person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            person.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            person.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDept = selectedDept === "Tümü" || person.department === selectedDept;

        return matchesSearch && matchesDept;
    });

    return (
        <div className="space-y-8">
            {/* Search Filters */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                        placeholder="İsim, unvan veya e-posta ara..."
                        className="pl-10 h-12 text-base"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="md:w-64">
                    <Select value={selectedDept} onValueChange={setSelectedDept}>
                        <SelectTrigger className="h-12 w-full">
                            <SelectValue placeholder="Birim Seçiniz" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                            <SelectItem value="Tümü">Tüm Birimler</SelectItem>
                            {departments.map((dept, idx) => (
                                <SelectItem key={idx} value={dept}>{dept}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredStaff.length > 0 ? (
                    filteredStaff.map((person) => (
                        <div key={person.id} className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300">
                            <div className="p-6 flex items-start gap-4">
                                <Avatar className="w-16 h-16 border-2 border-slate-100 dark:border-slate-700 shadow-sm group-hover:scale-105 transition-transform">
                                    <AvatarImage src={person.avatar || ""} />
                                    <AvatarFallback className="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-bold text-lg">
                                        {person.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0 space-y-1">
                                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                        {person.title || "Personel"}
                                    </p>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate" title={person.name}>
                                        {person.name}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        <Building className="w-3.5 h-3.5 shrink-0" />
                                        <span className="truncate">{person.department}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
                                {person.phone && (
                                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                                        <span>{person.phone}</span>
                                    </div>
                                )}
                                {person.email && (
                                    <a href={`mailto:${person.email}`} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate">
                                        <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                                        <span className="truncate">{person.email}</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 text-center">
                        <User className="w-16 h-16 mb-4 opacity-20" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Sonuç Bulunamadı</h3>
                        <p>Aradığınız kriterlere uygun personel kaydı bulunmuyor.</p>
                    </div>
                )}
            </div>

            <div className="text-center text-xs text-slate-400 mt-8">
                Toplam {filteredStaff.length} personel listeleniyor.
            </div>
        </div>
    );
}
