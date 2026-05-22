
import { getAcademicUnits, saveAcademicUnit, deleteAcademicUnit } from "@/app/actions/academic";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Save, ChevronDown, Phone, MapPin, Plus } from "lucide-react";
import AcademicAdminList from "./AcademicAdminList";

export default async function AcademicAdminPage({ searchParams }: { searchParams: Promise<{ editId?: string }> }) {
    const { data: allUnits } = await getAcademicUnits();
    const { editId } = await searchParams;

    // Fetch the unit to edit if editId is provided
    const editingUnit = editId ? allUnits?.find((u: any) => u.id === parseInt(editId)) : null;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Akademik Birim Yönetimi</h1>
                    <p className="text-sm text-slate-500 mt-1">Birimleri gruplandırılmış şekilde yönetebilir ve düzenleyebilirsiniz.</p>
                </div>
                {editId && (
                    <Button variant="outline" size="sm" asChild className="rounded-full shadow-sm">
                        <a href="/admin/academic" className="flex items-center gap-2">
                            <Plus size={14} /> Yeni Ekle
                        </a>
                    </Button>
                )}
            </div>

            <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-2">

                {/* Visual Editor (Create/Edit) */}
                <div className="lg:col-span-1">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                        {editingUnit ? `Düzenle: ${editingUnit.name}` : 'Yeni Birim Kartı Oluştur'}
                    </h3>

                    <form action={async (formData) => {
                        "use server";
                        await saveAcademicUnit(formData);
                    }}>
                        {editingUnit && <input type="hidden" name="id" value={editingUnit.id} />}

                        {/* Editor Card */}
                        <div className="group bg-white dark:bg-slate-900 rounded-xl border-2 border-indigo-200 dark:border-indigo-900/30 shadow-2xl overflow-hidden relative">
                            {/* Indicator for Editing */}
                            {editingUnit && (
                                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 z-30"></div>
                            )}

                            {/* Top Section */}
                            <div className="p-6 pb-2">
                                <div className="flex gap-4">
                                    {/* Icon Area */}
                                    <div className="shrink-0 h-14 w-14 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                                        <GraduationCap className="h-7 w-7" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        {/* Title Input */}
                                        <input
                                            name="name"
                                            placeholder="Birim Adı (Örn: Tıp Fakültesi)"
                                            required
                                            defaultValue={editingUnit?.name || ""}
                                            className="w-full text-xl font-bold text-slate-900 dark:text-white placeholder:text-slate-300 bg-transparent border-none p-0 focus:ring-0 focus:outline-none mb-1"
                                        />

                                        {/* Dean / Leader Input */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                                                Dekan/Müdür
                                            </span>
                                            <input
                                                name="leader"
                                                placeholder="Prof. Dr. Ad Soyad"
                                                defaultValue={editingUnit?.leader || ""}
                                                className="text-sm font-medium text-slate-600 dark:text-slate-400 bg-transparent border-none p-0 focus:ring-0 focus:outline-none placeholder:text-slate-300 w-full"
                                            />
                                        </div>

                                        {/* Description Input (Textarea) */}
                                        <textarea
                                            name="description"
                                            placeholder="Birim hakkında kısa açıklama yazınız..."
                                            defaultValue={editingUnit?.description || ""}
                                            className="w-full text-sm text-slate-500 line-clamp-3 bg-transparent border-none p-0 focus:ring-0 focus:outline-none placeholder:text-slate-300 resize-none"
                                            rows={3}
                                        />
                                    </div>

                                    <ChevronDown className="shrink-0 h-5 w-5 text-slate-300" />
                                </div>
                            </div>

                            {/* Departments Section */}
                            <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-b border-slate-100 dark:border-slate-800">
                                <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-indigo-500" /> Bölümler
                                </h4>
                                <input
                                    name="departments"
                                    placeholder="Virgülle ayırarak yazın (Örn: Cerrahi, Dahiliye, Temel Tıp)"
                                    defaultValue={editingUnit?.departments || ""}
                                    className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-600 dark:text-slate-300 focus:border-indigo-500 focus:outline-none shadow-sm"
                                />
                            </div>

                            {/* Contact Info Grid */}
                            <div className="grid grid-cols-2 gap-6 p-6 bg-white dark:bg-slate-900">
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-green-500" /> İletişim
                                    </h4>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Telefon</span>
                                            <input name="phone" defaultValue={editingUnit?.phone || ""} placeholder="0 (412) ..." className="text-sm text-slate-600 bg-transparent border-none p-0 focus:ring-0 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">E-Posta</span>
                                            <input name="email" defaultValue={editingUnit?.email || ""} placeholder="ornek@dicle.edu.tr" className="text-sm text-slate-600 bg-transparent border-none p-0 focus:ring-0 focus:outline-none" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-red-500" /> Adres ve Web
                                    </h4>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Konum</span>
                                            <textarea name="address" defaultValue={editingUnit?.address || ""} placeholder="Kampüs, Sur / Diyarbakır" rows={2} className="text-sm text-slate-600 bg-transparent border-none p-0 focus:ring-0 focus:outline-none resize-none" />
                                        </div>

                                        <div className="pt-2">
                                            <input name="website" defaultValue={editingUnit?.website || ""} placeholder="https://..." className="text-sm font-semibold text-indigo-600 placeholder:text-indigo-300 bg-transparent border-none p-0 focus:ring-0 focus:outline-none w-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Fields */}
                            <div className="bg-slate-50 border-t border-slate-200 p-3 flex gap-2 items-center justify-between">
                                <div className="flex gap-2 w-full">
                                    <select
                                        name="type"
                                        defaultValue={editingUnit?.type || "FACULTY"}
                                        className="text-xs font-semibold px-2 py-1 bg-white border border-slate-200 rounded text-slate-600 focus:outline-none focus:border-indigo-500"
                                        required
                                    >
                                        <option value="FACULTY">TİP: FAKÜLTE</option>
                                        <option value="INSTITUTE">TİP: ENSTİTÜ</option>
                                        <option value="SCHOOL">TİP: YÜKSEKOKUL</option>
                                        <option value="VOCATIONAL">TİP: MYO</option>
                                        <option value="CENTER">TİP: MERKEZ</option>
                                        <option value="DEPARTMENT">TİP: BİRİM</option>
                                    </select>
                                    <input
                                        name="slug"
                                        placeholder="url-slug"
                                        defaultValue={editingUnit?.slug || ""}
                                        required
                                        className="text-xs bg-white border border-slate-200 px-2 rounded focus:outline-none focus:border-indigo-500 flex-1"
                                    />
                                </div>
                                <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                                    <Save className="w-4 h-4 mr-1" /> {editingUnit ? 'Güncelle' : 'Kaydet'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Grouped Cards List (Accordion) */}
                <div className="lg:col-span-1 border-l border-slate-100 pl-8">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 flex justify-between items-center">
                        <span>Birim Listesi</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-normal italic">Kategoriye tıklayarak açın</span>
                            <span className="text-xs font-normal bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{allUnits?.length || 0} Birim</span>
                        </div>
                    </h3>

                    <AcademicAdminList allUnits={allUnits || []} />
                </div>
            </div>
        </div>
    );
}
