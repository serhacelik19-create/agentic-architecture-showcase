"use client"

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { adminApi } from '@/lib/api';
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Toaster, toast } from 'sonner';

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        maintenance_mode: false,
        registration_open: true
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true);
            const data = await adminApi.getSystemSettings();
            console.log("Settings fetched:", data);
            setSettings(data);
            setError(null);
        } catch (e: any) {
            console.error("Settings fetch error", e);
            const errorMessage = e.response?.data?.message || e.message || "Ayarlar yüklenirken bir hata oluştu.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const updateSetting = async (key: string, value: boolean) => {
        // Optimistic update
        const oldSettings = { ...settings };
        setSettings(prev => ({ ...prev, [key]: value }));

        try {
            console.log(`Updating ${key} to ${value}`);
            await adminApi.updateSystemSettings({ [key]: value });
            toast.success("Ayar güncellendi");
        } catch (e: any) {
            console.error("Update failed", e);
            const errorMessage = e.response?.data?.message || e.message || "Güncelleme başarısız oldu";
            toast.error(errorMessage);
            // Revert on fail
            setSettings(oldSettings);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Toaster />
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
                    <h2 className="text-3xl font-bold tracking-tight">Ayarlar</h2>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Hata</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profil Ayarları</CardTitle>
                            <CardDescription>
                                Admin hesap bilgilerinizi güncelleyin.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">İsim Soyisim</label>
                                <Input defaultValue="Serhat Chef" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input defaultValue="admin@chefvision.com" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Kaydet</Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Sistem Konfigürasyonu</CardTitle>
                            <CardDescription>Global uygulama ayarları (Anlık olarak yansır)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {loading ? (
                                <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <label className="text-base font-medium">Bakım Modu</label>
                                            <p className="text-sm text-muted-foreground">
                                                {settings.maintenance_mode ? 'Uygulama şu an KAPALI (Bakımda).' : 'Uygulama yayında ve aktif.'}
                                            </p>
                                        </div>
                                        <Button
                                            variant={settings.maintenance_mode ? "destructive" : "outline"}
                                            onClick={() => updateSetting('maintenance_mode', !settings.maintenance_mode)}
                                        >
                                            {settings.maintenance_mode ? 'Bakım Modunu Kapat' : 'Bakıma Al'}
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <label className="text-base font-medium">Yeni Üye Alımı</label>
                                            <p className="text-sm text-muted-foreground">
                                                {settings.registration_open ? 'Kullanıcılar kayıt olabilir.' : 'Kayıtlar durduruldu.'}
                                            </p>
                                        </div>
                                        <Button
                                            variant={settings.registration_open ? "default" : "secondary"}
                                            onClick={() => updateSetting('registration_open', !settings.registration_open)}
                                        >
                                            {settings.registration_open ? 'Alımı Kapat' : 'Alımı Aç'}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
