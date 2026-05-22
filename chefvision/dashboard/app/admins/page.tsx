"use client"

import { useEffect, useState } from "react"
import { adminApi } from "@/lib/api"
import { getErrorMessage } from "@/lib/utils"
import { toast } from "sonner"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck, Plus, Pencil, Trash2, Loader2, Eye, EyeOff } from "lucide-react"

interface Admin {
    id: number
    email: string
    name: string
    is_admin: boolean
    is_active: boolean
    created_at: string | null
}

export default function AdminsPage() {
    const [admins, setAdmins] = useState<Admin[]>([])
    const [loading, setLoading] = useState(true)

    // Create dialog
    const [createOpen, setCreateOpen] = useState(false)
    const [createForm, setCreateForm] = useState({ email: "", password: "", name: "" })
    const [creating, setCreating] = useState(false)

    // Edit dialog
    const [editOpen, setEditOpen] = useState(false)
    const [editForm, setEditForm] = useState<{ id: number; email: string; name: string; password: string }>({ id: 0, email: "", name: "", password: "" })
    const [editing, setEditing] = useState(false)

    // Delete dialog
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<Admin | null>(null)
    const [deleting, setDeleting] = useState(false)

    // Password visibility
    const [showCreatePw, setShowCreatePw] = useState(false)
    const [showEditPw, setShowEditPw] = useState(false)

    const fetchAdmins = async () => {
        try {
            setLoading(true)
            const data = await adminApi.getAdmins()
            setAdmins(data)
        } catch (err: any) {
            toast.error(getErrorMessage(err))
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAdmins()
    }, [])

    const handleCreate = async () => {
        if (!createForm.email || !createForm.password || !createForm.name) {
            toast.error("Tüm alanları doldurun")
            return
        }
        try {
            setCreating(true)
            await adminApi.createAdmin(createForm)
            toast.success("Admin başarıyla oluşturuldu")
            setCreateOpen(false)
            setCreateForm({ email: "", password: "", name: "" })
            fetchAdmins()
        } catch (err: any) {
            toast.error(getErrorMessage(err))
        } finally {
            setCreating(false)
        }
    }

    const handleEdit = async () => {
        const updates: any = {}
        if (editForm.name) updates.name = editForm.name
        if (editForm.email) updates.email = editForm.email
        if (editForm.password) updates.password = editForm.password

        if (Object.keys(updates).length === 0) {
            toast.error("En az bir alan değiştirin")
            return
        }

        try {
            setEditing(true)
            await adminApi.updateAdmin(editForm.id, updates)
            toast.success("Admin güncellendi")
            setEditOpen(false)
            fetchAdmins()
        } catch (err: any) {
            toast.error(getErrorMessage(err))
        } finally {
            setEditing(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteTarget) return
        try {
            setDeleting(true)
            await adminApi.deleteAdmin(deleteTarget.id)
            toast.success(`${deleteTarget.email} admin listesinden çıkarıldı`)
            setDeleteOpen(false)
            setDeleteTarget(null)
            fetchAdmins()
        } catch (err: any) {
            toast.error(getErrorMessage(err))
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/30 rounded-xl">
                        <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Yöneticiler</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Admin kullanıcıları yönetin</p>
                    </div>
                </div>

                {/* Create Admin Dialog */}
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20 transition-all">
                            <Plus className="mr-2 h-4 w-4" />
                            Yeni Admin
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Yeni Admin Ekle</DialogTitle>
                            <DialogDescription>
                                Yeni bir admin kullanıcı oluşturun. Tüm alanlar zorunludur.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="create-name">Ad Soyad</Label>
                                <Input
                                    id="create-name"
                                    placeholder="Admin adı"
                                    value={createForm.name}
                                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="create-email">E-posta</Label>
                                <Input
                                    id="create-email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={createForm.email}
                                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="create-password">Şifre</Label>
                                <div className="relative">
                                    <Input
                                        id="create-password"
                                        type={showCreatePw ? "text" : "password"}
                                        placeholder="Min. 6 karakter"
                                        value={createForm.password}
                                        onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        onClick={() => setShowCreatePw(!showCreatePw)}
                                    >
                                        {showCreatePw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setCreateOpen(false)}>İptal</Button>
                            <Button
                                onClick={handleCreate}
                                disabled={creating}
                                className="bg-emerald-600 hover:bg-emerald-700"
                            >
                                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Oluştur
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Admin Table */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Admin Listesi</CardTitle>
                    <CardDescription>Sisteme erişim yetkisi olan kullanıcılar</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                        </div>
                    ) : admins.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            Henüz admin kullanıcı yok.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[60px]">ID</TableHead>
                                    <TableHead>Ad</TableHead>
                                    <TableHead>E-posta</TableHead>
                                    <TableHead>Durum</TableHead>
                                    <TableHead>Kayıt Tarihi</TableHead>
                                    <TableHead className="text-right">İşlemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {admins.map((admin) => (
                                    <TableRow key={admin.id}>
                                        <TableCell className="font-mono text-sm text-slate-500">#{admin.id}</TableCell>
                                        <TableCell className="font-medium">{admin.name}</TableCell>
                                        <TableCell>{admin.email}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${admin.is_active
                                                ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                                                : "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                                                }`}>
                                                {admin.is_active ? "Aktif" : "Pasif"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-500">
                                            {admin.created_at ? new Date(admin.created_at).toLocaleDateString('tr-TR') : "—"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
                                                    onClick={() => {
                                                        setEditForm({ id: admin.id, email: admin.email, name: admin.name, password: "" })
                                                        setEditOpen(true)
                                                    }}
                                                >
                                                    <Pencil className="h-4 w-4 text-indigo-500" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                    onClick={() => {
                                                        setDeleteTarget(admin)
                                                        setDeleteOpen(true)
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Admin Düzenle</DialogTitle>
                        <DialogDescription>
                            Admin bilgilerini güncelleyin. Şifre alanını boş bırakırsanız değişmez.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Ad Soyad</Label>
                            <Input
                                id="edit-name"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-email">E-posta</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={editForm.email}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-password">Yeni Şifre (opsiyonel)</Label>
                            <div className="relative">
                                <Input
                                    id="edit-password"
                                    type={showEditPw ? "text" : "password"}
                                    placeholder="Değiştirmek istemiyorsanız boş bırakın"
                                    value={editForm.password}
                                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    onClick={() => setShowEditPw(!showEditPw)}
                                >
                                    {showEditPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditOpen(false)}>İptal</Button>
                        <Button
                            onClick={handleEdit}
                            disabled={editing}
                            className="bg-indigo-600 hover:bg-indigo-700"
                        >
                            {editing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Güncelle
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Admin Yetkisini Kaldır</DialogTitle>
                        <DialogDescription>
                            <strong>{deleteTarget?.email}</strong> kullanıcısının admin yetkisini kaldırmak istediğinizden emin misiniz?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteOpen(false)}>İptal</Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Yetkiyi Kaldır
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
