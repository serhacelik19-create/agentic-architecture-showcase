import { getEvents, createEvent, deleteEvent, importEventsFromPDF } from "@/app/actions/events";
import { getAcademicCalendarItems } from "@/app/actions/academic-calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, MapPin, Trash2, Plus, ArrowLeft, FileText, Upload } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AcademicCalendarClient from "@/components/admin/AcademicCalendarClient";
import EventsManagementClient from "@/components/admin/EventsManagementClient";

export default async function EventsAdminPage() {
    const { data: events, error: eventsError } = await getEvents();
    const { data: calendarItems } = await getAcademicCalendarItems();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Etkinlik & Takvim Yönetimi</h1>
                    <p className="text-muted-foreground">Akademik takvim ve etkinlikleri buradan yönetebilirsiniz.</p>
                </div>
                <Link href="/admin">
                    <Button variant="outline" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Panele Dön
                    </Button>
                </Link>
            </div>

            <Tabs defaultValue="events" className="space-y-6">
                <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <TabsTrigger value="events" className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-sm">Etkinlikler (Events)</TabsTrigger>
                    <TabsTrigger value="calendar" className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-sm">Akademik Takvim</TabsTrigger>
                </TabsList>

                {/* --- TAB: EVENTS (NEW LOGIC) --- */}
                <TabsContent value="events" className="space-y-8">
                    <EventsManagementClient initialEvents={events || []} />
                </TabsContent>

                {/* --- TAB: ACADEMIC CALENDAR (NEW LOGIC) --- */}
                <TabsContent value="calendar">
                    <AcademicCalendarClient initialItems={calendarItems || []} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

