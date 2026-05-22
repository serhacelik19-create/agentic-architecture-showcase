"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, CreditCard, DollarSign, Users, UserPlus, TrendingDown, Download, Loader2, ChefHat, Plus } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Overview } from "@/components/overview";
import { RecentSales } from "@/components/recent-sales";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
    const [financials, setFinancials] = useState<any>(null);
    const [userStats, setUserStats] = useState<any>(null);
    const [contentStats, setContentStats] = useState<any>(null);
    const [recentUsers, setRecentUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const results = await Promise.allSettled([
                    adminApi.getFinancials(),
                    adminApi.getUserStats(),
                    adminApi.searchUsers(''),
                    adminApi.getContentStats()
                ]);

                if (results[0].status === 'fulfilled') {
                    setFinancials(results[0].value);
                }

                if (results[1].status === 'fulfilled') {
                    setUserStats(results[1].value);
                }

                if (results[2].status === 'fulfilled') {
                    setRecentUsers(results[2].value.slice(0, 5));
                }

                if (results[3].status === 'fulfilled') {
                    setContentStats(results[3].value);
                }
            } catch (error) {
                console.error("General data fetching error:", error);
                toast.error("Veriler yüklenirken bir hata oluştu.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
    };

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('tr-TR').format(value);
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">Veriler yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-10 p-10 pt-8 min-h-screen bg-slate-50/50 dark:bg-[#0f172a]">
            {/* Üst Header Bölümü */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Genel Bakış
                    </h2>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Platform performansınızı ve kullanıcı etkileşimlerini takip edin.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm font-bold text-slate-600 dark:text-slate-300">
                        <Download className="mr-2 h-4 w-4" /> Rapor İndir
                    </Button>
                    <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 transition-all active:scale-95">
                        <Plus className="mr-2 h-4 w-4" /> Yeni Kampanya
                    </Button>
                </div>
            </div>

            {/* İstatistik Kartları Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Toplam Gelir (MRR)", value: formatCurrency(financials?.mrr || 0), icon: DollarSign, trend: "+12.5%", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                    { title: "Aktif Aboneler", value: formatNumber(userStats?.active_subscriptions || 0), icon: Users, trend: "+4.2%", color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
                    { title: "Yeni Kullanıcılar", value: formatNumber(userStats?.new_users_count || 0), icon: UserPlus, trend: "-2.1%", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
                    { title: "Kayıp Riski (Churn)", value: `%${userStats?.churn_risk || 0}`, icon: TrendingDown, trend: "-5.0%", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10" }
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none dark:bg-slate-900/50 rounded-2xl overflow-hidden group transition-all duration-300 hover:translate-y-[-2px]">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn("p-2.5 rounded-xl transition-colors", stat.bg)}>
                                    <stat.icon className={cn("h-5 w-5", stat.color)} />
                                </div>
                                <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-full",
                                    stat.trend.startsWith('+') ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600" : "bg-rose-100 dark:bg-rose-500/20 text-rose-600"
                                )}>
                                    {stat.trend}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 capitalize tracking-tight">
                                    {stat.title}
                                </p>
                                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                                    {stat.value}
                                </h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Orta Bölüm: Grafikler ve Dağılım */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
                {/* Aktivite Grafiği (Geniş) */}
                <Card className="lg:col-span-4 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none dark:bg-slate-900/50 rounded-3xl overflow-hidden">
                    <CardHeader className="pb-2 p-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-extrabold text-slate-900 dark:text-white">Aktivite Analizi</CardTitle>
                                <CardDescription className="font-medium text-slate-500 dark:text-slate-400 mt-1">Haftalık kullanıcı etkileşim grafiği</CardDescription>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                                <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs font-bold bg-white dark:bg-slate-700 shadow-sm">Haftalık</Button>
                                <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs font-bold text-slate-500">Aylık</Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-4 pl-4">
                        <div className="h-[350px] w-full">
                            <Overview chartData={userStats?.activity_data || []} />
                        </div>
                    </CardContent>
                </Card>

                {/* Abonelik Dağılımı (Dar) */}
                <Card className="lg:col-span-3 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none dark:bg-slate-900/50 rounded-3xl overflow-hidden">
                    <CardHeader className="pb-2 p-8">
                        <CardTitle className="text-xl font-extrabold text-slate-900 dark:text-white">Plan Dağılımı</CardTitle>
                        <CardDescription className="font-medium text-slate-500 dark:text-slate-400 mt-1">Üyelik tiplerine göre kullanıcı oranları</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-2">
                        <div className="h-[300px] w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={userStats?.tier_distribution || []}
                                        innerRadius={85}
                                        outerRadius={110}
                                        paddingAngle={4}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {(userStats?.tier_distribution || []).map((entry: any, index: number) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                                style={{ filter: `drop-shadow(0 0 8px ${entry.color}40)` }}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            {(userStats?.tier_distribution || []).map((tier: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-colors hover:bg-white dark:hover:bg-slate-800 shadow-sm hover:shadow-md">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tier.color }} />
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{tier.name}</span>
                                        <span className="text-[14px] font-extrabold text-slate-900 dark:text-white">{formatNumber(tier.value)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Alt Bölüm: Listeler ve Tablolar */}
            <div className="grid gap-8 lg:grid-cols-12">
                {/* Son İşlemler (Daha Geniş) */}
                <Card className="lg:col-span-8 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none dark:bg-slate-900/50 rounded-3xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
                        <div>
                            <CardTitle className="text-xl font-extrabold text-slate-900 dark:text-white">Son İşlemler</CardTitle>
                            <CardDescription className="font-medium text-slate-500 dark:text-slate-400 mt-1">Gerçek zamanlı platform hareketleri</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-xl border-slate-200 dark:border-slate-800 h-9 px-4 font-bold text-xs">
                            Raporu Gör
                        </Button>
                    </CardHeader>
                    <CardContent className="p-8 pt-4">
                        <RecentSales data={recentUsers} />
                    </CardContent>
                </Card>

                {/* Popüler Tarifler (Sağ Taraf) */}
                <Card className="lg:col-span-4 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none dark:bg-slate-900/50 rounded-3xl overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-xl font-extrabold text-slate-900 dark:text-white">Trend Tarifler</CardTitle>
                        <CardDescription className="font-medium text-slate-500 dark:text-slate-400 mt-1">En çok etkileşim alan içerikler</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-4">
                        <div className="space-y-4">
                            {(contentStats?.popular_recipes || []).map((recipe: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all group overflow-hidden relative">
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            #{idx + 1}
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-extrabold text-slate-900 dark:text-zinc-100 line-clamp-1">{recipe.title}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                                                    <Activity className="h-3 w-3 mr-1 text-emerald-500" /> Popüler
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end relative z-10">
                                        <div className="flex items-center text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                                            <span>{recipe.favorites}</span>
                                            <Activity className="ml-1 h-3.5 w-3.5" />
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Favori</p>
                                    </div>
                                </div>
                            ))}
                            {(!contentStats?.popular_recipes || contentStats.popular_recipes.length === 0) && (
                                <div className="text-center py-10 space-y-3">
                                    <div className="inline-flex p-3 rounded-full bg-slate-100 dark:bg-slate-800">
                                        <ChefHat className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-500">Henüz trend veri bulunmuyor.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
