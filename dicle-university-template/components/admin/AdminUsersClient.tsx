
"use client";

import { useState } from "react";
import { createAdminUser, deleteAdminUser } from "@/app/actions/admin-users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Plus, Trash2, UserCog, ShieldAlert } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

type AdminUser = {
    id: string;
    username: string;
    name: string | null;
    role: "USER" | "ADMIN";
    createdAt: Date;
};

export default function AdminUsersClient({ initialUsers }: { initialUsers: AdminUser[] }) {
    const [users, setUsers] = useState<AdminUser[]>(initialUsers);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleAddUser(formData: FormData) {
        setLoading(true);
        const result = await createAdminUser(formData);
        setLoading(false);

        if (result.success) {
            setIsAddOpen(false);
            // In a real app we'd re-fetch or use router.refresh(). 
            // For now, let's just reload the page to be simple and safe with Next.js Server Actions cache.
            window.location.reload();
        } else {
            alert(result.error);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;

        const result = await deleteAdminUser(id);
        if (result.success) {
            window.location.reload();
        } else {
            alert(result.error);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Kullanıcı Yönetimi</h2>
                    <p className="text-slate-500">Panele erişim yetkisi olan yöneticileri buradan yönetebilirsiniz.</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Yeni Yönetici Ekle
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Yeni Yönetici Ekle</DialogTitle>
                            <DialogDescription>
                                Bu kullanıcı panele tam erişim yetkisine sahip olacaktır.
                            </DialogDescription>
                        </DialogHeader>
                        <form action={handleAddUser} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Kullanıcı Adı</Label>
                                <Input id="username" name="username" required autoComplete="off" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Ad Soyad (Opsiyonel)</Label>
                                <Input id="name" name="name" autoComplete="off" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Şifre</Label>
                                <Input id="password" name="password" type="password" required minLength={6} />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Ekleniyor..." : "Kaydet"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-lg bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Kullanıcı Adı</TableHead>
                            <TableHead>Ad Soyad</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead>Kayıt Tarihi</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="bg-blue-100 dark:bg-blue-900/30 w-8 h-8 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-400">
                                        <UserCog size={16} />
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{user.username}</TableCell>
                                <TableCell>{user.name || "-"}</TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                        {user.role}
                                    </span>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {format(new Date(user.createdAt), "d MMMM yyyy", { locale: tr })}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {users.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    Hiç kullanıcı bulunamadı.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
