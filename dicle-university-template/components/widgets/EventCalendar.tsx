"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";

type Event = {
    id: number;
    title: string;
    date: Date; // Internal type
    location: string;
    description: string | null;
};

// Prop type (dates as strings from server)
interface EventCalendarProps {
    initialEvents?: {
        id: number;
        title: string;
        date: string | Date;
        location: string;
        description: string | null;
    }[];
}

export function EventCalendar({ initialEvents = [] }: EventCalendarProps) {
    const { t, locale } = useLanguage();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    // Convert props to internal Date objects
    const events: Event[] = initialEvents.map(e => ({
        ...e,
        date: new Date(e.date),
    }));

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const prefixDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const activeEvents = selectedDate
        ? events.filter(e => e.date.getDate() === selectedDate.getDate() && e.date.getMonth() === selectedDate.getMonth() && e.date.getFullYear() === selectedDate.getFullYear())
        : events.filter(e => e.date.getMonth() === currentDate.getMonth() && e.date.getFullYear() === currentDate.getFullYear());

    const dateLocales: Record<string, string> = {
        'tr': 'tr-TR',
        'en': 'en-US',
        'ku': 'ku-TR'
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-[var(--primary)]" />
                    {t("calendar.title")}
                </h3>
                <div className="flex gap-1">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-semibold w-24 text-center py-1 capitalize">
                        {currentDate.toLocaleDateString(dateLocales[locale], { month: "long", year: "numeric" })}
                    </span>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Calendar Grid */}
                <div>
                    <div className="grid grid-cols-7 text-center text-xs text-slate-400 mb-2">
                        <div>{t("day.sun")}</div><div>{t("day.mon")}</div><div>{t("day.tue")}</div><div>{t("day.wed")}</div><div>{t("day.thu")}</div><div>{t("day.fri")}</div><div>{t("day.sat")}</div>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {prefixDays.map(d => <div key={`prefix-${d}`} />)}
                        {days.map(day => {
                            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                            const hasEvent = events.some(e => e.date.toDateString() === date.toDateString());
                            const isSelected = selectedDate?.toDateString() === date.toDateString();

                            return (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDate(date)}
                                    className={cn(
                                        "h-10 w-10 mx-auto rounded-full flex items-center justify-center text-sm transition-all hover:bg-slate-100",
                                        isSelected ? "bg-[var(--primary)] text-white hover:bg-[var(--primary)] shadow-md" : "",
                                        hasEvent && !isSelected ? "font-bold text-[var(--secondary)] ring-1 ring-[var(--secondary)] ring-offset-2" : ""
                                    )}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Events List */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    <h4 className="text-sm font-semibold text-slate-500 mb-2">
                        {selectedDate
                            ? selectedDate.toLocaleDateString(dateLocales[locale], { day: "numeric", month: "long" }) + t("calendar.daySuffix")
                            : t("calendar.monthEvents")}
                    </h4>

                    {activeEvents.length > 0 ? (
                        activeEvents.map(event => (
                            <div key={event.id} className="p-3 rounded-lg bg-slate-50 border-l-4 border-[var(--primary)] hover:shadow-md transition-shadow group">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-bold text-[var(--primary)] bg-blue-100 px-2 py-0.5 rounded capitalize">
                                        {event.date.getDate()} {event.date.toLocaleDateString(dateLocales[locale], { month: "short" })}
                                    </span>
                                    <span className={cn(
                                        "text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded text-blue-500 bg-blue-50"
                                    )}>
                                        {t("calendar.event")}
                                    </span>
                                </div>
                                <h5 className="font-bold text-sm text-slate-800 group-hover:text-[var(--primary)] transition-colors mb-2">
                                    {event.title}
                                </h5>
                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {event.date.toLocaleTimeString(dateLocales[locale], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-slate-400 text-sm">
                            {t("calendar.noEvents")}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
