"use client";

import { PageHeader } from "@/components/layout/PageLayout";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, User, GraduationCap, ArrowRight, Quote, MapPin, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { ALUMNI_STORIES } from "@/data/alumni-data";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AlumniPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFaculty, setSelectedFaculty] = useState<string>("Tümü");

    const faculties = useMemo(() => {
        const unique = Array.from(new Set(ALUMNI_STORIES.map(s => s.faculty)));
        return ["Tümü", ...unique];
    }, []);

    const filteredStories = useMemo(() => {
        return ALUMNI_STORIES.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.role.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFaculty = selectedFaculty === "Tümü" || s.faculty === selectedFaculty;
            return matchesSearch && matchesFaculty;
        });
    }, [searchQuery, selectedFaculty]);

    const jobs = [
        { id: 1, title: "Pratisyen Hekim", company: "Dicle Üniversitesi Hastanesi", location: "Diyarbakır", type: "Tam Zamanlı" },
        { id: 2, title: "İnşaat Mühendisi", company: "Rönesans Holding", location: "İstanbul", type: "Tam Zamanlı" },
        { id: 3, title: "Stajyer Avukat", company: "Baro İş İlanları", location: "Ankara", type: "Staj" },
    ];

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <PageHeader
                title="Mezun Platformu"
                description="Mezunlarımızla bağımızı koparmıyoruz. Kariyer fırsatları, başarı hikayeleri ve mezunlar arası güçlü bir ağ."
            />

            <div className="container-custom py-12 space-y-24">

                {/* Search & Filters */}
                <section className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-5 relative">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                            <Input
                                placeholder="Mezun ismi veya unvan ara..."
                                className="pl-10 h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-7 flex flex-wrap gap-2">
                            {faculties.map(faculty => (
                                <button
                                    key={faculty}
                                    onClick={() => setSelectedFaculty(faculty)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                                        selectedFaculty === faculty
                                            ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                                            : "bg-slate-50 dark:bg-slate-800 text-slate-500 border-transparent hover:border-slate-300"
                                    )}
                                >
                                    {faculty}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Success Stories Grid */}
                <section>
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Başarı Hikayeleri</h2>
                            <p className="text-slate-500">Dicle'den dünyaya açılan gurur tablolarımız.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredStories.map((story, idx) => (
                                <motion.div
                                    key={story.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                >
                                    <Card className="h-full group hover:shadow-2xl transition-all duration-500 border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem]">
                                        <div className="relative h-48 overflow-hidden">
                                            <Image
                                                src={story.image}
                                                alt={story.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                                            <div className="absolute bottom-4 left-4 text-white">
                                                <Badge className="mb-2 bg-blue-500/20 backdrop-blur-md border-blue-500/30 text-blue-100">
                                                    {story.gradYear} Mezunu
                                                </Badge>
                                                <h3 className="text-xl font-bold">{story.name}</h3>
                                            </div>
                                        </div>
                                        <CardContent className="pt-6 space-y-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm font-bold text-[var(--primary)]">
                                                    <Briefcase className="w-4 h-4" />
                                                    {story.role}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                    <MapPin className="w-3 h-3" />
                                                    {story.location}
                                                </div>
                                            </div>

                                            <div className="relative p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl italic text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                                <Quote className="absolute -top-1 -left-1 w-6 h-6 text-slate-200 dark:text-slate-700 opacity-50 transform -scale-x-100" />
                                                "{story.quote}"
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>

                {/* Apply Split */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Career Opportunities */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-amber-500" />
                            </div>
                            Kariyer Fırsatları
                        </h2>
                        <div className="space-y-4">
                            {jobs.map(job => (
                                <div key={job.id} className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-[var(--primary)] transition-all flex justify-between items-center group cursor-pointer bg-slate-50/50 dark:bg-slate-950/50">
                                    <div className="space-y-1">
                                        <h3 className="font-bold group-hover:text-[var(--primary)] transition-colors">{job.title}</h3>
                                        <div className="text-xs text-slate-500">{job.company} • {job.location}</div>
                                    </div>
                                    <Badge variant="outline" className="rounded-lg">{job.type}</Badge>
                                </div>
                            ))}
                            <Button className="w-full h-12 rounded-xl mt-4" variant="outline">
                                Tüm İlanları Gör <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>

                    {/* Alumni Card Application */}
                    <div className="bg-[var(--primary)] rounded-[2rem] p-1 shadow-2xl overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-colors" />
                        <div className="p-8 relative z-10 text-white space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                    <GraduationCap className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold">Mezun Kartı</h2>
                            </div>
                            <p className="text-blue-100 text-sm leading-relaxed">
                                Üniversite tesislerinden, kütüphaneden ve anlaşmalı kurumlardan indirimli yararlanmak için resmi mezun kartınızı hemen talep edin.
                            </p>
                            <div className="space-y-4 pt-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input placeholder="T.C. Kimlik No" className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 h-12 rounded-xl focus:ring-white" />
                                    <Input placeholder="Mezuniyet Yılı" className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 h-12 rounded-xl focus:ring-white" />
                                </div>
                                <Button className="w-full h-14 bg-white text-[var(--primary)] hover:bg-white/90 font-bold text-lg rounded-xl transition-all shadow-xl active:scale-95">
                                    HEMEN BAŞVURUN <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </main>
    );
}

