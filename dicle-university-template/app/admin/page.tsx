import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, Newspaper, Utensils, ArrowUpRight, Users, Activity } from "lucide-react";

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Genel Bakış</h1>
                    <p className="text-sm text-slate-500 mt-1">Sistem durumunu ve son aktiviteleri buradan takip edebilirsiniz.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Sistem Aktif
                    </span>
                    <span className="text-xs text-slate-400">v1.2.0</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Toplam Haber"
                    value="128"
                    change="+12%"
                    icon={<Newspaper className="h-4 w-4 text-slate-500" />}
                />
                <StatCard
                    title="Etkinlikler"
                    value="24"
                    change="+3"
                    icon={<Calendar className="h-4 w-4 text-slate-500" />}
                />
                <StatCard
                    title="Aktif Sayfalar"
                    value="12"
                    change="0"
                    icon={<FileText className="h-4 w-4 text-slate-500" />}
                />
                <StatCard
                    title="Günlük Menü"
                    value="Yayında"
                    change="2 dk önce"
                    icon={<Utensils className="h-4 w-4 text-green-500" />}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Main Activity Area */}
                <Card className="col-span-4 rounded-sm border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Son İşlemler</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                                            <Activity className="h-4 w-4 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">Yeni haber eklendi</p>
                                            <p className="text-xs text-slate-500">Basın Yayın Birimi</p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-400">12:3{i}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions / System Status */}
                <Card className="col-span-3 rounded-sm border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Hızlı Erişim</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2">
                            <QuickActionButton label="Yeni Duyuru Oluştur" />
                            <QuickActionButton label="Yemek Listesini Güncelle" />
                            <QuickActionButton label="Personel Ekle" />
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <h4 className="text-sm font-semibold mb-3">Sistem Kaynakları</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">Depolama</span>
                                    <span className="font-medium text-slate-900">45%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-600 w-[45%]"></div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ title, value, change, icon }: { title: string, value: string, change: string, icon: React.ReactNode }) {
    return (
        <Card className="rounded-sm border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-900">{value}</div>
                <p className="text-xs text-slate-500 flex items-center mt-1">
                    {change.startsWith('+') ? <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" /> : null}
                    <span className={change.startsWith('+') ? "text-green-600" : "text-slate-500"}>{change}</span>
                    <span className="ml-1 text-slate-400">geçen aya göre</span>
                </p>
            </CardContent>
        </Card>
    );
}

function QuickActionButton({ label }: { label: string }) {
    return (
        <button className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-sm transition-colors">
            {label}
        </button>
    )
}
