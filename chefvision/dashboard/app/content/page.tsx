"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { TasteRadar } from "@/components/content/taste-radar";
import api from '@/lib/api';
import { AlertTriangle, TrendingUp, Utensils } from "lucide-react";

export default function ContentPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats/content');
                setStats(res.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <div className="border-b">
                <div className="flex h-16 items-center px-4">
                    <h2 className="text-xl font-bold tracking-tight mr-6">ChefVision Admin</h2>
                    <MainNav className="mx-6" />
                    <div className="ml-auto flex items-center space-x-4">
                        <UserNav />
                    </div>
                </div>
            </div>
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">İçerik Zekası</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Popüler Lezzet Profili</CardTitle>
                            <CardDescription>
                                Kullanıcıların en çok tercih ettiği tat profilleri.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <TasteRadar />
                        </CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>En Popüler 5 Tarif</CardTitle>
                            <CardDescription>Bu ay en çok favorilenenler</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats?.popular_recipes?.map((recipe: any, i: number) => (
                                    <div key={i} className="flex items-center">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted">
                                            <Utensils className="h-4 w-4" />
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">{recipe.title}</p>
                                            <p className="text-sm text-muted-foreground">Kategori: Ana Yemek</p>
                                        </div>
                                        <div className="ml-auto font-medium">❤️ {recipe.favorites}</div>
                                    </div>
                                ))}
                                {!stats && loading && <p>Yükleniyor...</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Yükselen Malzemeler (Trend)</CardTitle>
                            <CardDescription>Son 30 günde pantry'lere en çok eklenenler</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats?.top_ingredients?.map((item: any, i: number) => (
                                    <div key={i} className="flex items-center">
                                        <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
                                        <span className="text-sm font-medium">{item.name}</span>
                                        <span className="ml-auto text-sm text-muted-foreground">{item.count} kullanıcıda var</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-red-500 flex items-center">
                                <AlertTriangle className="mr-2 h-5 w-5" />
                                Atık Riski Raporu
                            </CardTitle>
                            <CardDescription>Önümüzdeki 3 gün içinde bozulacak malzemeler</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats?.waste_risk_items?.map((item: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                        <span className="text-sm font-medium">{item.name}</span>
                                        <span className="text-sm font-bold text-red-600">{item.count} adet riskli</span>
                                    </div>
                                ))}
                                {(!stats?.waste_risk_items || stats.waste_risk_items.length === 0) && !loading && <p className="text-sm text-muted-foreground">Riskli ürün bulunamadı.</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
