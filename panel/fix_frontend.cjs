const fs = require('fs');
const file = '/Users/serhat/Desktop/YKS kopyası/panel/src/ExamCenter.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Replace state types - aiSummary from string to any
content = content.replace(
  "const [aiSummary, setAiSummary] = useState<string>('');",
  "const [aiSummary, setAiSummary] = useState<any>(null);"
);

// 2. Update refreshAiSummary to handle JSON
content = content.replace(
  ".then(res => setAiSummary(res.summary))",
  ".then(res => setAiSummary(res.summary))"
);

// 3. Replace the AI Analysis Hub card + dashboard-grid with new cards
const oldAIHubStart = `{/* AI Analysis Hub */}`;
const oldGridEnd = `</div>

            {/* Create Exam Modal */}`;

const startIdx = content.indexOf(oldAIHubStart);
const endIdx = content.indexOf(oldGridEnd);

if (startIdx === -1 || endIdx === -1) {
  console.log('Cannot find markers', startIdx, endIdx);
  process.exit(1);
}

const newUI = `{/* Kurum Performans Analizi */}
                {/* Health Score Banner */}
                {aiSummary && aiSummary.healthScore && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card" style={{
                    marginBottom: '1.5rem', padding: '1.75rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{
                                width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: \`conic-gradient(\${(aiSummary.healthScore.total || 0) >= 70 ? '#10b981' : (aiSummary.healthScore.total || 0) >= 50 ? '#f59e0b' : '#ef4444'} \${(aiSummary.healthScore.total || 0) * 3.6}deg, rgba(255,255,255,0.1) 0deg)\`,
                                fontSize: '1.5rem', fontWeight: 900
                            }}>
                                <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {aiSummary.healthScore.total || 0}
                                </div>
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Kurum Sağlık Skoru</h3>
                                <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '4px' }}>Son 3 deneme verisi</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {[
                                { label: 'Katılım', value: aiSummary.healthScore.participation || 0, color: '#3b82f6' },
                                { label: 'Net Trendi', value: aiSummary.healthScore.netTrend || 0, color: '#10b981' },
                                { label: 'Tutarlılık', value: aiSummary.healthScore.consistency || 0, color: '#8b5cf6' },
                                { label: 'Verimlilik', value: aiSummary.healthScore.efficiency || 0, color: '#f59e0b' },
                            ].map((item, i) => (
                                <div key={i} style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: item.color }}>{item.value}</div>
                                    <div style={{ fontSize: '0.65rem', opacity: 0.6, fontWeight: 700 }}>{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', borderRadius: '50%' }}></div>
                </motion.div>
                )}

                {/* AI Refresh Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                    <button
                        onClick={refreshAiSummary}
                        disabled={isAiLoading}
                        className={\`ai-refresh-btn \${isAiLoading ? 'loading' : ''}\`}
                    >
                        <Zap size={16} fill={isAiLoading ? 'none' : 'currentColor'} />
                        <span>{isAiLoading ? 'Analiz Ediliyor...' : 'AI Analizini Yenile'}</span>
                    </button>
                </div>

                {/* Insight Cards Grid */}
                <div className="dashboard-grid">
                    {/* Kör Nokta */}
                    <div className="premium-card col-span-4" style={{ padding: '1.5rem', borderLeft: '4px solid #ef4444' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <AlertCircle size={18} />
                            </div>
                            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>Kör Nokta Tespiti</h4>
                        </div>
                        {isAiLoading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ height: 12, background: '#f1f5f9', borderRadius: 6, width: '90%' }} className="shimmer"></div>
                                <div style={{ height: 12, background: '#f1f5f9', borderRadius: 6, width: '70%' }} className="shimmer"></div>
                            </div>
                        ) : (
                            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: '#475569', margin: 0, fontWeight: 500 }}>
                                {aiSummary?.blindSpot || 'Analiz bekleniyor...'}
                            </p>
                        )}
                    </div>

                    {/* Verimlilik */}
                    <div className="premium-card col-span-4" style={{ padding: '1.5rem', borderLeft: '4px solid #8b5cf6' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Zap size={18} />
                            </div>
                            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>Verimlilik Analizi</h4>
                        </div>
                        {isAiLoading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ height: 12, background: '#f1f5f9', borderRadius: 6, width: '85%' }} className="shimmer"></div>
                                <div style={{ height: 12, background: '#f1f5f9', borderRadius: 6, width: '65%' }} className="shimmer"></div>
                            </div>
                        ) : (
                            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: '#475569', margin: 0, fontWeight: 500 }}>
                                {aiSummary?.efficiencyInsight || 'Analiz bekleniyor...'}
                            </p>
                        )}
                    </div>

                    {/* En Yüksek Getirili Müdahale */}
                    <div className="premium-card col-span-4" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <TrendingUp size={18} />
                            </div>
                            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>En Yüksek Getirili Müdahale</h4>
                        </div>
                        {isAiLoading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ height: 12, background: '#f1f5f9', borderRadius: 6, width: '80%' }} className="shimmer"></div>
                                <div style={{ height: 12, background: '#f1f5f9', borderRadius: 6, width: '60%' }} className="shimmer"></div>
                            </div>
                        ) : (
                            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: '#475569', margin: 0, fontWeight: 500 }}>
                                {aiSummary?.highestROI || 'Analiz bekleniyor...'}
                            </p>
                        )}
                    </div>

                    {/* Momentum Raporu */}
                    <div className="premium-card col-span-6" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <BarChart size={18} />
                            </div>
                            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>Momentum Raporu</h4>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {aiSummary?.momentum && aiSummary.momentum.length > 0 ? (
                                aiSummary.momentum.map((item: any, i: number) => (
                                    <div key={i} style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '0.65rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9'
                                    }}>
                                        <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>{item.subject}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '0.85rem' }}>
                                                {item.direction === 'up' ? '▲'.repeat(Math.min(item.intensity || 1, 3)) : item.direction === 'down' ? '▼'.repeat(Math.min(item.intensity || 1, 3)) : '━'}
                                            </span>
                                            <span style={{
                                                padding: '2px 8px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800,
                                                background: item.direction === 'up' ? 'rgba(16,185,129,0.1)' : item.direction === 'down' ? 'rgba(239,68,68,0.1)' : '#f1f5f9',
                                                color: item.direction === 'up' ? '#10b981' : item.direction === 'down' ? '#ef4444' : '#64748b'
                                            }}>
                                                {item.note}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="premium-empty-state" style={{ padding: '2rem' }}>
                                    <BarChart size={24} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                                    <p style={{ fontSize: '0.8rem' }}>Analizi yenileyin</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Kritik Ders Hataları - Son 3 Deneme */}
                    <div className="premium-card col-span-6" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <AlertCircle size={18} />
                            </div>
                            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>Kritik Ders Hataları</h4>
                            <span style={{ fontSize: '0.65rem', background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, color: '#64748b' }}>Son 3 Deneme</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {erroredCourses.length === 0 ? (
                                <div className="premium-empty-state" style={{ padding: '2rem 1rem' }}>
                                    <AlertCircle size={24} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                                    <p style={{ fontSize: '0.8rem' }}>Analiz edilecek veri yok</p>
                                </div>
                            ) : (
                                erroredCourses.map((item: any, i: number) => (
                                    <div key={i} style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '0.65rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>{item.course}</span>
                                            {item.affected && <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>{item.affected} öğrenci</span>}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ padding: '2px 8px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontSize: '0.72rem', fontWeight: 800 }}>{item.rate}</span>
                                            {item.trend && item.trend !== 'stable' && (
                                                <span style={{ fontSize: '0.7rem', color: item.trend === 'rising' ? '#ef4444' : '#10b981' }}>
                                                    {item.trend === 'rising' ? '↑ Artıyor' : '↓ Azalıyor'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Verimlilik Matrisi (Pie Chart) */}
                    <div className="premium-card col-span-6" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(99,102,241,0.1)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <BarChart size={18} />
                                </div>
                                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>Verimlilik Matrisi</h4>
                            </div>
                            <button onClick={() => setIsCorrelationExpanded(!isCorrelationExpanded)} style={{ background: '#f1f5f9', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 800, padding: '0.4rem 0.75rem', borderRadius: '8px' }}>
                                {isCorrelationExpanded ? 'Grafiği Göster' : 'Listeyi Göster'}
                            </button>
                        </div>
                        {correlationData.length === 0 ? (
                            <div className="premium-empty-state" style={{ padding: '3rem' }}>
                                <BarChart size={32} style={{ opacity: 0.2, marginBottom: '0.75rem' }} />
                                <p>Yeterli deneme verisi girilmemiş.</p>
                            </div>
                        ) : (
                            <div>
                                {!isCorrelationExpanded ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem', alignItems: 'center' }}>
                                        <div style={{ height: '180px' }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={correlationData} innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="value">
                                                        {correlationData.map((entry: any, index: number) => <Cell key={index} fill={entry.color} />)}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                            {correlationData.map((item: any, i: number) => (
                                                <div key={i} style={{ padding: '0.6rem', background: 'white', border: \`1px solid \${item.color}20\`, borderRadius: '12px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
                                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }}></div>
                                                        <span style={{ fontWeight: 800, fontSize: '0.72rem' }}>%{item.percentage}</span>
                                                    </div>
                                                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#1e293b' }}>{item.name}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                                        {correlationData.map((category: any, idx: number) => (
                                            <div key={idx} style={{ background: '#f8fafc', borderRadius: '14px', padding: '0.85rem', border: \`1px solid \${category.color}20\` }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.6rem', paddingBottom: '0.4rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                                    <span style={{ fontWeight: 800, fontSize: '0.72rem', color: category.color }}>{category.name}</span>
                                                    <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>({category.value})</span>
                                                </div>
                                                <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                    {category.students && category.students.length > 0 ? (
                                                        category.students.map((st: any, sIdx: number) => (
                                                            <div key={sIdx} style={{ fontSize: '0.68rem', fontWeight: 600, padding: '0.2rem 0.4rem', background: 'white', borderRadius: '6px' }}>{st.name}</div>
                                                        ))
                                                    ) : (
                                                        <div style={{ fontSize: '0.65rem', opacity: 0.5 }}>Öğrenci bulunmuyor</div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Yükselen Öğrenciler */}
                    <div className="premium-card col-span-6" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <TrendingUp size={18} />
                            </div>
                            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>En Yüksek Artış</h4>
                            <span style={{ fontSize: '0.65rem', background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, color: '#64748b' }}>Son 3 Deneme</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {trendingData.rising && trendingData.rising.map((s: any, i: number) => (
                                <div key={i} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '14px', border: '1px solid #f1f5f9'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: 28, height: 28, background: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', fontWeight: 900, fontSize: '0.75rem', border: '1px solid #f1f5f9' }}>{i + 1}</div>
                                        <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>{s.name}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        {s.totalNets && <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>{s.totalNets.join(' → ')}</span>}
                                        <span style={{ padding: '2px 8px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: '0.72rem', fontWeight: 800 }}>{s.change}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>`;

content = content.substring(0, startIdx) + newUI + content.substring(endIdx);

// 4. Update labels
content = content.replace(
  "Kurum geneli başarı takibi, yapay zeka destekli gelişim analizi ve PDF tabanlı ödev yönetimi.",
  "Kurum geneli başarı takibi, AI destekli performans analizi ve PDF tabanlı ödev yönetimi."
);
content = content.replace("📊 Analizler", "📊 Performans Analizi");

fs.writeFileSync(file, content);
console.log('done - frontend rewritten');
