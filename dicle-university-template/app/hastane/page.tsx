import Link from "next/link";
import { PageHeader } from "@/components/layout/PageLayout";
import { Phone, Calendar, Clock, MapPin, HeartPulse, Activity, ArrowRight, ChevronRight, Megaphone, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getActivePolyclinics, getActiveHospitalAnnouncements } from "@/app/actions/hospital";
import IconRenderer from "@/components/ui/IconRenderer";
import { HospitalPolyclinic, HospitalAnnouncement } from "@prisma/client";
import { db } from "@/lib/db";
import HospitalContentTabs from "@/components/hospital/HospitalContentTabs";
import PolyclinicsList from "@/components/hospital/PolyclinicsList";

export const dynamic = 'force-dynamic';

export default async function HospitalPage() {
    const [polyclinicsRes, announcementsRes, newsItems, events] = await Promise.all([
        getActivePolyclinics(),
        getActiveHospitalAnnouncements(),
        db.news.findMany({
            where: { published: true },
            orderBy: { date: 'desc' },
            take: 6
        }),
        db.event.findMany({
            where: { date: { gte: new Date() } },
            orderBy: { date: 'asc' },
            take: 6
        })
    ]);

    const polyclinics = polyclinicsRes.data || [];
    const announcements = announcementsRes.data || [];
    const news = newsItems || [];
    const recentEvents = events || [];

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Hero Section */}
            <div className="relative bg-slate-900 h-[300px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-900 to-slate-900 opacity-90 z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                <div className="container-custom h-full flex flex-col justify-center relative z-20 text-white">
                    <div className="flex items-center gap-3 mb-4 text-rose-300 font-medium tracking-wide uppercase text-sm animate-in fade-in slide-in-from-bottom-3">
                        <HeartPulse />
                        <span>Sağlığınız Bize Emanet</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Dicle Üniversitesi Hastanesi</h1>
                    <p className="text-slate-300 text-lg max-w-2xl font-light leading-relaxed">
                        Bölgenin en köklü ve donanımlı sağlık üssü. 7/24 kesintisiz sağlık hizmeti, uzman kadro ve modern teknoloji.
                    </p>
                </div>
            </div>

            <div className="container-custom py-12">
                {/* Quick Actions Bar - Floating Card */}
                <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 -mt-20 relative z-30 flex flex-col md:flex-row items-center justify-between gap-8 border-b-4 border-rose-500 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Phone className="w-8 h-8 animate-pulse" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Acil Randevu & Danışma</h3>
                            <p className="text-rose-600 dark:text-rose-400 font-bold text-3xl tracking-tight">0 (412) 248 80 01</p>
                            <p className="text-sm text-slate-400 mt-1">7/24 Çağrı Merkezi</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <Link href="https://mhrs.gov.tr/" target="_blank" rel="noopener noreferrer">
                            <Button size="lg" className="h-14 px-8 text-base bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-900/20 rounded-xl transition-all hover:scale-105 active:scale-95 w-full sm:w-auto">
                                <Calendar className="mr-2 h-5 w-5" /> Online Randevu Al
                            </Button>
                        </Link>
                        <Link href="http://212.175.244.148/ProLABSONUC/Home/Login" target="_blank" rel="noopener noreferrer">
                            <Button size="lg" variant="outline" className="h-14 px-8 text-base hover:bg-rose-50 dark:hover:bg-rose-900/10 hover:text-rose-600 border-slate-200 dark:border-slate-800 rounded-xl transition-all w-full sm:w-auto">
                                <Activity className="mr-2 h-5 w-5" /> Tahlil Sonuçları
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-16">

                        {/* Polyclinics Section */}
                        <PolyclinicsList polyclinics={polyclinics} />

                        <section>
                            <HospitalContentTabs
                                news={news}
                                announcements={announcements}
                                events={events}
                            />
                        </section>
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-lg border-b border-slate-100 dark:border-slate-800 pb-4 mb-6 text-slate-900 dark:text-white flex items-center gap-3">
                                <Clock className="w-5 h-5 text-rose-500" />
                                Ziyaret Saatleri
                            </h3>
                            <div className="space-y-6">
                                <TimeRow label="Hafta İçi (Öğle)" time="12:30 - 13:30" />
                                <TimeRow label="Hafta İçi (Akşam)" time="18:30 - 19:30" />
                                <TimeRow label="Hafta Sonu" time="13:00 - 15:00" />

                                <div className="mt-6 p-4 bg-rose-50 dark:bg-rose-900/10 text-rose-700 dark:text-rose-300 text-sm rounded-xl leading-relaxed border border-rose-100 dark:border-rose-900/20 flex gap-3">
                                    <Activity className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <span>Yoğun bakım üniteleri için ziyaret saatleri hastanın durumuna göre değişiklik gösterebilir.</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 text-white p-8 rounded-2xl relative overflow-hidden shadow-2xl">
                            <MapPin className="w-32 h-32 text-white/5 absolute -right-6 -bottom-6 rotate-12" />
                            <h3 className="font-bold text-lg border-b border-white/20 pb-4 mb-6 flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-rose-400" />
                                Ulaşım & Konum
                            </h3>
                            <p className="text-slate-300 mb-8 leading-relaxed">
                                Dicle Üniversitesi Kampüsü,<br />
                                Tıp Fakültesi Hastaneler Bölgesi<br />
                                <span className="text-slate-400 text-sm">21280 Sur / DİYARBAKIR</span>
                            </p>
                            <Button className="w-full bg-white text-slate-900 hover:bg-rose-50 hover:text-rose-600 transition-all font-semibold h-12 shadow-lg">
                                Yol Tarifi Al
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function TimeRow({ label, time }: { label: string, time: string }) {
    return (
        <div className="flex justify-between items-center group">
            <span className="text-slate-500 group-hover:text-slate-700 transition-colors">{label}</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-md group-hover:bg-rose-50 dark:group-hover:bg-rose-900/20 group-hover:text-rose-600 transition-colors">{time}</span>
        </div>
    );
}
