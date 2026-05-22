
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Megaphone, Calendar, Newspaper, ArrowRight, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { HospitalAnnouncement, News, Event } from "@prisma/client";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface HospitalContentTabsProps {
    news: News[];
    announcements: HospitalAnnouncement[];
    events: Event[];
}

export default function HospitalContentTabs({ news, announcements, events }: HospitalContentTabsProps) {
    return (
        <Tabs defaultValue="announcements" className="space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <TabsList className="h-14 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl grid grid-cols-3 w-full md:w-[600px]">
                    <TabsTrigger value="announcements" className="h-12 rounded-lg text-base data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-rose-600 data-[state=active]:shadow-sm transition-all duration-300">
                        <Megaphone className="w-4 h-4 mr-2" /> Duyurular
                    </TabsTrigger>
                    <TabsTrigger value="news" className="h-12 rounded-lg text-base data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-300">
                        <Newspaper className="w-4 h-4 mr-2" /> Haberler
                    </TabsTrigger>
                    <TabsTrigger value="events" className="h-12 rounded-lg text-base data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm transition-all duration-300">
                        <Calendar className="w-4 h-4 mr-2" /> Etkinlikler
                    </TabsTrigger>
                </TabsList>
            </div>

            {/* DUYURULAR TAB */}
            <TabsContent value="announcements" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-6">
                    <span className="p-2 bg-rose-100 dark:bg-rose-900/20 text-rose-600 rounded-lg">
                        <Megaphone size={24} />
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Hastane Duyuruları</h2>
                </div>

                <div className="space-y-4">
                    {announcements.length > 0 ? (
                        announcements.map((announcement) => {
                            const date = new Date(announcement.date);
                            const month = date.toLocaleDateString('tr-TR', { month: 'long' });
                            const day = date.getDate();

                            return (
                                <div key={announcement.id} className="group flex flex-col md:flex-row gap-6 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-rose-100 dark:hover:border-rose-900/30 transition-all hover:shadow-lg hover:-translate-y-1">
                                    <div className="flex-shrink-0 flex md:flex-col items-center justify-center md:px-6 md:border-r border-slate-100 dark:border-slate-800 gap-2 md:gap-0">
                                        <span className="text-4xl font-bold text-rose-600 tracking-tighter">{day}</span>
                                        <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{month}</span>
                                    </div>
                                    <div className="flex-1 pt-1 md:pt-0">
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-rose-600 transition-colors">
                                            {announcement.title}
                                        </h4>
                                        <p className="text-slate-500 leading-relaxed text-sm">
                                            {announcement.content}
                                        </p>
                                        <div className="mt-4 flex items-center gap-2">
                                            <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-md">Genel Duyuru</span>
                                            <ArrowRight size={14} className="text-rose-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <EmptyState icon={Megaphone} message="Aktif duyuru bulunmamaktadır." />
                    )}
                </div>
            </TabsContent>

            {/* HABERLER TAB */}
            <TabsContent value="news" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-6">
                    <span className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                        <Newspaper size={24} />
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Güncel Haberler</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {news.length > 0 ? (
                        news.map((item) => (
                            <Link key={item.id} href={`/haberler/${item.slug}`} className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <div className="aspect-video relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <Newspaper size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                                        <Clock size={14} />
                                        <span>{format(new Date(item.date), 'dd MMMM yyyy', { locale: tr })}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm line-clamp-3 mb-4">
                                        {item.content}
                                    </p>
                                    <span className="inline-flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
                                        Devamını Oku <ArrowRight size={16} className="ml-1" />
                                    </span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-2">
                            <EmptyState icon={Newspaper} message="Henüz haber eklenmemiş." />
                        </div>
                    )}
                </div>
            </TabsContent>

            {/* ETKİNLİKLER TAB */}
            <TabsContent value="events" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-6">
                    <span className="p-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 rounded-lg">
                        <Calendar size={24} />
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Yaklaşan Etkinlikler</h2>
                </div>

                <div className="space-y-4">
                    {events.length > 0 ? (
                        events.map((event) => (
                            <div key={event.id} className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col sm:flex-row gap-6 hover:border-emerald-200 dark:hover:border-emerald-900/30 hover:shadow-lg transition-all duration-300">
                                <div className="sm:w-32 flex-shrink-0 flex flex-row sm:flex-col items-center justify-center bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-4 text-emerald-600 sm:gap-1 gap-4">
                                    <span className="text-3xl font-bold tracking-tighter">
                                        {format(new Date(event.date), 'dd')}
                                    </span>
                                    <span className="text-sm font-semibold uppercase tracking-wider">
                                        {format(new Date(event.date), 'MMM', { locale: tr })}
                                    </span>
                                    <span className="text-xs opacity-75 hidden sm:inline-block">
                                        {format(new Date(event.date), 'yyyy')}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 transition-colors">
                                        {event.title}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-3">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={16} className="text-emerald-500" />
                                            <span>{event.location}</span>
                                        </div>
                                    </div>
                                    {event.description && (
                                        <p className="text-slate-500 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                                            {event.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <EmptyState icon={Calendar} message="Yaklaşan etkinlik bulunmamaktadır." />
                    )}
                </div>
            </TabsContent>
        </Tabs>
    );
}

function EmptyState({ icon: Icon, message }: { icon: any, message: string }) {
    return (
        <div className="p-12 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-center flex flex-col items-center justify-center text-slate-400">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-4">
                <Icon size={32} className="opacity-50" />
            </div>
            <p className="font-medium">{message}</p>
        </div>
    );
}
