import React, { useState } from 'react';
import { Building2, Check, Shield, Info } from 'lucide-react';
import { adminApi } from './api';

const InstitutionWizard: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: ''
    });

    const slugify = (text: string) => {
        const trMap: any = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u' };
        return text.toLowerCase()
            .replace(/[çğıöşüÇĞİÖŞÜ]/g, (m) => trMap[m])
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    };

    const handleNameChange = (name: string) => {
        const slug = slugify(name);
        setFormData(prev => ({
            ...prev,
            name,
            username: slug
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const slug = slugify(formData.name);
            const payload = {
                name: formData.name,
                slug: slug,
                primaryColor: '#6366f1',
                secondaryColor: '#10b981',
                adminUser: {
                    name: formData.name,
                    username: formData.username,
                    password: formData.password,
                    email: `admin@${slug}.com`
                }
            };
            await adminApi.createInstitution(payload);
            alert("Kurum başarıyla kuruldu!");
            setFormData({ name: '', username: '', password: '' });
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || err.message || "Bilinmeyen bir hata oluştu.";
            alert(`Kurum kurulumu başarısız: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                <div style={{
                    display: 'inline-flex',
                    padding: '1rem',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    color: 'var(--primary)',
                    marginBottom: '1.5rem'
                }}>
                    <Building2 size={32} />
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Kurum Kurulum Sihirbazı</h1>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Sadece 3 adımda yeni bir kurum ve yönetici hesabı oluşturun.
                </p>
            </div>

            <div className="glass-card" style={{ padding: '2.5rem' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{
                        padding: '1rem',
                        backgroundColor: 'rgba(99, 102, 241, 0.05)',
                        borderRadius: '12px',
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'center',
                        fontSize: '0.875rem',
                        color: 'var(--primary)',
                        border: '1px solid rgba(99, 102, 241, 0.1)'
                    }}>
                        <Info size={18} />
                        <span>Renkler, logolar ve e-postalar kurum adından otomatik türetilecek.</span>
                    </div>

                    <div>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Kurum Adı</label>
                        <input
                            type="text"
                            required
                            disabled={loading}
                            value={formData.name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="Örn: Bilim Koleji"
                            style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '1rem' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Yönetici Kullanıcı Adı</label>
                            <input
                                type="text"
                                required
                                disabled={loading}
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '1rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Admin Şifresi</label>
                            <input
                                type="password"
                                required
                                disabled={loading}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '1rem' }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{ padding: '1.25rem', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, marginTop: '1rem' }}
                    >
                        {loading ? 'Kurulum Yapılıyor...' : <><Check size={20} /> Kurumu Şimdi Kur</>}
                    </button>

                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        <Shield size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        Sistem güvenliği için güçlü şifreler kullanın.
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InstitutionWizard;
