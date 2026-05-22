"use client";

import { upsertNews, deleteNews } from "@/app/actions/news";
import RichTextEditor from "@/components/ui/RichTextEditor";

import { useActionState, useState, useEffect } from "react";
import { News } from "@prisma/client";
import { Plus, X, Calendar, Type, Image as ImageIcon, FileText, CheckCircle, ListFilter, Search, Edit, Trash2, UploadCloud } from "lucide-react";
import Image from "next/image";

interface NewsClientProps {
    initialNews: News[];
}

export default function NewsClient({ initialNews }: NewsClientProps) {
    const [state, formAction, isPending] = useActionState(upsertNews, { message: "", success: false });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<News | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState<string>("All");
    const [editorContent, setEditorContent] = useState("");

    // Initialize editor content when opening modal
    useEffect(() => {
        if (isModalOpen) {
            setEditorContent(editingItem ? editingItem.content : "");
        }
    }, [isModalOpen, editingItem]);

    // Close modal on success
    useEffect(() => {
        if (state.success && !isPending) {
            setIsModalOpen(false);
            setEditingItem(null);
        }
    }, [state.success, isPending]);

    const filteredNews = initialNews.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === "All" || item.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const handleDelete = async (id: number) => {
        if (confirm("Bu içeriği silmek istediğinize emin misiniz?")) {
            await deleteNews(id);
        }
    };

    const openEditModal = (item: News) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        Haber & Duyuru Yönetimi
                        <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            Admin
                        </span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Web sitesindeki tüm haber, duyuru ve etkinlikleri buradan yönetebilirsiniz.
                    </p>
                </div>
                <button
                    onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all font-medium shadow-lg shadow-blue-500/20 active:scale-95"
                >
                    <Plus size={20} />
                    Yeni İçerik Ekle
                </button>
            </div>

            {/* List & Filters */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="İçeriklerde ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <ListFilter size={18} className="text-slate-500" />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 border-none cursor-pointer"
                        >
                            <option value="All">Tüm Kategoriler</option>
                            <option value="Haber">Haberler</option>
                            <option value="Duyuru">Duyurular</option>
                            <option value="Etkinlik">Etkinlikler</option>
                        </select>
                    </div>
                </div>

                <div className="flex-1 overflow-x-auto">
                    {filteredNews.length > 0 ? (
                        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 uppercase font-medium text-xs tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Görsel</th>
                                    <th className="px-6 py-4">Başlık</th>
                                    <th className="px-6 py-4">Kategori</th>
                                    <th className="px-6 py-4">Tarih</th>
                                    <th className="px-6 py-4">Durum</th>
                                    <th className="px-6 py-4 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredNews.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-3">
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                {item.image ? (
                                                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-slate-300">
                                                        <ImageIcon size={16} />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 font-medium text-slate-900 dark:text-white max-w-[200px] truncate" title={item.title}>
                                            {item.title}
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.category === 'Haber' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                item.category === 'Duyuru' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                                }`}>
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3">
                                            {new Date(item.date).toLocaleDateString('tr-TR')}
                                        </td>
                                        <td className="px-6 py-3">
                                            {item.published ? (
                                                <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Yayında
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-slate-400 text-xs font-bold">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> Taslak
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(item)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                    title="Düzenle"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Sil"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex flex-col justify-center items-center text-slate-400 p-12">
                            <ListFilter size={48} className="mb-4 text-slate-200 dark:text-slate-800" />
                            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300">Kayıt Bulunamadı</h3>
                            <p className="max-w-md text-center mt-2 text-sm text-slate-500">
                                Aradığınız kriterlere uygun içerik bulunmuyor veya henüz hiç içerik eklenmemiş.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsModalOpen(false)}
                    />

                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-300 flex flex-col">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 flex-shrink-0">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {editingItem ? "İçeriği Düzenle" : "Yeni İçerik Oluştur"}
                                </h2>
                                <p className="text-xs text-slate-500 mt-1">Gerekli alanları doldurarak kaydedin.</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 rounded-full transition-colors border border-slate-100 dark:border-slate-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="overflow-y-auto p-6">
                            <form action={formAction} className="space-y-6">
                                <input type="hidden" name="id" value={editingItem?.id || ""} />
                                {/* Hidden input to preserve existing imageUrl if not changing */}
                                <input type="hidden" name="imageUrl" value={editingItem?.image || ""} />

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                                <Type size={14} className="text-[var(--primary)]" />
                                                Başlık
                                            </label>
                                            <input
                                                type="text"
                                                name="title"
                                                defaultValue={editingItem?.title}
                                                placeholder="Örn: 2025 Bahar Şenlikleri"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all font-medium"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                                <ListFilter size={14} className="text-[var(--primary)]" />
                                                Kategori
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="category"
                                                    defaultValue={editingItem?.category || "Haber"}
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all appearance-none font-medium cursor-pointer"
                                                >
                                                    <option value="Haber">Haber</option>
                                                    <option value="Duyuru">Duyuru</option>
                                                    <option value="Etkinlik">Etkinlik</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                            <UploadCloud size={14} className="text-[var(--primary)]" />
                                            Görsel Yükle
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-[var(--primary)]/5 rounded-xl border-2 border-dashed border-[var(--primary)]/20 group-hover:border-[var(--primary)]/50 transition-colors pointer-events-none"></div>
                                            <input
                                                type="file"
                                                name="imageFile"
                                                accept="image/*"
                                                className="relative z-10 w-full px-4 py-8 rounded-xl opacity-0 cursor-pointer"
                                            />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-500">
                                                <UploadCloud className="w-8 h-8 mb-2 text-[var(--primary)]" />
                                                <span className="text-sm font-medium">Bilgisayardan dosya seçin</span>
                                                <span className="text-xs text-slate-400 mt-1">veya sürükleyip bırakın</span>
                                            </div>
                                        </div>
                                        {editingItem?.image && (
                                            <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded-lg border border-green-100">
                                                <CheckCircle size={12} />
                                                Mevcut görsel korunacak. Değiştirmek için dosya seçin.
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                            <Calendar size={14} className="text-[var(--primary)]" />
                                            Yayın Tarihi
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            defaultValue={editingItem?.date ? new Date(editingItem.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all font-medium"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                            <FileText size={14} className="text-[var(--primary)]" />
                                            İçerik Detayı
                                        </label>
                                        <RichTextEditor
                                            value={editorContent}
                                            onChange={setEditorContent}
                                        />
                                        <input type="hidden" name="content" value={editorContent} />
                                    </div>

                                    <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                name="published"
                                                defaultChecked={editingItem?.published ?? true}
                                                id="published"
                                                className="peer sr-only"
                                            />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--primary)]"></div>
                                        </div>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Bu içeriği sitede yayınla</span>
                                    </label>
                                </div>

                                <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex-shrink-0">
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="w-full bg-[var(--primary)] text-white py-4 rounded-xl hover:opacity-90 transition-all font-bold text-lg shadow-xl shadow-blue-900/10 flex justify-center items-center gap-2"
                                    >
                                        {isPending ? (
                                            "İşleniyor..."
                                        ) : (
                                            <>
                                                <CheckCircle size={20} />
                                                {editingItem ? "Değişiklikleri Kaydet" : "İçeriği Oluştur"}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
