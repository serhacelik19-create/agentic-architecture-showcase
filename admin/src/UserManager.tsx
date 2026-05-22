import React, { useState, useEffect } from 'react';
import { Plus, Mail, Building2, Shield, Trash2, X, Key } from 'lucide-react';
import { adminApi } from './api';

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
    institutionId?: number;
    institution?: { name: string };
}

const UserManager: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [institutions, setInstitutions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'admin',
        institutionId: ''
    });

    const fetchData = async () => {
        try {
            const [usersData, instData] = await Promise.all([
                adminApi.getUsers(),
                adminApi.getInstitutions()
            ]);
            setUsers(usersData);
            setInstitutions(instData);
        } catch (err) {
            console.error("Kullanıcılar yüklenemedi:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminApi.createUser(formData);
            setShowModal(false);
            setFormData({ name: '', username: '', email: '', password: '', role: 'admin', institutionId: '' });
            fetchData();
        } catch (err) {
            alert("Kullanıcı oluşturulurken hata oluştu");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;
        try {
            await adminApi.deleteUser(id);
            fetchData();
        } catch (err) {
            alert("Silme işlemi başarısız");
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Yükleniyor...</div>;

    return (
        <div className="user-manager">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Kullanıcı Yönetimi</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Kurumsal adminleri ve öğretmenleri buradan yönetin.</p>
                </div>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={20} />
                    Yeni Kullanıcı Ekle
                </button>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="glass-card" style={{ width: '450px', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontWeight: 800 }}>Kullanıcı Ekle</h3>
                            <X style={{ cursor: 'pointer' }} onClick={() => setShowModal(false)} />
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Ad Soyad</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="form-input"
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Kullanıcı Adı</label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Şifre</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                                        placeholder="******"
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>E-posta</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Rol</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="teacher">Öğretmen</option>
                                        <option value="super_admin">Süper Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Kurum</label>
                                    <select
                                        value={formData.institutionId}
                                        onChange={(e) => setFormData({ ...formData, institutionId: e.target.value })}
                                        style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                                    >
                                        <option value="">Kurum Seçin (Opsiyonel)</option>
                                        {institutions.map(inst => (
                                            <option key={inst.id} value={inst.id}>{inst.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button className="btn-primary" type="submit" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>Kullanıcıyı Kaydet</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="glass-card" style={{ padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Kullanıcı</th>
                            <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>İletişim</th>
                            <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Rol & Kurum</th>
                            <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700 }}>{user.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{user.username}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                        <Mail size={14} color="var(--text-muted)" />
                                        {user.email}
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>
                                            <Shield size={12} /> {user.role.toUpperCase()}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            <Building2 size={12} /> {user.institution?.name || 'Sistem Genel'}
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button style={{ padding: '0.5rem', borderRadius: '8px', background: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Key size={18} /></button>
                                        <button style={{ padding: '0.5rem', borderRadius: '8px', background: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => handleDelete(user.id)}><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManager;
