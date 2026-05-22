"use client";

import { useActionState, useState } from "react";
import { updateStudentInfo } from "@/app/actions/student-info";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Trash2, CheckCircle, Save, Link as LinkIcon } from "lucide-react";

interface LinkItem {
    title: string;
    url: string;
}

interface StudentInfoFormProps {
    initialData: {
        title: string;
        description: string;
        buttonText: string;
        buttonUrl: string;
        links: string;
    } | null;
}

export default function StudentInfoForm({ initialData }: StudentInfoFormProps) {
    const [state, formAction, isPending] = useActionState(updateStudentInfo, { success: false, message: "" });
    const [links, setLinks] = useState<LinkItem[]>(
        initialData?.links ? JSON.parse(initialData.links) : []
    );

    const addLink = () => {
        setLinks([...links, { title: "", url: "" }]);
    };

    const removeLink = (index: number) => {
        const newLinks = [...links];
        newLinks.splice(index, 1);
        setLinks(newLinks);
    };

    const updateLink = (index: number, field: keyof LinkItem, value: string) => {
        const newLinks = [...links];
        newLinks[index][field] = value;
        setLinks(newLinks);
    };

    return (
        <form action={formAction}>
            <div className="grid gap-6">
                <Card className="border-slate-200 dark:border-slate-800">
                    <CardHeader>
                        <CardTitle>Genel Bilgiler</CardTitle>
                        <CardDescription>Kartın sol tarafındaki ana içerik alanları.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Başlık</Label>
                            <Input
                                id="title"
                                name="title"
                                defaultValue={initialData?.title}
                                placeholder="Örn: Öğrenci"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Açıklama</Label>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={initialData?.description}
                                placeholder="Kısa açıklama metni..."
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="buttonText">Buton Yazısı</Label>
                                <Input
                                    id="buttonText"
                                    name="buttonText"
                                    defaultValue={initialData?.buttonText}
                                    placeholder="Örn: Sayfaya Git"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="buttonUrl">Buton Linki</Label>
                                <Input
                                    id="buttonUrl"
                                    name="buttonUrl"
                                    defaultValue={initialData?.buttonUrl}
                                    placeholder="Örn: /ogrenci"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 dark:border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Bağlantılar</CardTitle>
                            <CardDescription>Kartın sağ tarafındaki hızlı bağlantılar.</CardDescription>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={addLink} className="gap-2">
                            <Plus size={16} /> Link Ekle
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {links.map((link, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                                <div className="grid gap-4 flex-1 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="text-xs">Link Başlığı</Label>
                                        <Input
                                            value={link.title}
                                            onChange={(e) => updateLink(index, "title", e.target.value)}
                                            placeholder="Örn: Akademik Takvim"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">URL</Label>
                                        <div className="relative">
                                            <Input
                                                value={link.url}
                                                onChange={(e) => updateLink(index, "url", e.target.value)}
                                                placeholder="https://..."
                                                className="pl-8"
                                                required
                                            />
                                            <LinkIcon size={14} className="absolute left-2.5 top-3 text-slate-400" />
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeLink(index)}
                                    className="text-slate-400 hover:text-red-600 hover:bg-red-50 mt-6"
                                >
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        ))}
                        {links.length === 0 && (
                            <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-lg">
                                Henüz bağlantı eklenmemiş.
                            </div>
                        )}
                        <input type="hidden" name="links" value={JSON.stringify(links)} />
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" size="lg" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                        {isPending ? "Kaydediliyor..." : <><Save size={18} /> Değişiklikleri Kaydet</>}
                    </Button>
                </div>

                {state?.success && (
                    <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center gap-2">
                        <CheckCircle size={20} /> {state.message}
                    </div>
                )}
                {state?.error && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                        {state.error}
                    </div>
                )}
            </div>
        </form>
    );
}
