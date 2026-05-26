'use client';

import React, { useState } from 'react';

// Type Definitions
interface CompetitorHeader {
  tag: string;
  text: string;
}

interface Competitor {
  title: string;
  url: string;
  headers: CompetitorHeader[];
  bodyExcerpt: string;
}

interface OutlineHeading {
  tag: 'h2' | 'h3';
  text: string;
  keywords: string[];
}

interface Outline {
  suggestedTitle: string;
  metaDescription: string;
  headings: OutlineHeading[];
  suggestedWordCount: number;
}

interface CustomSelectProps {
  label: string;
  value: string | number;
  options: { value: string | number; label: string }[];
  onChange: (val: any) => void;
  disabled?: boolean;
}

// Reusable custom dropdown menu (Stripe-styled) with dynamic stacking context
function CustomSelect({ label, value, options, onChange, disabled }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div 
      style={{ position: 'relative', width: '100%', zIndex: isOpen ? 1000 : 1 }}
      onMouseLeave={() => setIsOpen(false)}
    >
      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 700 }}>
        {label}
      </label>
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className="form-input"
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          cursor: disabled ? 'not-allowed' : 'pointer',
          background: '#ffffff',
          borderColor: isOpen ? 'var(--primary)' : 'var(--border)',
          boxShadow: isOpen ? '0 0 0 4px var(--primary-glow)' : 'none',
          padding: '0.95rem 1.1rem',
          userSelect: 'none'
        }}
      >
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{selectedOption?.label}</span>
        <span style={{ 
          fontSize: '0.65rem', 
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
          transition: 'transform 0.2s ease',
          color: 'var(--text-secondary)'
        }}>▼</span>
      </div>
      
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '105%',
          left: 0,
          width: '100%',
          background: '#ffffff',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
          zIndex: 100,
          padding: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem'
        }}>
          {options.map(opt => (
            <div 
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              style={{
                padding: '0.75rem 0.85rem',
                borderRadius: '8px',
                cursor: 'pointer',
                background: opt.value === value ? 'var(--primary-glow)' : 'transparent',
                color: opt.value === value ? 'var(--primary)' : 'var(--text-primary)',
                fontWeight: opt.value === value ? 700 : 500,
                fontSize: '0.9rem',
                transition: 'all 0.2s ease',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => {
                if (opt.value !== value) {
                  e.currentTarget.style.background = '#f8fafc';
                }
              }}
              onMouseLeave={(e) => {
                if (opt.value !== value) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span>{opt.label}</span>
              {opt.value === value && <span style={{ fontWeight: 'bold' }}>✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Configurable Constants (Fully English)
const sizeOptions = [
  { value: 'kisa', label: 'Short (500 - 800 Words)' },
  { value: 'dengeli', label: 'Balanced (1200 - 1500 Words)' },
  { value: 'kapsamli', label: 'Pillar Content (2000 - 2500+ Words)' }
];

const toneOptions = [
  { value: 'profesyonel', label: 'Professional / Corporate' },
  { value: 'samimi', label: 'Casual / Engaging Blog' },
  { value: 'akademik', label: 'Educational / Academic' },
  { value: 'satis', label: 'Persuasive / Sales Focused' }
];

const limitOptions = [
  { value: 1, label: '1 Competitor (Fast)' },
  { value: 3, label: '3 Competitors (Balanced)' },
  { value: 5, label: '5 Competitors (Comprehensive)' }
];

const platformOptions = [
  { value: 'Simülasyon', label: 'Simulated Webhook (Recommended)' },
  { value: 'WordPress', label: 'WordPress REST API' },
  { value: 'Webflow', label: 'Webflow CMS API' }
];

export default function Dashboard() {
  // Local States
  const [keyword, setKeyword] = useState('');
  const [limit, setLimit] = useState(3);
  const [size, setSize] = useState<'kisa' | 'dengeli' | 'kapsamli'>('dengeli');
  const [tone, setTone] = useState<'profesyonel' | 'samimi' | 'akademik' | 'satis'>('profesyonel');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Steps & Statuses
  const [currentStep, setCurrentStep] = useState(0); // 0: Idle, 1: Scraping, 2: Analysis/Outline, 3: Generation, 4: Publishing
  const [stepStatuses, setStepStatuses] = useState<('pending' | 'running' | 'completed' | 'failed')[]>([
    'pending', 'pending', 'pending', 'pending'
  ]);

  // Backend Payload Values
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [outline, setOutline] = useState<Outline | null>(null);
  const [articleContent, setArticleContent] = useState<string | null>(null);
  const [publishResult, setPublishResult] = useState<{ success: boolean; platform: string; url?: string; message: string } | null>(null);

  // Active Layout Toggles
  const [isEditingOutline, setIsEditingOutline] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'WordPress' | 'Webflow' | 'Simülasyon'>('Simülasyon');
  const [activeTab, setActiveTab] = useState<'preview' | 'html'>('preview');
  const [copied, setCopied] = useState(false);

  // AI Pipeline Step Metadata
  const steps = [
    { title: 'Google SERP Scraping', desc: 'Competitor pages scraped deeply via Puppeteer' },
    { title: 'Competitor Semantic Analysis', desc: 'Optimal SEO structures designed via Artificial Intelligence' },
    { title: 'Autonomous Article Writing', desc: 'Writing a comprehensive, organic long-form article' },
    { title: 'Automated CMS Publishing', desc: 'Uploading as a ready draft to your CMS platforms' }
  ];

  // Helper: Step Status Updater
  const updateStepStatus = (index: number, status: 'pending' | 'running' | 'completed' | 'failed') => {
    setStepStatuses(prev => {
      const next = [...prev];
      next[index] = status;
      return next;
    });
  };

  // STEP 1 & 2: Launch Autopilot (Scraping + Outline Analysis)
  const startAutopilot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    setError(null);
    setCompetitors([]);
    setOutline(null);
    setArticleContent(null);
    setPublishResult(null);
    setCurrentStep(1);
    
    // Reset statuses to defaults
    setStepStatuses(['running', 'pending', 'pending', 'pending']);

    try {
      const response = await fetch('http://localhost:5001/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, limit, size, tone })
      });

      if (!response.ok) {
        throw new Error('Backend failed during SERP scraping or semantic analysis.');
      }

      updateStepStatus(0, 'completed');
      updateStepStatus(1, 'running');
      setCurrentStep(2);

      const data = await response.json();
      
      setCompetitors(data.competitors || []);
      setOutline(data.outline || null);
      
      updateStepStatus(1, 'completed');
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
      updateStepStatus(0, 'failed');
      updateStepStatus(1, 'failed');
      setLoading(false);
    }
  };

  // STEP 3: Generate Article
  const generateArticle = async () => {
    if (!outline) return;

    setLoading(true);
    setError(null);
    setCurrentStep(3);
    updateStepStatus(2, 'running');

    try {
      const response = await fetch('http://localhost:5001/api/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, outline, competitors, tone })
      });

      if (!response.ok) {
        throw new Error('Backend failed during autonomous article generation.');
      }

      const data = await response.json();
      setArticleContent(data.content);
      
      updateStepStatus(2, 'completed');
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate article.');
      updateStepStatus(2, 'failed');
      setLoading(false);
    }
  };

  // STEP 4: Publish to Blog CMS
  const publishArticle = async () => {
    if (!articleContent || !outline) return;

    setLoading(true);
    setError(null);
    setCurrentStep(4);
    updateStepStatus(3, 'running');

    try {
      const response = await fetch('http://localhost:5001/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: outline.suggestedTitle,
          content: articleContent,
          platform: selectedPlatform
        })
      });

      if (!response.ok) {
        throw new Error('Backend failed during CMS publishing integration.');
      }

      const data = await response.json();
      setPublishResult(data);
      
      if (data.success) {
        updateStepStatus(3, 'completed');
      } else {
        updateStepStatus(3, 'failed');
      }
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to publish content.');
      updateStepStatus(3, 'failed');
      setLoading(false);
    }
  };

  // --- Human-in-the-Loop Editors ---

  // Handle heading modification
  const handleHeadingTextChange = (index: number, newText: string) => {
    if (!outline) return;
    const nextHeadings = [...outline.headings];
    nextHeadings[index].text = newText;
    setOutline({ ...outline, headings: nextHeadings });
  };

  // Handle primary title modification
  const handleTitleChange = (newTitle: string) => {
    if (!outline) return;
    setOutline({ ...outline, suggestedTitle: newTitle });
  };

  // Add customized headings to outline
  const handleAddHeading = (tag: 'h2' | 'h3') => {
    if (!outline) return;
    const newHeading: OutlineHeading = {
      tag,
      text: tag === 'h2' ? 'New Subheading (H2)' : 'New Detailed Subheading (H3)',
      keywords: []
    };
    setOutline({
      ...outline,
      headings: [...outline.headings, newHeading]
    });
  };

  // Delete headings from outline
  const handleRemoveHeading = (index: number) => {
    if (!outline) return;
    const nextHeadings = outline.headings.filter((_, idx) => idx !== index);
    setOutline({
      ...outline,
      headings: nextHeadings
    });
  };

  // --- Utility Content Methods ---

  // Clipboard Copier
  const copyToClipboard = () => {
    if (!articleContent) return;
    navigator.clipboard.writeText(articleContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download local HTML file
  const downloadHtmlFile = () => {
    if (!articleContent || !outline) return;
    const element = document.createElement('a');
    const file = new Blob([articleContent], { type: 'text/html;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${outline.suggestedTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // --- Real-time SEO Score Calculator (SurferSEO-styled) ---
  const calculateSEOScore = () => {
    if (!outline) return { score: 0, items: [] as { text: string; passed: boolean; impact: string }[] };
    
    let currentScore = 0;
    const scoreItems = [];
    const keywordLower = keyword.toLowerCase().trim();

    // 1. Keyword in H1 Title? (20 Points)
    const titleLower = outline.suggestedTitle.toLowerCase();
    const hasKeywordInTitle = titleLower.includes(keywordLower);
    currentScore += hasKeywordInTitle ? 20 : 0;
    scoreItems.push({
      text: 'Target keyword is present in the main heading (H1).',
      passed: hasKeywordInTitle,
      impact: '20 Points'
    });

    // 2. Keyword in Meta Description? (15 Points)
    const metaLower = outline.metaDescription.toLowerCase();
    const hasKeywordInMeta = metaLower.includes(keywordLower);
    currentScore += hasKeywordInMeta ? 15 : 0;
    scoreItems.push({
      text: 'Target keyword is present in the search meta description.',
      passed: hasKeywordInMeta,
      impact: '15 Points'
    });

    // 3. Keyword in alt headings? (15 Points)
    const hasKeywordInHeadings = outline.headings.some(h => h.text.toLowerCase().includes(keywordLower));
    currentScore += hasKeywordInHeadings ? 15 : 0;
    scoreItems.push({
      text: 'Target keyword is present in at least one subheading (H2/H3).',
      passed: hasKeywordInHeadings,
      impact: '15 Points'
    });

    // 4. Content structure complexity? (15 Points)
    const hasEnoughHeadings = outline.headings.length >= 4;
    currentScore += hasEnoughHeadings ? 15 : 0;
    scoreItems.push({
      text: `Content hierarchy is sufficiently detailed (${outline.headings.length}/4+ headings).`,
      passed: hasEnoughHeadings,
      impact: '15 Points'
    });

    // 5. Word count & Technical schema checks (Requires article body written)
    if (articleContent) {
      const cleanText = articleContent.replace(/<[^>]*>/g, ' ');
      const actualWords = cleanText.trim().split(/\s+/).filter(w => w.length > 0).length;

      const reachesWordTarget = actualWords >= (outline.suggestedWordCount * 0.8);
      currentScore += reachesWordTarget ? 20 : 0;
      scoreItems.push({
        text: `Target article length has been achieved (${actualWords}/${outline.suggestedWordCount} words).`,
        passed: reachesWordTarget,
        impact: '20 Points'
      });

      const hasFaqSchema = articleContent.includes('application/ld+json') && articleContent.includes('FAQPage');
      currentScore += hasFaqSchema ? 15 : 0;
      scoreItems.push({
        text: 'Technical FAQ JSON-LD Schema successfully embedded inside article markup.',
        passed: hasFaqSchema,
        impact: '15 Points'
      });
    } else {
      scoreItems.push({
        text: 'Target word count verification (Evaluated once article generation completes).',
        passed: false,
        impact: '20 Points'
      });
      scoreItems.push({
        text: 'Technical FAQ Schema check (Evaluated once article generation completes).',
        passed: false,
        impact: '15 Points'
      });
    }

    return { score: currentScore, items: scoreItems };
  };

  const seoReport = calculateSEOScore();

  return (
    <div style={{ paddingBottom: '6rem', position: 'relative' }}>
      
      {/* Background drifting glow orbs */}
      <div className="glow-orb glow-orb-primary"></div>
      <div className="glow-orb glow-orb-secondary"></div>

      {/* Top micro progress neon line */}
      <div className="progress-line-container">
        <div 
          className="progress-line-fill" 
          style={{ width: `${currentStep === 0 ? 0 : (currentStep / 4) * 100}%` }}
        ></div>
      </div>

      {/* Hero header section */}
      <header style={{ 
        textAlign: 'center', 
        padding: '4.5rem 1rem 3.5rem',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(255,255,255,0.005)'
      }}>
        <h1 className="gradient-text" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Agentic SEO & Content Autopilot
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem', opacity: 0.95 }}>
          An autonomous SEO article generator that scrapes ranking competitor outlines on Google and authors fully optimized long-form articles using Artificial Intelligence.
        </p>
      </header>

      {/* Primary dashboard container */}
      <div className="dashboard-grid">
        
        {/* Left Sidebar: Controls & Steps */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Autopilot input fields */}
          <section className="glass-panel">
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', fontWeight: 800, letterSpacing: '-0.01em' }}>🚀 Autopilot Settings</h2>
            <form onSubmit={startAutopilot} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 700 }}>
                  Target Keyword
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g., Artificial intelligence in software development" 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              {/* Dynamic Option: Article Word Count */}
              <CustomSelect 
                label="Article Word Count"
                value={size}
                options={sizeOptions}
                onChange={setSize}
                disabled={loading}
              />

              {/* Dynamic Option: Tone of Voice */}
              <CustomSelect 
                label="Tone of Voice"
                value={tone}
                options={toneOptions}
                onChange={setTone}
                disabled={loading}
              />

              {/* Dynamic Option: Competitor Crawling Limit */}
              <CustomSelect 
                label="Competitor Limit"
                value={limit}
                options={limitOptions}
                onChange={setLimit}
                disabled={loading}
              />

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', height: '3.2rem' }}
                disabled={loading || !keyword.trim()}
              >
                {loading && currentStep <= 2 ? 'Scraping SERP...' : 'Launch Autopilot'}
              </button>
            </form>
          </section>

          {/* AI Agent real-time progress engine */}
          <section className="glass-panel">
            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', fontWeight: 800, letterSpacing: '-0.01em' }}>⚡ AI Agent Status Engine</h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', opacity: 0.8, marginBottom: '1.25rem' }}>
              Real-time content pipeline progress:
            </p>

            <div className="step-container">
              {steps.map((step, idx) => (
                <div 
                  key={idx} 
                  className={`step-card ${currentStep === idx + 1 ? 'active' : ''} ${stepStatuses[idx] === 'completed' ? 'completed' : ''}`}
                >
                  <div className="step-number">
                    {stepStatuses[idx] === 'completed' ? '✓' : idx + 1}
                  </div>
                  <div className="step-info">
                    <div className="step-title">{step.title}</div>
                    <div className="step-desc">{step.desc}</div>
                  </div>
                  <span className={`step-badge badge-${stepStatuses[idx]}`}>
                    {stepStatuses[idx] === 'pending' && 'Pending'}
                    {stepStatuses[idx] === 'running' && 'Active'}
                    {stepStatuses[idx] === 'completed' && 'Completed'}
                    {stepStatuses[idx] === 'failed' && 'Failed'}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Educational presentation note */}
          <section className="glass-panel" style={{ padding: '1.25rem', background: 'rgba(99,102,241,0.02)' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--primary)', marginBottom: '0.4rem', fontWeight: 800 }}>💡 Portfolio Presentation Tip</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              This UI works wonders in interviews! If you don't have an API key, the system automatically falls back to simulated mode to ensure a flawless presentation.
            </p>
          </section>
        </aside>

        {/* Right Content Panel: Outline, Previews, SEO Analysis */}
        <main className="glass-panel" style={{ minHeight: '550px', display: 'flex', flexDirection: 'column' }}>
          
          {/* General Error Banner */}
          {error && (
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.08)', 
              border: '1px solid var(--error)', 
              color: 'var(--text-primary)', 
              padding: '1.25rem', 
              borderRadius: '12px', 
              marginBottom: '2rem',
              fontSize: '0.92rem'
            }}>
              ⚠️ <strong>System Alert:</strong> {error}
            </div>
          )}

          {/* Idle State: No Autopilot Launched yet */}
          {currentStep === 0 && !loading && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flex: 1, 
              textAlign: 'center',
              padding: '5rem 1rem'
            }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>🤖</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>Autopilot Ready</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', fontSize: '0.95rem', opacity: 0.9 }}>
                Enter a target keyword on the left panel and click "Launch Autopilot" to trigger the autonomous SEO workflow.
              </p>
            </div>
          )}

          {/* Scraping/Outline Processing Shimmer State */}
          {loading && currentStep <= 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem', width: '100%', padding: '1rem' }}>
              <div className="shimmer" style={{ height: '36px', width: '45%', borderRadius: '8px' }}></div>
              <div className="shimmer" style={{ height: '140px', width: '100%', borderRadius: '16px' }}></div>
              <div className="shimmer" style={{ height: '44px', width: '100%', borderRadius: '10px' }}></div>
              <div className="shimmer" style={{ height: '44px', width: '100%', borderRadius: '10px' }}></div>
              <div className="shimmer" style={{ height: '44px', width: '100%', borderRadius: '10px' }}></div>
            </div>
          )}

          {/* STEP 2: Competitors outline mapping + Live SEO Score Scorer Panel (Human-in-the-loop) */}
          {outline && !articleContent && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              
              {/* Live SEO Score Gauge (SurferSEO-styled) */}
              <div className="glass-panel" style={{ background: 'rgba(99, 102, 241, 0.01)', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    📈 Live SEO Score Analysis
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: seoReport.score >= 80 ? 'rgba(16, 185, 129, 0.08)' : seoReport.score >= 50 ? 'rgba(245, 158, 11, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                      border: `2px solid ${seoReport.score >= 80 ? 'var(--success)' : seoReport.score >= 50 ? 'var(--warning)' : 'var(--error)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1rem',
                      color: seoReport.score >= 80 ? 'var(--success)' : seoReport.score >= 50 ? 'var(--warning)' : 'var(--error)'
                    }}>
                      {seoReport.score}
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>/100 Score</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {seoReport.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: item.passed ? 'var(--text-primary)' : 'var(--text-secondary)', opacity: item.passed ? 1 : 0.8 }}>
                        <span style={{ color: item.passed ? 'var(--success)' : 'var(--text-muted)' }}>{item.passed ? '✓' : '○'}</span>
                        {item.text}
                      </span>
                      <span style={{ fontWeight: 700, color: item.passed ? 'var(--success)' : 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {item.passed ? `+${item.impact}` : `(${item.impact})`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scraped Competitors metadata */}
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--secondary)', letterSpacing: '-0.01em' }}>
                  🔍 Google Ranking Competitors Identified
                </h3>
                {competitors.length === 0 ? (
                  <div style={{ 
                    background: 'rgba(255,255,255,0.01)', 
                    border: '1px solid var(--border)', 
                    borderRadius: '12px', 
                    padding: '1.25rem',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)'
                  }}>
                    ℹ️ Competitor pages could not be scraped directly due to Google anti-bot checks. However, the AI has automatically bypassed SERP analysis and mapped out a targeted English outline.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {competitors.map((comp, cIdx) => (
                      <div key={cIdx} style={{ 
                        background: 'rgba(255,255,255,0.01)', 
                        border: '1px solid var(--border)', 
                        borderRadius: '12px', 
                        padding: '1.25rem' 
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{comp.title}</h4>
                          <a href={comp.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--secondary)', textDecoration: 'none', fontWeight: 600 }}>
                            Visit Site ↗
                          </a>
                        </div>
                        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', opacity: 0.85 }}>
                          {comp.headers.slice(0, 5).map((h, hIdx) => (
                            <span key={hIdx} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                              {h.tag.toUpperCase()}: {h.text.slice(0, 30)}...
                            </span>
                          ))}
                          {comp.headers.length > 5 && <span style={{ padding: '0.2rem 0.5rem' }}>+{comp.headers.length - 5} more headings</span>}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* AI SEO suggested outline editor */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.01em' }}>
                    📝 AI Suggested SEO Outline (Human-in-the-Loop)
                  </h3>
                  <button 
                    className="btn btn-secondary" 
                    style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                    onClick={() => setIsEditingOutline(!isEditingOutline)}
                  >
                    {isEditingOutline ? 'Save Outline' : 'Edit Outline'}
                  </button>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', background: 'rgba(0,0,0,0.15)' }}>
                  
                  {/* CTR suggested title input */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
                      Suggested Article Title (High-CTR)
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={outline.suggestedTitle}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      disabled={!isEditingOutline}
                      style={{ fontWeight: 'bold', fontSize: '1.05rem' }}
                    />
                  </div>

                  {/* Meta description input */}
                  <div style={{ marginBottom: '1.75rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
                      Suggested Search Meta Description
                    </label>
                    <textarea 
                      className="form-input" 
                      rows={2}
                      value={outline.metaDescription}
                      onChange={(e) => setOutline({ ...outline, metaDescription: e.target.value })}
                      disabled={!isEditingOutline}
                      style={{ resize: 'none' }}
                    />
                  </div>

                  {/* Outline header structures */}
                  <div className="outline-editor-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        Content Hierarchy (H2 & H3)
                      </label>
                      
                      {isEditingOutline && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            type="button"
                            className="btn btn-secondary" 
                            style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem', borderRadius: '6px' }}
                            onClick={() => handleAddHeading('h2')}
                          >
                            + Add H2
                          </button>
                          <button 
                            type="button"
                            className="btn btn-secondary" 
                            style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem', borderRadius: '6px' }}
                            onClick={() => handleAddHeading('h3')}
                          >
                            + Add H3
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {outline.headings.map((heading, idx) => (
                      <div key={idx} className="outline-item">
                        <span className={`outline-tag ${heading.tag}`}>
                          {heading.tag.toUpperCase()}
                        </span>
                        <input 
                          type="text"
                          className="outline-text-input"
                          value={heading.text}
                          onChange={(e) => handleHeadingTextChange(idx, e.target.value)}
                          disabled={!isEditingOutline}
                        />
                        {isEditingOutline && (
                          <button 
                            type="button" 
                            className="btn btn-danger" 
                            style={{ padding: '0.35rem 0.65rem', borderRadius: '8px', fontSize: '0.8rem' }}
                            onClick={() => handleRemoveHeading(idx)}
                            title="Delete Heading"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Recommended word limit */}
                  <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', opacity: 0.9 }}>
                    <span>Recommended Word Count: <strong>{outline.suggestedWordCount}</strong></span>
                    <span>Mode: <strong>Human-in-the-Loop (User Guided)</strong></span>
                  </div>
                </div>
              </div>

              {/* Generate article trigger */}
              <button 
                onClick={generateArticle} 
                className="btn btn-primary" 
                style={{ alignSelf: 'flex-end', gap: '0.75rem', height: '3rem', padding: '0 2rem' }}
              >
                ✍️ Generate Full SEO Article
              </button>
            </div>
          )}

          {/* STEP 3: Article Autoriting Progress Shimmer */}
          {loading && currentStep === 3 && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flex: 1, 
              textAlign: 'center',
              padding: '5rem 1rem'
            }}>
              <div className="shimmer" style={{ width: '90px', height: '90px', borderRadius: '50%', marginBottom: '2rem' }}></div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>✍️ Generating Article...</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', fontSize: '0.95rem', opacity: 0.9 }}>
                Advanced AI is analyzing competitor structures and writing a highly relevant, custom HTML article. This takes about 15-30 seconds.
              </p>
            </div>
          )}

          {/* STEP 3 (Completed): Article Preview + Publishing Section */}
          {articleContent && !publishResult && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Dynamic SEO Score Calculator report (After Generation) */}
              <div className="glass-panel" style={{ background: 'rgba(16, 185, 129, 0.01)', padding: '1.5rem', borderLeft: '4px solid var(--success)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    📈 Live SEO Score Analysis
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: seoReport.score >= 80 ? 'rgba(16, 185, 129, 0.08)' : seoReport.score >= 50 ? 'rgba(245, 158, 11, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                      border: `2px solid ${seoReport.score >= 80 ? 'var(--success)' : seoReport.score >= 50 ? 'var(--warning)' : 'var(--error)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1rem',
                      color: seoReport.score >= 80 ? 'var(--success)' : seoReport.score >= 50 ? 'var(--warning)' : 'var(--error)'
                    }}>
                      {seoReport.score}
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>/100 Score</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {seoReport.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: item.passed ? 'var(--text-primary)' : 'var(--text-secondary)', opacity: item.passed ? 1 : 0.8 }}>
                        <span style={{ color: item.passed ? 'var(--success)' : 'var(--text-muted)' }}>{item.passed ? '✓' : '○'}</span>
                        {item.text}
                      </span>
                      <span style={{ fontWeight: 700, color: item.passed ? 'var(--success)' : 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {item.passed ? `+${item.impact}` : `(${item.impact})`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
                  📄 Generated SEO Article Preview
                </h3>
                
                {/* Visual/Code View Tab triggers */}
                <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(255,255,255,0.03)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <button 
                    className="btn" 
                    style={{ 
                      fontSize: '0.78rem', 
                      padding: '0.35rem 0.75rem', 
                      borderRadius: '6px',
                      background: activeTab === 'preview' ? 'var(--primary)' : 'transparent',
                      color: '#ffffff'
                    }}
                    onClick={() => setActiveTab('preview')}
                  >
                    Visual Preview
                  </button>
                  <button 
                    className="btn" 
                    style={{ 
                      fontSize: '0.78rem', 
                      padding: '0.35rem 0.75rem', 
                      borderRadius: '6px',
                      background: activeTab === 'html' ? 'var(--primary)' : 'transparent',
                      color: '#ffffff'
                    }}
                    onClick={() => setActiveTab('html')}
                  >
                    HTML Code
                  </button>
                </div>
              </div>

              {/* Title & Metadata layout card */}
              <div style={{ background: 'rgba(255,255,255,0.01)', padding: '1.25rem', borderRadius: '12px', borderLeft: '4px solid var(--primary)', borderRight: '1px solid var(--border)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>{outline?.suggestedTitle}</h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.4rem', opacity: 0.85 }}>
                  Meta Description: {outline?.metaDescription}
                </p>
              </div>

              {/* Copy/Download controls */}
              <div style={{ display: 'flex', gap: '1rem', alignSelf: 'flex-end' }}>
                <button 
                  onClick={copyToClipboard}
                  className="btn btn-secondary"
                  style={{ gap: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
                >
                  {copied ? '✓ Copied!' : '📋 Copy HTML'}
                </button>
                <button 
                  onClick={downloadHtmlFile}
                  className="btn btn-secondary"
                  style={{ gap: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
                >
                  📥 Download HTML
                </button>
              </div>

              {/* Primary rendered preview viewport */}
              <div className="article-preview-container">
                {activeTab === 'preview' ? (
                  <div 
                    className="article-preview-content"
                    dangerouslySetInnerHTML={{ __html: articleContent }} 
                  />
                ) : (
                  <pre style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: '0.825rem', 
                    color: 'var(--text-secondary)', 
                    whiteSpace: 'pre-wrap', 
                    wordBreak: 'break-all',
                    lineHeight: 1.6
                  }}>
                    {articleContent}
                  </pre>
                )}
              </div>

              {/* CMS Integration panel */}
              <div className="glass-panel" style={{ padding: '2rem', background: 'rgba(139,92,246,0.01)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.01em' }}>🔗 Step 4: Automated CMS Publishing</h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', opacity: 0.9 }}>
                  Push the generated article directly to WordPress REST API or Webflow CMS API as a draft, or trigger a simulated safe webhook callback.
                </p>

                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <CustomSelect 
                      label="Target CMS Platform"
                      value={selectedPlatform}
                      options={platformOptions}
                      onChange={setSelectedPlatform}
                    />
                  </div>
                  <button 
                    onClick={publishArticle} 
                    className="btn btn-primary"
                    style={{ whiteSpace: 'nowrap', height: '3.2rem', padding: '0 2rem' }}
                  >
                    🚀 Publish to Blog
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: CMS Publishing Progress Shimmer */}
          {loading && currentStep === 4 && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flex: 1, 
              textAlign: 'center',
              padding: '5rem 1rem'
            }}>
              <div className="shimmer" style={{ width: '70px', height: '70px', borderRadius: '12px', marginBottom: '2rem' }}></div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>🚀 Connecting to CMS Platform...</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', fontSize: '0.95rem', opacity: 0.9 }}>
                Transferring rich content payloads to the chosen CMS API. Verifying integrity.
              </p>
            </div>
          )}

          {/* STEP 4 (Completed): Publishing Success/Error Screen */}
          {publishResult && !loading && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flex: 1, 
              textAlign: 'center',
              padding: '4rem 2rem'
            }}>
              <div style={{ 
                width: '72px', 
                height: '72px', 
                borderRadius: '50%', 
                background: publishResult.success ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)', 
                border: `2px solid ${publishResult.success ? 'var(--success)' : 'var(--error)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.25rem',
                marginBottom: '2rem',
                color: publishResult.success ? 'var(--success)' : 'var(--error)',
                boxShadow: publishResult.success ? '0 0 20px -5px rgba(16, 185, 129, 0.4)' : 'none'
              }}>
                {publishResult.success ? '✓' : '✗'}
              </div>

              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
                {publishResult.success ? 'Successfully Published!' : 'Publishing Error'}
              </h3>
              
              <p style={{ color: 'var(--text-secondary)', maxWidth: '540px', fontSize: '0.98rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
                {publishResult.message}
              </p>

              {publishResult.success && publishResult.url && (
                <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <a 
                    href={publishResult.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn btn-primary"
                    style={{ gap: '0.5rem', height: '3rem', padding: '0 2rem' }}
                  >
                    View Published Article ↗
                  </a>
                  <button 
                    onClick={() => {
                      setCurrentStep(0);
                      setStepStatuses(['pending', 'pending', 'pending', 'pending']);
                      setPublishResult(null);
                      setArticleContent(null);
                      setOutline(null);
                      setKeyword('');
                    }}
                    className="btn btn-secondary"
                    style={{ height: '3rem', padding: '0 1.5rem' }}
                  >
                    Generate New Article
                  </button>
                </div>
              )}

              {!publishResult.success && (
                <button 
                  onClick={() => setPublishResult(null)} 
                  className="btn btn-primary"
                  style={{ height: '3rem', padding: '0 2rem' }}
                >
                  Go Back & Retry
                </button>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
