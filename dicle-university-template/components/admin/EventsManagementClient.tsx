"use client";

import { useState } from "react";
import { Event, deleteEvent } from "@/app/actions/events";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Trash2, Edit, FileText, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EventForm from "@/components/admin/EventForm";
import { importEventsFromPDF } from "@/app/actions/events";

interface EventsManagementClientProps {
    initialEvents: Event[];
}

export default function EventsManagementClient({ initialEvents }: EventsManagementClientProps) {
    const [events, setEvents] = useState<Event[]>(initialEvents);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);

    // Update local state when server revalidates (this is a bit tricky with server actions revalidating path, 
    // but for now we rely on the page reload or proper state management. 
    // Actually, since revalidatePath refreshes the RSC payload, the parent `page.tsx` will re-render and pass new `initialEvents`.
    // We should sync state with props.)
    if (initialEvents !== events) {
        setEvents(initialEvents);
    }
    // The above sync pattern is risky in React. better to just use initialEvents directly if we don't need optimistic updates locally beyond what revalidatePath does.
    // However, for "Editing" state, we need client side state.

    const handleEditClick = (event: Event) => {
        setEditingEvent(event);
        // Scroll to form
        const formElement = document.getElementById("event-form-card");
        if (formElement) {
            formElement.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleCancelEdit = () => {
        setEditingEvent(null);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-8">
                {/* PDF Import Card */}
                <Card className="border-indigo-100 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-900/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                            <FileText className="h-5 w-5" />
                            Toplu PDF Yükle
                        </CardTitle>
                        <CardDescription>
                            Etkinlik listesi içeren PDF dosyasını yükleyin.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={async (formData) => {
                            await importEventsFromPDF(formData);
                            // We rely on server revalidation for list update
                        }} className="flex gap-4 items-end">
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="file">PDF Dosyası</Label>
                                <Input id="file" name="file" type="file" accept=".pdf" required className="bg-white dark:bg-slate-950" />
                            </div>
                            <Button type="submit" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                                <Upload className="h-4 w-4" />
                                Yükle
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Create/Edit Event Form */}
                <Card id="event-form-card" className={editingEvent ? "border-amber-400 dark:border-amber-600 shadow-md ring-1 ring-amber-400 dark:ring-amber-600" : ""}>
                    <CardHeader>
                        <CardTitle>{editingEvent ? "Etkinliği Düzenle" : "Yeni Etkinlik Ekle"}</CardTitle>
                        <CardDescription>
                            {editingEvent
                                ? "Seçili etkinliğin bilgilerini güncelleyin."
                                : "Yaklaşan bir etkinlik veya duyuru ekleyin."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <EventForm
                            key={editingEvent ? editingEvent.id : "new"} // Re-mount form on edit change to reset fields properly
                            eventToEdit={editingEvent}
                            onCancelEdit={handleCancelEdit}
                            onSuccess={() => setEditingEvent(null)}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Events List */}
            <Card>
                <CardHeader>
                    <CardTitle>Yaklaşan Etkinlikler</CardTitle>
                    <CardDescription>Sistemde kayıtlı aktif etkinlikler.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {events && events.length > 0 ? (
                            events.map((event) => (
                                <div key={event.id} className={`flex items-start justify-between p-4 rounded-lg border transition-colors ${editingEvent?.id === event.id ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800' : 'bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800'}`}>
                                    <div className="space-y-1">
                                        <div className="font-semibold text-lg">{event.title}</div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {new Date(event.date).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3.5 w-3.5" />
                                                {event.location}
                                            </div>
                                        </div>
                                        {event.description && (
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{event.description}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEditClick(event)}
                                            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <form action={async () => {
                                            if (confirm("Bu etkinliği silmek istediğinize emin misiniz?")) {
                                                await deleteEvent(event.id);
                                            }
                                        }}>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                Henüz hiç etkinlik eklenmemiş.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
