"use client";

import { useActionState, useState, useEffect } from "react";
import { upsertPage } from "@/app/actions/pages";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, CheckCircle, Type, Link as LinkIcon, FileText, Layers } from "lucide-react";

// Slugify helper
const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-')   // Replace multiple - with single -
        .replace(/^-+/, '')       // Trim - from start of text
        .replace(/-+$/, '');      // Trim - from end of text
};

export default function CreatePageForm() {
    const [state, formAction, isPending] = useActionState(upsertPage, { success: false, error: "" });
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [editorContent, setEditorContent] = useState("");
    const [manualSlug, setManualSlug] = useState(false);

    // Auto-generate slug from title if not manually edited
    useEffect(() => {
        if (!manualSlug) {
            setSlug(slugify(title));
        }
    }, [title, manualSlug]);

    useEffect(() => {
        if (state?.success && !isPending) {
            // Reset form on success
            setTitle("");
            setSlug("");
            setEditorContent("");
            setManualSlug(false);
        }
    }, [state?.success, isPending]);

    return (
        <Card className="border-2 border-indigo-100 dark:border-indigo-900/30 shadow-xl overflow-hidden bg-white dark:bg-slate-900">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-100">
                    <Plus size={18} className="text-indigo-600" /> Yeni Sayfa Oluştur
                </CardTitle>
                <CardDescription>
                    Yeni bir kurumsal sayfa ekleyin. İçerik ve görselleri aşağıdan düzenleyebilirsiniz.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <form action={formAction} className="space-y-6">
                    <div className="space-y-4">
                        {/* Title & Slug */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                    <Type size={14} className="text-indigo-600" /> Sayfa Başlığı
                                </Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="Örn: Bilgi İşlem Daire Başkanlığı"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="focus:ring-indigo-600 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug" className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                    <LinkIcon size={14} className="text-indigo-600" /> Link (Slug)
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="slug"
                                        name="slug"
                                        placeholder="ornek-sayfa-linki"
                                        required
                                        value={slug}
                                        onChange={(e) => {
                                            setSlug(e.target.value);
                                            setManualSlug(true);
                                        }}
                                        className="focus:ring-indigo-600 font-mono text-sm bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 pl-8"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">/</span>
                                </div>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="category" className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                <Layers size={14} className="text-indigo-600" /> Kategori
                            </Label>
                            <div className="relative">
                                <select
                                    name="category"
                                    id="category"
                                    className="flex h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 dark:border-slate-800 dark:bg-slate-800 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 transition-all cursor-pointer appearance-none"
                                    required
                                >
                                    <option value="KURUMSAL">Kurumsal</option>
                                    <option value="IDARI">İdari</option>
                                    <option value="BILGI">Bilgi Merkezi</option>
                                    <option value="HIZMET">Hizmetler</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                <FileText size={14} className="text-indigo-600" /> Sayfa İçeriği
                            </Label>
                            <RichTextEditor
                                value={editorContent}
                                onChange={setEditorContent}
                            />
                            <input type="hidden" name="content" value={editorContent} />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg shadow-indigo-600/20 py-6 text-base font-medium transition-all active:scale-[0.99]"
                    >
                        {isPending ? (
                            "Kaydediliyor..."
                        ) : (
                            <>
                                <CheckCircle className="h-5 w-5" /> Sayfayı Oluştur
                            </>
                        )}
                    </Button>

                    {state?.error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            {state.error}
                        </div>
                    )}
                    {state?.success && (
                        <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            Sayfa başarıyla oluşturuldu!
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
