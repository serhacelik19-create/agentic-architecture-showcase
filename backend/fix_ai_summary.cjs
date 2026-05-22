const fs = require('fs');
const file = '/Users/serhat/Desktop/YKS kopyası/backend/routes/dashboard.routes.js';
let content = fs.readFileSync(file, 'utf8');

const oldBlock = `  app.get('/api/ai-summary', authMiddleware, requireRole('admin'), async (req, res) => {
    try {
      const where = req.user.role === 'super_admin' ? {} : { institutionId: req.user.institutionId };
      const sn = (v) => { const p = Number(v); return Number.isFinite(p) ? p : 0; };
      const subjects = [`;

const newEndpoint = `  app.get('/api/ai-summary', authMiddleware, requireRole('admin'), async (req, res) => {
    try {
      const where = req.user.role === 'super_admin' ? {} : { institutionId: req.user.institutionId };
      const sn = (v) => { const p = Number(v); return Number.isFinite(p) ? p : 0; };

      const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

      const [studentIds, allStudents] = await Promise.all([
        prisma.student.findMany({ where, select: { id: true } }),
        prisma.student.findMany({
          where,
          include: {
            exams: { orderBy: { date: 'desc' }, take: 3 },
            dailyActivities: { where: { date: { gte: sevenDaysAgoStr } } },
          },
        }),
      ]);

      if (studentIds.length === 0) {
        return res.json({ summary: { healthScore: { total: 0 }, blindSpot: 'Henüz öğrenci verisi bulunmuyor.', efficiencyInsight: '', highestROI: '', momentum: [] } });
      }

      const subjects = [
        { name: 'TYT Türkçe', key: 'tytTur' }, { name: 'TYT Mat', key: 'tytMat' },
        { name: 'TYT Fizik', key: 'tytFiz' }, { name: 'TYT Kimya', key: 'tytKim' },
        { name: 'TYT Biyoloji', key: 'tytBiy' }, { name: 'TYT Tarih', key: 'tytTar' },
        { name: 'AYT Mat', key: 'aytMat' }, { name: 'AYT Fizik', key: 'aytFiz' },
        { name: 'AYT Kimya', key: 'aytKim' }, { name: 'AYT Biyoloji', key: 'aytBiy' },
      ];

      const withExams = allStudents.filter(s => s.exams && s.exams.length >= 2);
      const participantCount = withExams.length;

      const tytPerRound = [0, 1, 2].map(i => {
        const vals = withExams.filter(s => s.exams[i]).map(s => sn(s.exams[i].tytNet));
        return vals.length > 0 ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : null;
      }).filter(Boolean);

      const aytPerRound = [0, 1, 2].map(i => {
        const vals = withExams.filter(s => s.exams[i]).map(s => sn(s.exams[i].aytNet));
        return vals.length > 0 ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : null;
      }).filter(Boolean);

      const subjectAvgs = subjects.map(sub => {
        const vals = withExams.filter(s => s.exams[0]).map(s => sn(s.exams[0][sub.key]));
        const avg = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
        return { name: sub.name, avg };
      }).filter(s => s.avg > 0).sort((a, b) => b.avg - a.avg);

      const strongestText = subjectAvgs.slice(0, 3).map(s => \`\${s.name}: \${s.avg.toFixed(1)}\`).join(', ');
      const weakestText = subjectAvgs.slice(-3).reverse().map(s => \`\${s.name}: \${s.avg.toFixed(1)}\`).join(', ');

      const blindSpotItems = subjects.map(sub => {
        const vals = withExams.filter(s => s.exams[0]).map(s => sn(s.exams[0][sub.key]));
        if (vals.length === 0) return null;
        const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
        const belowAvg = vals.filter(v => v < avg).length;
        return { name: sub.name, pctBelow: Math.round((belowAvg / vals.length) * 100) };
      }).filter(Boolean).sort((a, b) => b.pctBelow - a.pctBelow);
      const blindSpotText = blindSpotItems.slice(0, 5).map(s => \`\${s.name}: %\${s.pctBelow} ortalamanin altinda\`).join(' | ');

      const totalWeeklySolved = allStudents.reduce((sum, s) => sum + (s.dailyActivities || []).reduce((acc, d) => acc + sn(d.solvedCount), 0), 0);
      const avgWeeklySolved = Math.round(totalWeeklySolved / Math.max(allStudents.length, 1));
      let avgNetChange = 0;
      if (withExams.length > 0) {
        const totalNetChange = withExams.reduce((sum, s) => {
          const latest = sn(s.exams[0].tytNet) + sn(s.exams[0].aytNet);
          const oldest = sn(s.exams[s.exams.length - 1].tytNet) + sn(s.exams[s.exams.length - 1].aytNet);
          return sum + (latest - oldest);
        }, 0);
        avgNetChange = (totalNetChange / withExams.length).toFixed(1);
      }
      const efficiencyText = \`Haftalik ortalama \${avgWeeklySolved} soru, deneme basina net degisimi: \${avgNetChange}\`;

      const momentumItems = subjects.map(sub => {
        const rounds = [0, 1, 2].map(i => {
          const vals = withExams.filter(s => s.exams[i]).map(s => sn(s.exams[i][sub.key]));
          return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
        }).filter(v => v !== null);
        if (rounds.length < 2) return null;
        const diff = rounds[0] - rounds[rounds.length - 1];
        let dir = 'stable';
        if (diff > 0.5) dir = 'up'; else if (diff < -0.5) dir = 'down';
        return \`\${sub.name}: \${dir} (\${diff >= 0 ? '+' : ''}\${diff.toFixed(1)})\`;
      }).filter(Boolean);
      const momentumText = momentumItems.join(' | ');

      let risingTyt = 0, fallingTyt = 0, risingAyt = 0, fallingAyt = 0, sharpDrop = 0;
      withExams.forEach(s => {
        const tD = sn(s.exams[0].tytNet) - sn(s.exams[s.exams.length - 1].tytNet);
        const aD = sn(s.exams[0].aytNet) - sn(s.exams[s.exams.length - 1].aytNet);
        if (tD >= 3) risingTyt++; if (tD <= -3) fallingTyt++;
        if (aD >= 3) risingAyt++; if (aD <= -3) fallingAyt++;
        if (tD <= -8 || aD <= -8) sharpDrop++;
      });

      const participationRate = studentIds.length > 0 ? Math.round((participantCount / studentIds.length) * 100) : 0;

      const summary = await aiService.generateDashboardSummary({
        totalStudents: studentIds.length,
        currentParticipants: participantCount,
        examParticipationRate: participationRate,
        previousParticipationRate: participationRate,
        tytAverages: tytPerRound.reverse().join(' → '),
        aytAverages: aytPerRound.reverse().join(' → '),
        strongestSubjectsText: strongestText,
        weakestSubjectsText: weakestText,
        risingTytStudents: risingTyt,
        fallingTytStudents: fallingTyt,
        risingAytStudents: risingAyt,
        fallingAytStudents: fallingAyt,
        sharpDropStudents: sharpDrop,
        blindSpotData: blindSpotText,
        efficiencyData: efficiencyText,
        momentumData: momentumText,
      });

      res.json({ summary });
    } catch (err) {
      console.error('KURUM_HATA:', err);
      res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
  });`;

// Find the old ai-summary block and replace it
const startMarker = "  app.get('/api/ai-summary'";
const endMarker = "\n}\n\nmodule.exports";

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.log('Markers not found!', startIdx, endIdx);
  process.exit(1);
}

content = content.substring(0, startIdx) + newEndpoint + content.substring(endIdx);
fs.writeFileSync(file, content);
console.log('done - ai-summary rewritten');
