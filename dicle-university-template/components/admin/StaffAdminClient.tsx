"use client";

import { useState } from "react";
import { saveStaffMember, deleteStaffMember } from "@/app/actions/staff";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trash2, Save, User, Building, Phone, Mail, GripVertical } from "lucide-react";
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
    order: number;
}

export default function StaffAdminClient({ initialStaff }: { initialStaff: StaffMember[] }) {
    const [isLoading, setIsLoading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Filter state for admin list could be useful if list is long
    const [searchTerm, setSearchTerm] = useState("");

    const filteredStaff = initialStaff.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Create / Edit Form */}
            <div className="xl:col-span-1 space-y-6">
                <Card className="sticky top-24">
                    <CardHeader>
                        <CardTitle>{editingId ? "Personeli Düzenle" : "Yeni Personel Ekle"}</CardTitle>
                        <CardDescription>Akademik veya idari personel kaydı oluşturun.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={async (formData) => {
                            setIsLoading(true);
                            await saveStaffMember(formData);
                            setIsLoading(false);
                            setEditingId(null); // Exit edit mode
                            const form = document.getElementById("staff-form") as HTMLFormElement;
                            form?.reset();
                        }} id="staff-form" className="space-y-4">

                            {editingId && <input type="hidden" name="id" value={editingId} />}

                            <div className="space-y-2">
                                <Label htmlFor="name">Ad Soyad</Label>
                                <Input name="name" placeholder="Örn: Prof. Dr. Ahmet Yılmaz" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Unvan / Görev</Label>
                                <Input name="title" placeholder="Örn: Dekan, Şube Müdürü" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="department">Birim / Departman</Label>
                                <Input name="department" placeholder="Örn: Tıp Fakültesi, Bilgi İşlem" required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefon</Label>
                                    <Input name="phone" placeholder="0 (412) ..." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="room">Oda No</Label>
                                    <Input name="room" placeholder="Z-12" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">E-Posta</Label>
                                <Input name="email" type="email" placeholder="ornek@dicle.edu.tr" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="avatar">Fotoğraf URL</Label>
                                <Input name="avatar" placeholder="https://..." />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="order">Sıralama</Label>
                                <Input name="order" type="number" defaultValue="0" />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button type="submit" disabled={isLoading} className="flex-1 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                                    {isLoading ? "Kaydediliyor..." : <><Save className="h-4 w-4" /> {editingId ? "Güncelle" : "Kaydet"}</>}
                                </Button>
                                {editingId && (
                                    <Button type="button" variant="outline" onClick={() => {
                                        setEditingId(null);
                                        const form = document.getElementById("staff-form") as HTMLFormElement;
                                        form?.reset();
                                    }}>
                                        İptal
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* List */}
            <div className="xl:col-span-2 space-y-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Personel Listesi</CardTitle>
                            <CardDescription>Toplam {initialStaff.length} kayıtlı personel.</CardDescription>
                        </div>
                        <Input
                            placeholder="Listede ara..."
                            className="w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {filteredStaff.length > 0 ? (
                                filteredStaff.map((item) => (
                                    <div key={item.id} className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 gap-4 hover:border-indigo-300 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col items-center gap-1">
                                                <GripVertical className="h-4 w-4 text-slate-300 cursor-move" />
                                            </div>
                                            <Avatar className="h-12 w-12 border border-slate-200">
                                                <AvatarImage src={item.avatar || ""} />
                                                <AvatarFallback className="bg-white text-indigo-600 font-bold">
                                                    {item.name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-0.5">
                                                <div className="font-semibold text-slate-900 dark:text-white">{item.name}</div>
                                                <div className="text-xs text-indigo-600 font-medium uppercase">{item.title}</div>
                                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                                    <span className="flex items-center gap-1"><Building className="h-3 w-3" /> {item.department}</span>
                                                    {item.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {item.phone}</span>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 pl-8 md:pl-0">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingId(item.id);
                                                    // Populate form manually simply by finding elements
                                                    // A better way is using react-hook-form but this works for simple cases without deps
                                                    const form = document.getElementById("staff-form") as HTMLFormElement;
                                                    if (form) {
                                                        (form.elements.namedItem("name") as HTMLInputElement).value = item.name;
                                                        (form.elements.namedItem("title") as HTMLInputElement).value = item.title || "";
                                                        (form.elements.namedItem("department") as HTMLInputElement).value = item.department;
                                                        (form.elements.namedItem("phone") as HTMLInputElement).value = item.phone || "";
                                                        (form.elements.namedItem("email") as HTMLInputElement).value = item.email || "";
                                                        (form.elements.namedItem("room") as HTMLInputElement).value = item.room || "";
                                                        (form.elements.namedItem("avatar") as HTMLInputElement).value = item.avatar || "";
                                                        (form.elements.namedItem("order") as HTMLInputElement).value = item.order.toString();
                                                    }
                                                }}
                                            >
                                                Düzenle
                                            </Button>

                                            <form action={async () => {
                                                if (confirm("Silmek istediğinize emin misiniz?")) {
                                                    await deleteStaffMember(item.id);
                                                }
                                            }}>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 shrink-0">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-muted-foreground bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <User className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                                    <p>Kayıt bulunamadı.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
