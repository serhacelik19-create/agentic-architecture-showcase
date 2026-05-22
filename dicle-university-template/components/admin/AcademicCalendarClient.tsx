"use client";

import { useState } from "react";
import { saveAcademicCalendarItem, deleteAcademicCalendarItem } from "@/app/actions/academic-calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Trash2, Plus, Save } from "lucide-react";

interface CalendarItem {
    id: number;
    term: string;
    date: string;
    event: string;
    order: number;
}

export default function AcademicCalendarClient({ initialItems }: { initialItems: CalendarItem[] }) {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            {/* Create / Edit Form */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Takvim Öğesi Ekle</CardTitle>
                        <CardDescription>Akademik takvime yeni bir tarih ekleyin.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={async (formData) => {
                            setIsLoading(true);
                            await saveAcademicCalendarItem(formData);
                            setIsLoading(false);
                            // Reset form manually or use a ref if needed, simple action here
                            const form = document.getElementById("calendar-form") as HTMLFormElement;
                            form?.reset();
                        }} id="calendar-form" className="space-y-4">

                            <div className="space-y-2">
                                <Label htmlFor="term">Dönem</Label>
                                <select name="term" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required>
                                    <option value="Güz Yarıyılı">Güz Yarıyılı</option>
                                    <option value="Bahar Yarıyılı">Bahar Yarıyılı</option>
                                    <option value="Yaz Okulu">Yaz Okulu</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date">Tarih Aralığı / Günü</Label>
                                <Input name="date" placeholder="Örn: 16-20 Ekim veya 14 Şubat" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="event">Olay / Açıklama</Label>
                                <Input name="event" placeholder="Örn: Derslerin Başlaması" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="order">Sıralama</Label>
                                <Input name="order" type="number" defaultValue="0" required />
                            </div>

                            <Button type="submit" disabled={isLoading} className="w-full gap-2">
                                {isLoading ? "Kaydediliyor..." : <><Save className="h-4 w-4" /> Kaydet</>}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* List */}
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Takvim Listesi</CardTitle>
                        <CardDescription>Ekli olan tüm tarihleri buradan yönetebilirsiniz.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                            {initialItems.length > 0 ? (
                                initialItems.map((item) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                                    {item.term}
                                                </span>
                                                <span className="text-sm text-slate-500 font-mono hidden sm:inline">#{item.order}</span>
                                            </div>
                                            <div className="font-semibold text-sm sm:text-base">{item.event}</div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {item.date}
                                            </div>
                                        </div>
                                        <form action={async () => {
                                            if (confirm("Silmek istediğinize emin misiniz?")) {
                                                await deleteAcademicCalendarItem(item.id);
                                            }
                                        }}>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 shrink-0">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    Takvim boş.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
