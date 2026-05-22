"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { Overview } from "@/components/overview";

export default function AnalyticsPage() {
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
                    <h2 className="text-3xl font-bold tracking-tight">Gelişmiş Analitik</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Gelir Tahmini (Forecast)</CardTitle>
                            <CardDescription>
                                Yapay zeka tabanlı gelecek 12 ay tahmini
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <Overview /> {/* Reusing Overview chart for demo */}
                        </CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Sistem Sağlığı</CardTitle>
                            <CardDescription>Canlı monitör</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span>API Latency</span>
                                        <span className="font-bold text-green-500">45ms</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-secondary">
                                        <div className="h-full w-[20%] rounded-full bg-green-500" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span>Error Rate</span>
                                        <span className="font-bold text-green-500">0.01%</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-secondary">
                                        <div className="h-full w-[1%] rounded-full bg-green-500" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span>AI Token Usage</span>
                                        <span className="font-bold text-yellow-500">85%</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-secondary">
                                        <div className="h-full w-[85%] rounded-full bg-yellow-500" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
