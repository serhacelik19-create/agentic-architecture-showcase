import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit2, Users, Clock, Shield, Check, Trash2 } from 'lucide-react';
import { adminApi } from './api';

interface InstitutionDetailProps {
    institutionId: number;
    onBack: () => void;
    onDelete: (id: number) => void;
}

const InstitutionDetail: React.FC<InstitutionDetailProps> = ({ institutionId, onBack, onDelete }) => {
    const [inst, setInst] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: ''
    });

    const fetchDetail = async () => {
        try {
            const institutions = await adminApi.getInstitutions();
            const detail = institutions.find((i: any) => i.id === institutionId);
            setInst(detail);
            setFormData({
                name: detail.name,
                username: detail.slug,
                password: ''
            });
        } catch (err) {
            console.error("Detay yüklenemedi:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [institutionId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload: any = {
                name: formData.name,
                adminUser: {
                    username: formData.username
                }
            };
            if (formData.password) {
                payload.adminUser.password = formData.password;
            }
            await adminApi.updateInstitution(institutionId, payload);
            setEditMode(false);
            fetchDetail();
            alert("Kurum güncellendi!");
        } catch (err: any) {
            alert("Güncelleme başarısız: " + (err.response?.data?.error || err.message));
        }
    };

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Detaylar yükleniyor...</div>;
    if (!inst) return <div style={{ padding: '4rem', textAlign: 'center' }}>Kurum bulunamadı.</div>;

    return (
        <div>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', background: 'none', marginBottom: '2rem', cursor: 'pointer' }}>
                <ArrowLeft size={20} /> Geri Dön
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{
                        width: 80, height: 80, borderRadius: '20px',
                        backgroundColor: `${inst.primaryColor || 'var(--primary)'}15`,
                        color: inst.primaryColor || 'var(--primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2rem', fontWeight: 800
                    }}>
                        {inst.logo ? <img src={inst.logo} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }} /> : inst.name.charAt(0)}
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{inst.name}</h1>
                        <p style={{ color: 'var(--text-muted)' }}>URL Slug: {inst.slug}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-primary" onClick={() => setEditMode(!editMode)}>
                        <Edit2 size={18} /> {editMode ? 'İptal' : 'Kurumu Düzenle'}
                    </button>
                    <button
                        style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--danger)', color: 'var(--danger)', background: 'none', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                        onClick={() => onDelete(inst.id)}
                    >
                        <Trash2 size={18} /> Kurumu Sil
                    </button>
                </div>
            </div>

            {editMode ? (
                <div className="glass-card" style={{ maxWidth: '400px', padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Düzenleme & Sıfırlama</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Kurum Adı</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Admin Kullanıcı Adı</label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Şifre Sıfırla (Opsiyonel)</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Değiştirmek istemiyorsanız boş bırakın"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                            <Check size={18} /> Güncellemeleri Kaydet
                        </button>
                    </form>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                            <Users size={20} />
                            <h4 style={{ fontWeight: 700 }}>Öğrenci Profili</h4>
                        </div>
                        <p style={{ fontSize: '2rem', fontWeight: 800 }}>{inst._count?.students || 0}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Sisteme kayıtlı toplam öğrenci</p>
                    </div>

                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#10b981' }}>
                            <Clock size={20} />
                            <h4 style={{ fontWeight: 700 }}>Aktiflik Durumu</h4>
                        </div>
                        <p style={{ fontSize: '2rem', fontWeight: 800 }}>{inst.status === 'active' ? 'Aktif' : 'Pasif'}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Kurumun sistem erişim durumu</p>
                    </div>

                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#f59e0b' }}>
                            <Shield size={20} />
                            <h4 style={{ fontWeight: 700 }}>Güvenlik Altyapısı</h4>
                        </div>
                        <p style={{ fontSize: '2rem', fontWeight: 800 }}>V2</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Bağlantı ve API güvenlik sürümü</p>
                    </div>
                </div>
            )}

            <div className="glass-card" style={{ marginTop: '2rem', padding: '2rem' }}>
                <h3 style={{ fontWeight: 800, marginBottom: '1.5rem' }}>Kurum Detay Verileri</h3>
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Bu kuruma ait detaylı istatistikler ve öğrenci verileri yakında burada listelenecek.
                </div>
            </div>
        </div>
    );
};

export default InstitutionDetail;
