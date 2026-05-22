const fs = require('fs');
const file = '/Users/serhat/Desktop/YKS kopyası/panel/src/GuidanceCenter.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add states
content = content.replace(
  "const [searchTerm, setSearchTerm] = useState('');",
  `const [searchTerm, setSearchTerm] = useState('');
  const [postponeApptId, setPostponeApptId] = useState<number | null>(null);
  const [postponeDate, setPostponeDate] = useState('');
  const [postponeTime, setPostponeTime] = useState('10:00');`
);

// 2. Add handlePostpone
content = content.replace(
  "const handleUpdateAppointmentStatus = async (id: number, status: string) => {",
  `const handlePostpone = async () => {
    if (!postponeApptId || !postponeDate || !postponeTime) return;
    try {
      await api.postponeAppointment(postponeApptId, {
        newStartTime: \`\${postponeDate}T\${postponeTime}:00\`,
        note: 'Kullanıcı tarafından panelden ertelendi.'
      });
      showToast({ type: 'success', title: 'Başarılı', message: 'Randevu başarıyla ertelendi.' });
      setPostponeApptId(null);
      fetchAppointments();
    } catch (err) {
      showToast({ type: 'error', title: 'Hata', message: 'Randevu ertelenemedi.' });
    }
  };

  const handleUpdateAppointmentStatus = async (id: number, status: string) => {`
);

// 3. CSV export mapping
content = content.replace(
  "a.status === 'pending' ? 'Bekliyor' : a.status === 'completed' ? 'Tamamlandı' : a.status === 'absent' ? 'Gelmedi' : 'İptal'",
  "a.status === 'pending' ? 'Bekliyor' : a.status === 'completed' ? 'Tamamlandı' : a.status === 'absent' ? 'Gelmedi' : a.status === 'postponed' ? 'Ertelendi' : 'İptal'"
);

// 4. Status counts UI
content = content.replace(
  "{ label: 'Tamamlandı', value: appointments.filter(a => a.status === 'completed').length, color: '#10b981', bg: '#f0fdf4' },",
  `{ label: 'Tamamlandı', value: appointments.filter(a => a.status === 'completed').length, color: '#10b981', bg: '#f0fdf4' },
            { label: 'Ertelendi', value: appointments.filter(a => a.status === 'postponed').length, color: '#3b82f6', bg: '#eff6ff' },`
);

// 5. Filter UI
content = content.replace(
  "{ id: 'absent', label: 'Gelmedi', count: filteredBase.filter(a => a.status === 'absent').length }",
  `{ id: 'absent', label: 'Gelmedi', count: filteredBase.filter(a => a.status === 'absent').length },
                      { id: 'postponed', label: 'Ertelendi', count: filteredBase.filter(a => a.status === 'postponed').length }`
);

// 6. Border color
content = content.replace(
  "appt.status === 'absent' ? '#ef4444' : '#94a3b8'",
  "appt.status === 'absent' ? '#ef4444' : appt.status === 'postponed' ? '#3b82f6' : '#94a3b8'"
);

// 7. Buttons
content = content.replace(
  "<button onClick={() => handleUpdateAppointmentStatus(appt.id, 'completed')} style={{ flex: 1, padding: '4px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', color: '#166534', cursor: 'pointer' }}><CheckCircle2 size={12}/></button>",
  "<button title=\"Geldi\" onClick={() => handleUpdateAppointmentStatus(appt.id, 'completed')} style={{ flex: 1, padding: '4px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', color: '#166534', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}><CheckCircle2 size={12}/></button>"
);
content = content.replace(
  "<button onClick={() => handleUpdateAppointmentStatus(appt.id, 'absent')} style={{ flex: 1, padding: '4px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#991b1b', cursor: 'pointer' }}><XCircle size={12}/></button>",
  `<button title="Gelmedi" onClick={() => handleUpdateAppointmentStatus(appt.id, 'absent')} style={{ flex: 1, padding: '4px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#991b1b', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}><XCircle size={12}/></button>
                                      <button title="Ertele" onClick={() => setPostponeApptId(appt.id)} style={{ flex: 1, padding: '4px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', color: '#1d4ed8', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}><Clock size={12}/></button>`
);

// 8. Add modal at the very end just before AnimatePresence of Survey Result
const modalCode = `
      {/* Postpone Modal */}
      <AnimatePresence>
        {postponeApptId && (
          <div className="modal-overlay" onClick={() => setPostponeApptId(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="premium-card"
              style={{ padding: '2rem', width: '400px' }}
              onClick={e => e.stopPropagation()}
            >
              <h3 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Randevu Ertele</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', color: '#64748b' }}>YENİ TARİH</label>
                  <input type="date" className="premium-input" value={postponeDate} onChange={e => setPostponeDate(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', color: '#64748b' }}>YENİ SAAT</label>
                  <input type="time" className="premium-input" value={postponeTime} onChange={e => setPostponeTime(e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button onClick={() => setPostponeApptId(null)} className="premium-button-secondary" style={{ flex: 1 }}>İptal</button>
                <button onClick={handlePostpone} className="premium-button" style={{ flex: 1, background: '#3b82f6' }}>Ertele</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
`;
content = content.replace("{/* Survey Result Viewer Modal */}", modalCode + "\n      {/* Survey Result Viewer Modal */}");

fs.writeFileSync(file, content);
console.log('done');
