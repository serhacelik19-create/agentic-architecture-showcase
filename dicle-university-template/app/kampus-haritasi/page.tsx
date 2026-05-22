"use client";

import { PageHeader } from "@/components/layout/PageLayout";
import { useState, useMemo } from "react";
import { MapPin, Info, Navigation, Search, School, GraduationCap, Coffee, Heart, Landmark, ArrowRight, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Location = {
    id: string;
    name: string;
    description: string;
    type: "academic" | "social" | "health" | "admin";
    coords?: { lat: number; lng: number };
    embedUrl?: string;
};

const CAMPUS_LOCATIONS: Location[] = [
    {
        id: "loc1",
        name: "Rektörlük Binası",
        description: "Üniversite yönetim merkezi, öğrenci işleri ve idari birimlerin bulunduğu ana bina.",
        type: "admin",
        embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3152.0!2d40.279!3d37.905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDU0JzE4LjAiTiA0MMKwMTYnNDQuNCJF!5e0!3m2!1str!2str"
    },
    {
        id: "loc2",
        name: "Merkez Kütüphane",
        description: "7/24 hizmet veren, zengin kitap arşivi ve modern çalışma alanlarına sahip kütüphanemiz.",
        type: "academic"
    },
    {
        id: "loc3",
        name: "Tıp Fakültesi Hastanesi",
        description: "Bölgenin en büyük ve en donanımlı sağlık kompleksi. Onkoloji ve kalp hastanelerini de barındırır.",
        type: "health"
    },
    {
        id: "loc4",
        name: "Öğrenci Yaşam Merkezi",
        description: "Ana yemekhane, kafeteryalar, banka şubeleri ve sosyal kulüp ofislerinin merkezi.",
        type: "social"
    },
    {
        id: "loc5",
        name: "15 Temmuz Kongre Merkezi",
        description: "Bilimsel kongreler, konserler ve büyük ölçekli sanatsal faaliyetler için kullanılan merkez.",
        type: "social"
    },
    {
        id: "loc6",
        name: "Spor Adası",
        description: "Yüzme havuzu, tenis kortları, halı sahalar ve açık hava spor alanlarının bulunduğu bölge.",
        type: "social"
    },
    {
        id: "loc7",
        name: "Mühendislik Fakültesi",
        description: "Modern laboratuvarları ve uygulama atölyeleriyle kampüsün kuzey ucunda yer alan fakülte.",
        type: "academic"
    },
    {
        id: "loc8",
        name: "İlahiyat Fakültesi Kampüsü",
        description: "Kendi içinde yeşil alanları ve uygulama camisi bulunan huzurlu bir eğitim alanı.",
        type: "academic"
    },
];

export default function CampusMapPage() {
    const [selectedType, setSelectedType] = useState<string | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeLocation, setActiveLocation] = useState<Location>(CAMPUS_LOCATIONS[0]);

    const filteredLocations = useMemo(() => {
        return CAMPUS_LOCATIONS.filter(loc => {
            const matchesType = selectedType === "all" || loc.type === selectedType;
            const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesType && matchesSearch;
        });
    }, [selectedType, searchQuery]);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "academic": return <GraduationCap className="w-5 h-5" />;
            case "health": return <MapPin className="w-5 h-5 text-red-500" />;
            case "social": return <Coffee className="w-5 h-5" />;
            case "admin": return <Landmark className="w-5 h-5" />;
            default: return <MapPin className="w-5 h-5" />;
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <PageHeader
                title="İnteraktif Kampüs Rehberi"
                description="27.000 dönümlük yeşil kampüsümüzde aradığınız noktayı kolayca bulun. Birim detaylarını inceleyebilir ve yol tarifi alabilirsiniz."
            />

            <div className="container-custom py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[700px]">

                    {/* Sidebar: Search and List */}
                    <div className="lg:col-span-4 flex flex-col gap-6 h-full">
                        {/* Filters & Search */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Konum Ara..."
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {["all", "academic", "health", "social", "admin"].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedType(type)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-full text-xs font-bold transition-all border uppercase tracking-wider",
                                            selectedType === type
                                                ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                                                : "bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-[var(--primary)]"
                                        )}
                                    >
                                        {type === "all" ? "Hepsi" : type === "academic" ? "Akademik" : type === "health" ? "Sağlık" : type === "social" ? "Sosyal" : "İdari"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Location List */}
                        <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 scrollbar-hide">
                            <div className="p-2 space-y-1">
                                {filteredLocations.map((loc) => (
                                    <button
                                        key={loc.id}
                                        onClick={() => setActiveLocation(loc)}
                                        className={cn(
                                            "w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left group",
                                            activeLocation.id === loc.id
                                                ? "bg-slate-50 dark:bg-slate-800 border-l-4 border-[var(--primary)]"
                                                : "hover:bg-slate-50 dark:hover:bg-slate-800 border-l-4 border-transparent"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                            activeLocation.id === loc.id ? "bg-white dark:bg-slate-900 shadow-md" : "bg-slate-100 dark:bg-slate-700"
                                        )}>
                                            {getTypeIcon(loc.type)}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <h4 className="font-bold text-slate-900 dark:text-white truncate">{loc.name}</h4>
                                            <p className="text-xs text-slate-500 truncate capitalize">{loc.type}</p>
                                        </div>
                                        <ArrowRight className={cn(
                                            "w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform",
                                            activeLocation.id === loc.id && "text-[var(--primary)]"
                                        )} />
                                    </button>
                                ))}
                                {filteredLocations.length === 0 && (
                                    <div className="p-8 text-center text-slate-500 text-sm">
                                        Aranan ölçütlere uygun konum bulunamadı.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main: Map View */}
                    <div className="lg:col-span-8 flex flex-col gap-6 h-full">
                        <div className="relative flex-1 bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden group">
                            {/* Map Overlay Header */}
                            <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-2 rounded-xl shadow-md border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{activeLocation.name}</span>
                            </div>

                            <iframe
                                src={activeLocation.embedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3152.0!2d40.279!3d37.905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDU0JzE4LjAiTiA0MMKwMTYnNDQuNCJF!5e0!3m2!1str!2str"}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                className="grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 h-full"
                            ></iframe>

                            {/* Detail Overlay */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeLocation.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="absolute bottom-6 right-6 left-6 md:left-auto md:w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-6 rounded-3xl shadow-2xl border-b-8 border-[var(--primary)]"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-[var(--muted)] flex items-center justify-center shrink-0">
                                            {getTypeIcon(activeLocation.type)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl text-slate-900 dark:text-white">{activeLocation.name}</h3>
                                            <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-widest">{activeLocation.type}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                                        {activeLocation.description}
                                    </p>
                                    <div className="flex gap-3">
                                        <Button className="flex-1 font-bold shadow-lg shadow-blue-500/20">
                                            <Navigation className="w-4 h-4 mr-2" /> Yol Tarifi
                                        </Button>
                                        <Link href="/sanal-tur" className="flex-1">
                                            <Button variant="outline" className="w-full font-bold">
                                                <Video className="w-4 h-4 mr-2" /> Sanal Tur
                                            </Button>
                                        </Link>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Quick Links */}
            <div className="container-custom mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-600 rounded-3xl p-6 text-white flex items-center gap-4 group cursor-pointer hover:bg-blue-700 transition-colors">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-0">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold">Ana Giriş Kapısı</h4>
                            <p className="text-xs text-blue-100">Dicle Üniversitesi Hastane Girişi</p>
                        </div>
                    </div>
                    <div className="bg-slate-900 rounded-3xl p-6 text-white flex items-center gap-4 group cursor-pointer hover:bg-black transition-colors">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-0">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold">Öğrenci Girişi</h4>
                            <p className="text-xs text-slate-400">Batı Kapısı (Ziraat Girişi)</p>
                        </div>
                    </div>
                    <div className="bg-[var(--secondary)] rounded-3xl p-6 text-white flex items-center gap-4 group cursor-pointer hover:opacity-90 transition-opacity">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-0">
                            <Heart className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold">Hastane Girişi</h4>
                            <p className="text-xs text-amber-100">Klinikler ve Acil Girişi</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
