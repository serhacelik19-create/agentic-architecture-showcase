
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, ArrowLeft, Eye, Code, Layout } from "lucide-react";
import Link from "next/link";
import { savePage } from "@/app/actions/pages";
import { cn } from "@/lib/utils";
import RichTextEditor from "@/components/ui/RichTextEditor";

export default function PageEditorClient({ page }: { page: any }) {
    const [title, setTitle] = useState(page.title);
    const [content, setContent] = useState(page.content);
    const [category, setCategory] = useState(page.category);
    const [isSaving, setIsSaving] = useState(false);
    const [viewMode, setViewMode] = useState<"split" | "edit" | "preview">("split");

    const handleSave = async () => {
        setIsSaving(true);
        const result = await savePage(page.slug, title, content, category);
        setIsSaving(false);
        if (result.success) {
            alert("Sayfa başarıyla kaydedildi.");
        } else {
            alert("Hata: " + result.error);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/admin/pages">
                        <Button variant="outline" size="icon" className="rounded-full">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Sayfa Düzenle</h1>
                        <p className="text-xs text-slate-500">/{page.slug}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* View Switcher */}
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <Button
                            variant={viewMode === "edit" ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("edit")}
                            className="h-8 gap-2"
                        >
                            <Code size={14} /> Kod
                        </Button>
                        <Button
                            variant={viewMode === "split" ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("split")}
                            className="h-8 gap-2"
                        >
                            <Layout size={14} /> Ayrılmış
                        </Button>
                        <Button
                            variant={viewMode === "preview" ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("preview")}
                            className="h-8 gap-2"
                        >
                            <Eye size={14} /> Önizleme
                        </Button>
                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg shadow-indigo-600/20"
                    >
                        <Save className="h-4 w-4" />
                        {isSaving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                    </Button>
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 flex gap-6 min-h-0">
                {/* Left Side: Inputs & Editor */}
                <div className={cn(
                    "flex flex-col gap-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm p-6 overflow-y-auto transition-all",
                    viewMode === "preview" ? "hidden" : "w-1/2",
                    viewMode === "edit" ? "w-full" : ""
                )}>
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title" className="text-xs font-bold uppercase text-slate-400">Sayfa Başlığı</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="font-bold text-lg"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="category" className="text-xs font-bold uppercase text-slate-400">Kategori</Label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 dark:border-slate-800 dark:bg-slate-950"
                            >
                                <option value="KURUMSAL">Kurumsal</option>
                                <option value="IDARI">İdari</option>
                                <option value="BILGI">Bilgi Merkezi</option>
                                <option value="HIZMET">Hizmetler</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-2 min-h-[400px]">
                        <Label htmlFor="content" className="text-xs font-bold uppercase text-slate-400">İçerik</Label>
                        <RichTextEditor
                            value={content}
                            onChange={setContent}
                        />
                    </div>
                </div>

                {/* Right Side: Live Preview */}
                <div className={cn(
                    "border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 overflow-hidden shadow-inner p-0 flex flex-col transition-all",
                    viewMode === "edit" ? "hidden" : "w-1/2",
                    viewMode === "preview" ? "w-full" : ""
                )}>
                    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono ml-2">önizleme modu</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900">
                        {/* Styled Preview - Mimicking the site's layout */}
                        <div className="max-w-4xl mx-auto px-10 py-12 prose dark:prose-invert prose-indigo">
                            <h1 className="text-4xl font-extrabold text-slate-900 mb-8 border-b-4 border-indigo-600 pb-4 inline-block">
                                {title || "Sayfa Başlığı"}
                            </h1>
                            <div
                                className="corporate-content text-slate-700 dark:text-slate-300 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: content || "<p className='italic text-slate-400'>İçerik boş...</p>" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
