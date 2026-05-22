"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, X } from "lucide-react";
import { createEvent, updateEvent, Event } from "@/app/actions/events";

interface EventFormProps {
    eventToEdit?: Event | null;
    onCancelEdit?: () => void;
    onSuccess?: () => void;
}

export default function EventForm({ eventToEdit, onCancelEdit, onSuccess }: EventFormProps) {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        try {
            let result;
            if (eventToEdit) {
                result = await updateEvent(eventToEdit.id, formData);
            } else {
                result = await createEvent(formData);
            }

            if (result.success) {
                if (onSuccess) onSuccess();

                // If not editing, reset the form (browser does this automatically for successful server actions usually, but we can force it if needed)
                if (!eventToEdit) {
                    const form = document.getElementById("event-form") as HTMLFormElement;
                    if (form) form.reset();
                }
            } else {
                alert(result.error || "Bir hata oluştu.");
            }
        } catch (error) {
            alert("Beklenmedik bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    }

    // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
    const formatDateForInput = (date: Date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    return (
        <form id="event-form" action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Etkinlik Başlığı</Label>
                <Input
                    id="title"
                    name="title"
                    defaultValue={eventToEdit?.title}
                    placeholder="Örn: Mezuniyet Töreni"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="date">Tarih ve Saat</Label>
                    <Input
                        id="date"
                        name="date"
                        type="datetime-local"
                        defaultValue={eventToEdit ? formatDateForInput(eventToEdit.date) : ""}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="location">Konum</Label>
                    <Input
                        id="location"
                        name="location"
                        defaultValue={eventToEdit?.location}
                        placeholder="Örn: Kongre Merkezi"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Açıklama (İsteğe Bağlı)</Label>
                <Textarea
                    id="description"
                    name="description"
                    defaultValue={eventToEdit?.description || ""}
                    placeholder="Etkinlik hakkında kısa bilgi..."
                    rows={3}
                />
            </div>

            <div className="flex gap-2">
                <Button type="submit" className="flex-1 gap-2" disabled={loading}>
                    {eventToEdit ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {loading ? "İşleniyor..." : (eventToEdit ? "Değişiklikleri Kaydet" : "Etkinliği Kaydet")}
                </Button>

                {eventToEdit && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancelEdit}
                        disabled={loading}
                    >
                        <X className="h-4 w-4 mr-2" />
                        İptal
                    </Button>
                )}
            </div>
        </form>
    );
}
