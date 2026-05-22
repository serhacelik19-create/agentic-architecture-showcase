import React, { useState, useEffect } from 'react';
import { Search, Globe, ChevronRight } from 'lucide-react';
import { adminApi } from './api';

interface Institution {
    id: number;
    name: string;
    slug: string;
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    status: string;
    _count?: {
        students: number;
        users: number;
    };
}

interface InstitutionListProps {
    onSelect: (id: number) => void;
}

const InstitutionList: React.FC<InstitutionListProps> = ({ onSelect }) => {
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchInstitutions = async () => {
        try {
            const data = await adminApi.getInstitutions();
            setInstitutions(data);
        } catch (err) {
            console.error("Kurumlar yüklenemedi:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInstitutions();
    }, []);

    const filteredInstitutions = institutions.filter(inst =>
        inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Kurumlar yükleniyor...</div>;

    return (
        <div className="institution-manager">
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 800 }}>Kayıtlı Kurumlar</h1>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Sisteme kayıtlı olan tüm dershane ve okulları inceleyin.</p>
            </div>

            <div className="glass-card" style={{ marginBottom: '2rem', padding: '1rem' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Kurum adı veya URL ile ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {filteredInstitutions.map((inst) => (
                    <div
                        key={inst.id}
                        className="glass-card institution-card"
                        style={{
                            borderTop: `4px solid ${inst.primaryColor || 'var(--primary)'}`,
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                        }}
                        onClick={() => onSelect(inst.id)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: '12px',
                                    backgroundColor: `${inst.primaryColor || 'var(--primary)'}15`,
                                    color: inst.primaryColor || 'var(--primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.25rem'
                                }}>
                                    {inst.logo ? <img src={inst.logo} alt="" style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }} /> : inst.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 style={{ fontWeight: 700, fontSize: '1.125rem' }}>{inst.name}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                        <Globe size={14} />
                                        {inst.slug}
                                    </div>
                                </div>
                            </div>
                            <ChevronRight size={20} color="var(--text-muted)" />
                        </div>
                    </div>
                ))}
            </div>

            {filteredInstitutions.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    Arama kriterlerine uygun kurum bulunamadı.
                </div>
            )}
        </div>
    );
};

export default InstitutionList;
