'use client';

import React, { useState, useEffect } from 'react';

export default function DomainsPage() {
  const [domains, setDomains] = useState<any[]>([]);
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [tone, setTone] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchDomains = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/domains');
      const data = await res.json();
      setDomains(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('http://localhost:5001/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainUrl: url, name, brandTone: tone })
      });
      setUrl('');
      setName('');
      setTone('');
      fetchDomains();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this domain? This will unbind it from any active processes.')) return;
    try {
      await fetch(`http://localhost:5001/api/domains/${id}`, { method: 'DELETE' });
      fetchDomains();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '3.5rem auto', padding: '0 2.5rem' }}>
      
      {/* Premium Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '2.5rem' }}>
        <div style={{ 
          width: '52px', 
          height: '52px', 
          borderRadius: '16px', 
          background: 'var(--primary-glow)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          border: '1px solid rgba(99, 102, 241, 0.15)',
          color: 'var(--primary)'
        }}>
          <svg style={{ width: '28px', height: '28px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </div>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
            Domain Management
          </h1>
          <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Configure and maintain web entities and specialized brand tone guidelines.
          </p>
        </div>
      </div>
      
      {/* Form Glass Panel */}
      <section className="glass-panel" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg style={{ width: '18px', height: '18px', color: 'var(--primary)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add New Domain
        </h2>
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Domain Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="My Awesome Site"
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Domain URL</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="example.com"
                value={url} 
                onChange={e => setUrl(e.target.value)} 
                required 
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Brand Tone & Instructions</label>
            <textarea 
              className="form-textarea" 
              value={tone} 
              onChange={e => setTone(e.target.value)}
              placeholder="E.g. Professional, friendly, uses medical terms, short paragraphs, first-person perspective..."
              style={{ minHeight: '120px' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: 'flex-start' }}>
            {loading ? (
              <>
                <svg className="spinner-mini" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="2" x2="12" y2="6" />
                  <line x1="12" y1="18" x2="12" y2="22" />
                  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                  <line x1="2" y1="12" x2="6" y2="12" />
                  <line x1="18" y1="12" x2="22" y2="12" />
                  <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                  <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                </svg>
                <span>Adding...</span>
              </>
            ) : (
              <>
                <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Add Domain</span>
              </>
            )}
          </button>
        </form>
      </section>

      {/* Active Domains Grid */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg style={{ width: '18px', height: '18px', color: 'var(--secondary)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Active Domains
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {domains.map(d => (
            <div key={d.id} className="glass-panel" style={{ 
              padding: '1.75rem', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '12px', 
                    background: 'var(--secondary-glow)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--secondary)',
                    border: '1px solid rgba(13, 148, 136, 0.15)'
                  }}>
                    <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </div>
                  <button 
                    onClick={() => handleDelete(d.id)}
                    className="btn btn-danger"
                    style={{ 
                      padding: '0.45rem', 
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title="Delete domain"
                  >
                    <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
                
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem', letterSpacing: '-0.01em' }}>{d.name}</h3>
                <a href={`https://${d.domainUrl}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--primary)', fontSize: '0.88rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1.25rem' }}>
                  {d.domainUrl}
                  <svg style={{ width: '12px', height: '12px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>
              
              {d.brandTone ? (
                <div style={{ 
                  background: 'rgba(15, 23, 42, 0.01)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '10px', 
                  padding: '0.8rem 1rem', 
                  fontSize: '0.82rem', 
                  color: 'var(--text-secondary)',
                  lineHeight: '1.45'
                }}>
                  <strong style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Brand Tone Guidelines</strong>
                  {d.brandTone}
                </div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.5rem 0' }}>
                  No specialized tone instructions set. Using default balanced AI settings.
                </div>
              )}
            </div>
          ))}
          {domains.length === 0 && (
            <div style={{ 
              gridColumn: '1 / -1',
              padding: '3rem',
              textAlign: 'center',
              border: '1px dashed var(--border)',
              borderRadius: '16px',
              background: 'rgba(15, 23, 42, 0.01)'
            }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
                No active domains registered yet. Expand your presence by adding your first web domain above!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
