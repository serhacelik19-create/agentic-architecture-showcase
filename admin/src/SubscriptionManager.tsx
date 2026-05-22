import React, { useState, useEffect } from 'react';
import { Plus, Calendar, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { adminApi } from './api';

interface Subscription {
    id: number;
    institutionId: number;
    institution: { name: string };
    planName: string;
    startDate: string;
    endDate: string;
    amount: number;
    status: string;
}

const SubscriptionManager: React.FC = () => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [institutions, setInstitutions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        institutionId: '',
        planName: 'Pro',
        amount: '',
        endDate: ''
    });

    const fetchData = async () => {
        try {
            const [subsData, instData] = await Promise.all([
                adminApi.getSubscriptions(),
                adminApi.getInstitutions()
            ]);
            setSubscriptions(subsData);
            setInstitutions(instData);
        } catch (err) {
            console.error("Abonelikler yüklenemedi:", err);
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
            await adminApi.createSubscription(formData);
            setShowModal(false);
            setFormData({ institutionId: '', planName: 'Pro', amount: '', endDate: '' });
            fetchData();
        } catch (err) {
            alert("Hata oluştu");
        }
    };

    const getStatusBadge = (_status: string, endDate: string) => {
        const isExpired = new Date(endDate) < new Date();
        if (isExpired) return <span style={{ padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> Süresi Doldu</span>;

        return <span style={{ padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={12} /> Aktif</span>;
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Yükleniyor...</div>;

    return (
        <div className="subscription-manager">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Abonelik Takibi</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Kurumların paketlerini ve yenileme tarihlerini yönetin.</p>
                </div>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={20} />
                    Yeni Abonelik Tanımla
                </button>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="glass-card" style={{ width: '450px', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontWeight: 800 }}>Abonelik Tanımla</h3>
                            <X style={{ cursor: 'pointer' }} onClick={() => setShowModal(false)} />
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Kurum Seçin</label>
                                <select
                                    value={formData.institutionId}
                                    onChange={(e) => setFormData({ ...formData, institutionId: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'white' }}
                                >
                                    <option value="">Kurum Seçin...</option>
                                    {institutions.map(inst => (
                                        <option key={inst.id} value={inst.id}>{inst.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Paket</label>
                                    <select
                                        value={formData.planName}
                                        onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'white' }}
                                    >
                                        <option value="Basic">Basic</option>
                                        <option value="Pro">Pro</option>
                                        <option value="Enterprise">Enterprise</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Tutar (₺)</label>
                                    <input
                                        type="number"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                                        placeholder="2500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Bitiş Tarihi</label>
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                                />
                            </div>

                            <button className="btn-primary" type="submit" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>Aboneliği Başlat</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="glass-card" style={{ padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Kurum</th>
                            <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Paket</th>
                            <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Bitiş Tarihi</th>
                            <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Tutar</th>
                            <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Durum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscriptions.map((sub) => (
                            <tr key={sub.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                    <div style={{ fontWeight: 700 }}>{sub.institution?.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{sub.id}</div>
                                </td>
                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ padding: '0.25rem 0.5rem', borderRadius: '6px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700 }}>{sub.planName}</div>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                                        <Calendar size={16} color="var(--text-muted)" />
                                        {new Date(sub.endDate).toLocaleDateString('tr-TR')}
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700 }}>
                                    ₺{sub.amount.toLocaleString()}
                                </td>
                                <td style={{ padding: '1.25rem 1.5rem' }}>{getStatusBadge(sub.status, sub.endDate)}</td>
                            </tr>
                        ))}
                        {subscriptions.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Henüz aktif bir abonelik bulunmuyor.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubscriptionManager;
