"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { Plus, Search, MoreHorizontal, UserPlus, CreditCard, ShieldAlert } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import api from '@/lib/api';
import { cn, getErrorMessage } from "@/lib/utils";
import { toast } from "sonner";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterTier, setFilterTier] = useState("all");
    const [filterLocked, setFilterLocked] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Create User Form State
    const [newUserTier, setNewUserTier] = useState("free");
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserName, setNewUserName] = useState("");
    const [newUserPassword, setNewUserPassword] = useState("");
    const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);

    // Subscription Management State
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isSubDialogOpen, setIsSubDialogOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [searchQuery, filterTier, filterLocked]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/users/search', {
                params: {
                    query: searchQuery || undefined,
                    tier: filterTier === 'all' ? undefined : filterTier
                }
            });
            let data = response.data;
            if (filterLocked) {
                data = data.filter((u: any) => (u.device_change_count || 0) >= 3);
            }
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleResetDeviceLock = async (user: any) => {
        try {
            await api.put(`/admin/users/${user.id}/reset-device-lock`);
            toast.success("Cihaz Kilidi Sıfırlandı", {
                description: `${user.name} artık yeni cihazla giriş yapabilir.`
            });
            fetchUsers();
        } catch (error) {
            toast.error("İşlem Başarısız", {
                description: getErrorMessage(error)
            });
        }
    };

    const handleCreateUser = async () => {
        try {
            await api.post('/admin/users/create', {
                email: newUserEmail,
                name: newUserName,
                password: newUserPassword,
                is_pro: newUserTier !== 'free',
                tier: newUserTier
            });
            setIsAddUserDialogOpen(false);
            fetchUsers();
            setNewUserEmail("");
            setNewUserName("");
            setNewUserPassword("");
            setNewUserTier("free");
        } catch (error: any) {
            toast.error("Kullanıcı oluşturulamadı", {
                description: getErrorMessage(error)
            });
        }
    };

    const handleUpdateSubscription = async (tier: string, days: number) => {
        if (!selectedUser) return;
        try {
            await api.put(`/admin/users/${selectedUser.id}/subscription`, {
                is_pro: tier !== 'free',
                tier: tier,
                duration_days: days
            });
            setIsSubDialogOpen(false);
            fetchUsers();
            toast.success("Abonelik Güncellendi", {
                description: `${selectedUser.name} artık ${tier.toUpperCase()} planında.`
            });
        } catch (error) {
            toast.error("İşlem Başarısız", {
                description: getErrorMessage(error)
            });
        }
    };

    return (
        <div className="flex-1 space-y-10 p-10 pt-8 min-h-screen bg-slate-50/50 dark:bg-[#0f172a]">
            {/* Üst Header Bölümü */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Kullanıcı Yönetimi
                    </h2>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Platformdaki tüm kullanıcıları ve üyelik yetkilerini buradan yönetin.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 transition-all active:scale-95">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Yeni Kullanıcı
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl overflow-hidden">
                            <DialogHeader className="p-2">
                                <DialogTitle className="text-xl font-extrabold">Yeni Kullanıcı Ekle</DialogTitle>
                                <DialogDescription className="font-medium text-slate-500">
                                    Manuel olarak yeni bir kullanıcı hesabı oluşturun.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-5 py-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Tam İsim</label>
                                    <Input value={newUserName} onChange={e => setNewUserName(e.target.value)} placeholder="Ahmet Yılmaz" className="rounded-xl border-slate-200 focus:ring-indigo-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">E-posta Adresi</label>
                                    <Input value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} placeholder="ahmet@example.com" className="rounded-xl border-slate-200 focus:ring-indigo-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Geçici Şifre</label>
                                    <Input type="password" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} className="rounded-xl border-slate-200 focus:ring-indigo-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Abonelik Katmanı</label>
                                    <select
                                        value={newUserTier}
                                        onChange={e => setNewUserTier(e.target.value)}
                                        className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-sm"
                                    >
                                        <option value="free">Free (Ücretsiz)</option>
                                        <option value="plus">Plus (Ekonomik)</option>
                                        <option value="pro">Pro (Standart)</option>
                                        <option value="premium">Premium (Ultra)</option>
                                    </select>
                                </div>
                            </div>
                            <DialogFooter className="p-2 gap-3">
                                <Button variant="ghost" onClick={() => setIsAddUserDialogOpen(false)} className="rounded-xl font-bold text-slate-500">İptal</Button>
                                <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold" onClick={handleCreateUser}>Kullanıcıyı Oluştur</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Arama Barı */}
            <div className="flex flex-col md:flex-row items-center gap-4 relative">
                <div className="relative w-full max-w-md group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <Input
                        placeholder="İsim veya email ile ara..."
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        className="pl-12 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-indigo-500 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto max-w-full">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setFilterTier("all"); setFilterLocked(false); }}
                        className={cn("h-9 px-4 rounded-xl text-xs font-bold transition-all", filterTier === "all" && !filterLocked ? "bg-slate-100 dark:bg-slate-800 shadow-inner text-indigo-600" : "text-slate-500 hover:text-indigo-600")}
                    >Tümü</Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setFilterTier("pro"); setFilterLocked(false); }}
                        className={cn("h-9 px-4 rounded-xl text-xs font-bold transition-all", filterTier === "pro" ? "bg-orange-50 dark:bg-orange-900/20 shadow-inner text-orange-600" : "text-slate-500 hover:text-orange-600")}
                    >Pro</Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setFilterTier("plus"); setFilterLocked(false); }}
                        className={cn("h-9 px-4 rounded-xl text-xs font-bold transition-all", filterTier === "plus" ? "bg-emerald-50 dark:bg-emerald-900/20 shadow-inner text-emerald-600" : "text-slate-500 hover:text-emerald-600")}
                    >Plus</Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setFilterTier("premium"); setFilterLocked(false); }}
                        className={cn("h-9 px-4 rounded-xl text-xs font-bold transition-all", filterTier === "premium" ? "bg-indigo-50 dark:bg-indigo-900/20 shadow-inner text-indigo-600" : "text-slate-500 hover:text-indigo-600")}
                    >Premium</Button>
                    <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFilterLocked(!filterLocked)}
                        className={cn("h-9 px-4 rounded-xl text-xs font-bold transition-all", filterLocked ? "bg-rose-50 dark:bg-rose-900/20 shadow-inner text-rose-600" : "text-slate-500 hover:text-rose-600")}
                    >
                        <ShieldAlert className="mr-2 h-3 w-3" />
                        Kilitli
                    </Button>
                </div>
            </div>

            {/* Kullanıcı Tablosu Kartı */}
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none dark:bg-slate-900/50 rounded-3xl overflow-hidden">
                <CardHeader className="bg-white/50 dark:bg-transparent border-b border-slate-100 dark:border-slate-800 p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-extrabold text-slate-900 dark:text-white">Kullanıcı Listesi</CardTitle>
                            <CardDescription className="font-medium text-slate-500 dark:text-slate-400 mt-1">Platformdaki tüm aktif ve inaktif kullanıcılar.</CardDescription>
                        </div>
                        <div className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold rounded-full border border-indigo-100 dark:border-indigo-500/20">
                            Filtreye Göre: {users.length}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                            <TableRow className="border-slate-100 dark:border-slate-800 hover:bg-transparent">
                                <TableHead className="px-8 py-5 font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[11px]">Kullanıcı Bilgisi</TableHead>
                                <TableHead className="px-8 py-5 font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[11px]">Üyelik Katmanı</TableHead>
                                <TableHead className="px-8 py-5 font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[11px]">Cihaz Durumu</TableHead>
                                <TableHead className="px-8 py-5 font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[11px]">Kayıt Tarihi</TableHead>
                                <TableHead className="px-8 py-5 text-right font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[11px]">Aksiyon</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="h-10 w-10 border-[3px] border-indigo-100 border-t-indigo-600 animate-spin rounded-full shadow-lg shadow-indigo-200/50" />
                                            <p className="text-sm font-bold text-slate-500 italic">Veriler senkronize ediliyor...</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2 opacity-40">
                                            <Search className="h-12 w-12 text-slate-300" />
                                            <p className="text-sm font-bold text-slate-400">Kullanıcı bulunamadı.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user.id} className="group border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-300">
                                        <TableCell className="px-8 py-5 text-slate-900 dark:text-white">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center font-extrabold text-indigo-600 dark:text-indigo-400 shadow-sm group-hover:scale-105 transition-transform">
                                                    {user.name?.substring(0, 2).toUpperCase() || 'CV'}
                                                </div>
                                                <div className="flex flex-col space-y-0.5 min-w-0">
                                                    <span className="font-extrabold text-[15px] truncate">{user.name}</span>
                                                    <span className="text-xs font-medium text-slate-500 truncate">{user.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 py-5">
                                            <span className={cn(
                                                "inline-flex items-center px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest",
                                                user.subscription_tier === 'premium' ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50" :
                                                    user.subscription_tier === 'pro' ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border border-orange-200/50" :
                                                        user.subscription_tier === 'plus' ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50" :
                                                            "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/50"
                                            )}>
                                                <div className={cn("mr-2 h-1.5 w-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]",
                                                    user.subscription_tier === 'premium' ? "bg-indigo-600" :
                                                        user.subscription_tier === 'pro' ? "bg-orange-500" :
                                                            user.subscription_tier === 'plus' ? "bg-emerald-500" : "bg-slate-400"
                                                )} />
                                                {user.subscription_tier || 'FREE'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-8 py-5">
                                            {user.device_change_count >= 3 ? (
                                                <div className="flex flex-col gap-1">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[10px] font-bold border border-rose-200/50 w-fit">
                                                        <ShieldAlert className="mr-1 h-3 w-3" />
                                                        HESAP KİLİTLİ
                                                    </span>
                                                    <span className="text-[10px] font-medium text-slate-400">Değişim: {user.device_change_count}/3</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-1">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold border border-slate-200/50 w-fit">
                                                        NORMAL
                                                    </span>
                                                    <span className="text-[10px] font-medium text-slate-400">Değişim: {user.device_change_count || 0}/3</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-8 py-5 text-sm font-bold text-slate-500 dark:text-slate-400">
                                            {new Date(user.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </TableCell>
                                        <TableCell className="px-8 py-5 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-indigo-600 transition-all">
                                                        <MoreHorizontal className="h-5 w-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-none shadow-2xl overflow-hidden">
                                                    <DropdownMenuLabel className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-400">İşlemler</DropdownMenuLabel>
                                                    <DropdownMenuItem className="cursor-pointer rounded-xl font-bold py-2.5 focus:bg-indigo-50 focus:text-indigo-600" onClick={() => navigator.clipboard.writeText(user.email)}>
                                                        Email Kopyala
                                                    </DropdownMenuItem>
                                                    {user.device_change_count >= 3 && (
                                                        <DropdownMenuItem
                                                            className="cursor-pointer rounded-xl font-bold py-2.5 text-rose-600 focus:bg-rose-50 focus:text-rose-600"
                                                            onClick={() => handleResetDeviceLock(user)}
                                                        >
                                                            Cihaz Kilidini Aç
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuSeparator className="my-1 bg-slate-100" />
                                                    <DropdownMenuItem className="cursor-pointer rounded-xl font-bold py-2.5 bg-indigo-600 text-white focus:bg-indigo-700 focus:text-white" onClick={() => {
                                                        setSelectedUser(user);
                                                        setIsSubDialogOpen(true);
                                                    }}>
                                                        Aboneliği Yönet
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* SUBSCRIPTION MANAGE DIALOG - PORTAL STYLED */}
            <Dialog open={isSubDialogOpen} onOpenChange={setIsSubDialogOpen}>
                <DialogContent className="sm:max-w-[420px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 text-white relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <CreditCard className="h-24 w-24" />
                        </div>
                        <DialogTitle className="text-2xl font-extrabold mb-1">Abonelik Yönetimi</DialogTitle>
                        <p className="text-indigo-100 font-bold opacity-80">{selectedUser?.name}</p>
                        <p className="text-indigo-200 text-xs font-bold mt-4 uppercase tracking-widest">Seviye Güncelleme</p>
                    </div>
                    <div className="p-8 space-y-4">
                        <Button className="w-full h-14 bg-emerald-50 content-between justify-between rounded-2xl border border-emerald-100 hover:bg-emerald-100 transition-all group" onClick={() => handleUpdateSubscription('plus', 30)}>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                                    <CreditCard className="h-4 w-4" />
                                </div>
                                <span className="font-extrabold text-emerald-800">1 Ay PLUS Hediye</span>
                            </div>
                            <Plus className="h-4 w-4 text-emerald-400 group-hover:scale-125 transition-transform" />
                        </Button>
                        <Button className="w-full h-14 bg-orange-50 content-between justify-between rounded-2xl border border-orange-100 hover:bg-orange-100 transition-all group" onClick={() => handleUpdateSubscription('pro', 30)}>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-200">
                                    <CreditCard className="h-4 w-4" />
                                </div>
                                <span className="font-extrabold text-orange-800">1 Ay PRO Hediye</span>
                            </div>
                            <Plus className="h-4 w-4 text-orange-400 group-hover:scale-125 transition-transform" />
                        </Button>
                        <Button className="w-full h-14 bg-indigo-50 content-between justify-between rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition-all group" onClick={() => handleUpdateSubscription('premium', 30)}>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                    <CreditCard className="h-4 w-4" />
                                </div>
                                <span className="font-extrabold text-indigo-800">1 Ay PREMIUM Hediye</span>
                            </div>
                            <Plus className="h-4 w-4 text-indigo-400 group-hover:scale-125 transition-transform" />
                        </Button>
                        <div className="py-2 flex items-center gap-4">
                            <span className="h-[1px] flex-1 bg-slate-100" />
                            <span className="text-[10px] uppercase font-bold text-slate-300 tracking-[3px]">Tehlikeli Bölge</span>
                            <span className="h-[1px] flex-1 bg-slate-100" />
                        </div>
                        <Button variant="ghost" className="w-full h-14 rounded-2xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-extrabold border border-rose-50" onClick={() => handleUpdateSubscription('free', 0)}>
                            <ShieldAlert className="mr-3 h-5 w-5" />
                            Aboneliği İptal Et
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
