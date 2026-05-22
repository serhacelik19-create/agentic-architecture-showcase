function registerDashboardRoutes(app, deps) {
  const { prisma, aiService, authMiddleware, requireRole } = deps;

  app.get('/api/dashboard-stats', authMiddleware, requireRole('admin'), async (req, res) => {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

      const institutionWhere =
        req.user.role === 'super_admin' ? {} : { institutionId: req.user.institutionId };
      const analysisWhere =
        req.user.role === 'super_admin'
          ? {}
          : { student: { institutionId: req.user.institutionId } };

      const [
        totalCount,
        activeCount,
        avgProgressData,
        topWeeklyStats,
        tytCount,
        totalAnalyses,
        guidanceAlerts,
        dropStudentsDB,
        wrongTopicsData,
        hourlyData,
        heatmapRaw,
      ] = await Promise.all([
        prisma.student.count({ where: institutionWhere }),
        prisma.student.count({
          where: { ...institutionWhere, lastActiveAt: { gt: fiveMinutesAgo } },
        }),
        prisma.student.aggregate({ where: institutionWhere, _avg: { progress: true } }),
        prisma.dailyActivity.groupBy({
          by: ['studentId'],
          where: {
            date: { gte: sevenDaysAgoStr },
            student: institutionWhere,
          },
          _sum: { solvedCount: true },
          orderBy: { _sum: { solvedCount: 'desc' } },
          take: 1,
        }),
        prisma.questionAnalysis.count({
          where: {
            ...analysisWhere,
            OR: [
              { course: { contains: 'TYT', mode: 'insensitive' } },
              { course: { contains: 'tyt_', mode: 'insensitive' } },
              { course: { contains: 'Temel', mode: 'insensitive' } },
              { course: { contains: 'Türkçe', mode: 'insensitive' } },
              { course: { contains: 'Matematik', mode: 'insensitive' } },
              { course: { contains: 'Geometri', mode: 'insensitive' } },
              { course: { contains: 'Fizik', mode: 'insensitive' } },
              { course: { contains: 'Kimya', mode: 'insensitive' } },
              { course: { contains: 'Biyoloji', mode: 'insensitive' } },
              { course: { contains: 'Tarih', mode: 'insensitive' } },
              { course: { contains: 'Coğrafya', mode: 'insensitive' } },
              { course: { contains: 'Felsefe', mode: 'insensitive' } },
              { course: { contains: 'Din', mode: 'insensitive' } },
            ],
          },
        }),
        prisma.questionAnalysis.count({ where: analysisWhere }),
        prisma.guidanceAlert.findMany({
          where: { student: institutionWhere },
          include: { student: true },
          take: 20,
        }),
        prisma.dropStudent.findMany({
          where: { student: institutionWhere },
          include: { student: true },
          take: 10,
        }),
        prisma.questionAnalysis.groupBy({
          by: ['course'],
          where: analysisWhere,
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } },
          take: 10,
        }),
        prisma.activityLog.findMany({ where: institutionWhere }),
        req.user.role === 'super_admin'
          ? prisma.$queryRaw`
              SELECT
                CAST(EXTRACT(DOW FROM created_at + interval '6 days') AS INTEGER) % 7 as day,
                CAST(EXTRACT(HOUR FROM created_at) AS INTEGER) as hour,
                CAST(COUNT(*) AS INTEGER) as count
              FROM question_analyses
              GROUP BY day, hour
            `
          : prisma.$queryRaw`
              SELECT
                CAST(EXTRACT(DOW FROM qa.created_at + interval '6 days') AS INTEGER) % 7 as day,
                CAST(EXTRACT(HOUR FROM qa.created_at) AS INTEGER) as hour,
                CAST(COUNT(*) AS INTEGER) as count
              FROM question_analyses qa
              JOIN students s ON qa.student_id = s.id
              WHERE s.institution_id = ${Number(req.user.institutionId)}
              GROUP BY day, hour
            `,
      ]);

      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const [trendData, mostAskedData] = await Promise.all([
        prisma.questionAnalysis.groupBy({
          by: ['course'],
          where: { ...analysisWhere, createdAt: { gte: twentyFourHoursAgo } },
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } },
          take: 5,
        }),
        prisma.questionAnalysis.groupBy({
          by: ['topic'],
          where: { ...analysisWhere, createdAt: { gte: thirtyDaysAgo } },
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } },
          take: 5,
        }),
      ]);

      const trendSubject = trendData.length > 0 ? trendData[0].course : 'Veri Yok';
      const trendCount = trendData.length > 0 ? trendData[0]._count.id : 0;
      const mostAskedSubject = mostAskedData.length > 0 ? mostAskedData[0].topic : 'Veri Yok';

      let weeklyChampList = [];
      if (topWeeklyStats.length > 0) {
        const top5 = topWeeklyStats.slice(0, 5);
        weeklyChampList = await Promise.all(
          top5.map(async (stat) => {
            const student = await prisma.student.findUnique({
              where: { id: stat.studentId },
              select: { name: true },
            });
            return {
              name: student ? student.name : 'Bilinmeyen Öğrenci',
              count: stat._sum.solvedCount || 0,
            };
          }),
        );
      }

      if (weeklyChampList.length === 0) {
        const weeklyTopQA = await prisma.questionAnalysis.groupBy({
          by: ['studentId'],
          where: { ...analysisWhere, createdAt: { gte: sevenDaysAgo } },
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } },
          take: 5,
        });

        weeklyChampList = await Promise.all(
          weeklyTopQA.map(async (stat) => {
            const student = await prisma.student.findUnique({
              where: { id: stat.studentId },
              select: { name: true },
            });
            return {
              name: student ? student.name : 'Bilinmeyen Öğrenci',
              count: stat._count.id || 0,
            };
          }),
        );
      }

      const weeklyChamp = weeklyChampList.length > 0 ? weeklyChampList[0].name : 'Henüz Yok';
      const weeklyChampCount =
        weeklyChampList.length > 0 ? weeklyChampList[0].count.toString() : '0';

      let aytTotal = totalAnalyses - tytCount;
      let tytAytData;
      if (totalAnalyses === 0) {
        aytTotal = 35;
        tytAytData = [
          { name: 'TYT Soruları', value: 65, color: '#6366f1' },
          { name: 'AYT Soruları', value: aytTotal, color: '#a855f7' },
        ];
      } else {
        tytAytData = [
          { name: 'TYT Soruları', value: tytCount, color: '#6366f1' },
          { name: 'AYT Soruları', value: aytTotal, color: '#a855f7' },
        ];
      }

      const heatmapGrid = Array.from({ length: 7 }, () => Array(24).fill(0));
      let maxCount = 0;
      heatmapRaw.forEach((item) => {
        heatmapGrid[item.day][item.hour] = item.count;
        if (item.count > maxCount) maxCount = item.count;
      });
      const normalizedHeatmap = heatmapGrid.map((day) =>
        day.map((count) => (maxCount > 0 ? (count / maxCount) * 0.9 + 0.1 : 0.05)),
      );

      let finalDropStudents = [];
      if (dropStudentsDB && dropStudentsDB.length > 0) {
        finalDropStudents = dropStudentsDB.map((dropStudent) => ({
          name: dropStudent.student?.name || dropStudent.name,
          drop: dropStudent.dropRate,
          type: dropStudent.type,
        }));
      } else {
        const fourteenDaysAgoStr = new Date(
          Date.now() - 14 * 24 * 60 * 60 * 1000,
        )
          .toISOString()
          .split('T')[0];
        const last14DaysActivity = await prisma.dailyActivity.groupBy({
          by: ['studentId', 'date'],
          where: { student: institutionWhere, date: { gte: fourteenDaysAgoStr } },
          _sum: { solvedCount: true },
        });

        const studentStats = {};
        last14DaysActivity.forEach((activity) => {
          if (!studentStats[activity.studentId]) {
            studentStats[activity.studentId] = { curr: 0, prev: 0 };
          }
          if (activity.date >= sevenDaysAgoStr) {
            studentStats[activity.studentId].curr += activity._sum.solvedCount || 0;
          } else {
            studentStats[activity.studentId].prev += activity._sum.solvedCount || 0;
          }
        });

        let dynamicDrops = [];
        for (const [studentId, stats] of Object.entries(studentStats)) {
          if (stats.prev > 10) {
            const dropRate = ((stats.prev - stats.curr) / stats.prev) * 100;
            if (dropRate >= 30) {
              dynamicDrops.push({ id: parseInt(studentId, 10), drop: Math.round(dropRate) });
            }
          }
        }

        dynamicDrops.sort((a, b) => b.drop - a.drop);
        dynamicDrops = dynamicDrops.slice(0, 5);

        finalDropStudents = await Promise.all(
          dynamicDrops.map(async (dropStudent) => {
            const student = await prisma.student.findUnique({
              where: { id: dropStudent.id },
              select: { name: true },
            });
            return {
              name: student ? student.name : 'Bilinmeyen',
              drop: `-%${dropStudent.drop}`,
              type: 'Aktivite Düşüşü',
            };
          }),
        );

        if (finalDropStudents.length === 0) {
          finalDropStudents = [
            { name: 'Sistem İzleniyor', drop: '-', type: 'Yeterli düşüş saptanmadı' },
          ];
        }
      }

      res.json({
        total_students: totalCount.toString(),
        active_students: activeCount.toString(),
        trend_subject: trendSubject,
        trend_count: trendCount.toString(),
        trend_list: trendData.map((item) => ({ name: item.course, count: item._count.id })),
        most_asked_subject: mostAskedSubject,
        most_asked_list: mostAskedData.map((item) => ({
          name: item.topic,
          count: item._count.id,
        })),
        weekly_champ: weeklyChamp,
        weekly_champ_count: weeklyChampCount,
        weekly_champ_list: weeklyChampList,
        curriculum_progress: Math.round(avgProgressData._avg.progress || 0).toString(),
        hourlyData:
          hourlyData.length > 0
            ? hourlyData
            : [
                { hour: '08:00', questions: 12 },
                { hour: '12:00', questions: 45 },
                { hour: '16:00', questions: 32 },
                { hour: '20:00', questions: 68 },
                { hour: '00:00', questions: 15 },
              ],
        tytAytData,
        wrongTopicsData: wrongTopicsData.map((item) => ({
          course: item.course || 'Bilinmiyor',
          count: item._count.id || 0,
        })),
        heatmapData: normalizedHeatmap,
        dropStudents: finalDropStudents,
        guidanceAlerts: guidanceAlerts.map((alert) => ({
          student: alert.student?.name || alert.studentName,
          issue: alert.issue,
          priority: alert.priority,
        })),
      });
    } catch (err) {
      console.error('Dashboard Stats Error:', err);
      console.error('KURUM_HATA:', err);
      res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
  });

  app.get('/api/topics/errored', authMiddleware, requireRole('admin'), async (req, res) => {
    try {
      const where = req.user.role === 'super_admin' ? {} : { institutionId: req.user.institutionId };
      const students = await prisma.student.findMany({
        where,
        include: { exams: { orderBy: { date: 'desc' }, take: 3 } },
      });

      const sn = (v) => { const p = Number(v); return Number.isFinite(p) ? p : 0; };

      const subjectDefs = [
        { key: 'tytTur', dKey: 'tytTurD', yKey: 'tytTurY', label: 'TYT Türkçe', max: 40 },
        { key: 'tytMat', dKey: 'tytMatD', yKey: 'tytMatY', label: 'TYT Matematik', max: 40 },
        { key: 'tytFiz', dKey: 'tytFizD', yKey: 'tytFizY', label: 'TYT Fizik', max: 7 },
        { key: 'tytKim', dKey: 'tytKimD', yKey: 'tytKimY', label: 'TYT Kimya', max: 7 },
        { key: 'tytBiy', dKey: 'tytBiyD', yKey: 'tytBiyY', label: 'TYT Biyoloji', max: 6 },
        { key: 'tytTar', dKey: 'tytTarD', yKey: 'tytTarY', label: 'TYT Tarih', max: 5 },
        { key: 'tytCog', dKey: 'tytCogD', yKey: 'tytCogY', label: 'TYT Coğrafya', max: 5 },
        { key: 'aytMat', dKey: 'aytMatD', yKey: 'aytMatY', label: 'AYT Matematik', max: 40 },
        { key: 'aytFiz', dKey: 'aytFizD', yKey: 'aytFizY', label: 'AYT Fizik', max: 14 },
        { key: 'aytKim', dKey: 'aytKimD', yKey: 'aytKimY', label: 'AYT Kimya', max: 13 },
        { key: 'aytBiy', dKey: 'aytBiyD', yKey: 'aytBiyY', label: 'AYT Biyoloji', max: 13 },
      ];

      const subjectStats = {};
      for (const def of subjectDefs) {
        subjectStats[def.key] = { label: def.label, max: def.max, totalWrong: 0, totalAnswered: 0, affectedStudents: 0, examTrends: [] };
      }

      for (const student of students) {
        if (!student.exams || student.exams.length === 0) continue;
        const last3 = student.exams.slice(0, 3);
        for (const def of subjectDefs) {
          const wrongPerExam = last3.map(e => sn(e[def.yKey]));
          const totalW = wrongPerExam.reduce((s, v) => s + v, 0);
          const totalD = last3.reduce((s, e) => s + sn(e[def.dKey]), 0);
          const totalAnswered = totalD + totalW;
          if (totalAnswered > 0) {
            subjectStats[def.key].totalWrong += totalW;
            subjectStats[def.key].totalAnswered += totalAnswered;
            if (totalW > 0) subjectStats[def.key].affectedStudents += 1;
            subjectStats[def.key].examTrends.push(wrongPerExam);
          }
        }
      }

      const result = Object.values(subjectStats)
        .filter(s => s.totalAnswered > 0)
        .map(s => {
          const wrongRate = Math.round((s.totalWrong / s.totalAnswered) * 100);
          let trend = 'stable';
          if (s.examTrends.length >= 2) {
            const avgFirst = s.examTrends.reduce((sum, t) => sum + (t[t.length - 1] || 0), 0) / s.examTrends.length;
            const avgLast = s.examTrends.reduce((sum, t) => sum + (t[0] || 0), 0) / s.examTrends.length;
            if (avgLast > avgFirst + 0.3) trend = 'rising';
            else if (avgLast < avgFirst - 0.3) trend = 'falling';
          }
          return { course: s.label, rate: `%${wrongRate}`, affected: s.affectedStudents, trend };
        })
        .sort((a, b) => parseInt(b.rate.substring(1), 10) - parseInt(a.rate.substring(1), 10))
        .slice(0, 6);

      res.json(result);
    } catch (err) {
      console.error('KURUM_HATA:', err);
      res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
  });

  app.get('/api/correlation/intelligence', authMiddleware, requireRole('admin'), async (req, res) => {
    try {
      const where = req.user.role === 'super_admin' ? {} : { institutionId: req.user.institutionId };
      const sn = (v) => { const p = Number(v); return Number.isFinite(p) ? p : 0; };
      const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

      const students = await prisma.student.findMany({
        where,
        include: {
          exams: { orderBy: { date: 'desc' }, take: 3 },
          dailyActivities: { where: { date: { gte: sevenDaysAgoStr } } },
        },
      });

      if (students.length === 0) return res.json([]);

      const efficient = []; // soru çözüyor + net artıyor
      const inefficient = []; // soru çözüyor + net artmıyor
      const talented = []; // az soru + net artıyor
      const risk = []; // ne soru ne net

      const avgWeeklySolved = students.reduce((sum, s) => {
        const weeklyTotal = (s.dailyActivities || []).reduce((acc, d) => acc + sn(d.solvedCount), 0);
        return sum + weeklyTotal;
      }, 0) / Math.max(students.length, 1);

      students.forEach((student) => {
        const weeklySolved = (student.dailyActivities || []).reduce((acc, d) => acc + sn(d.solvedCount), 0);
        const isHighEffort = weeklySolved >= avgWeeklySolved;

        let netChange = 0;
        const exams = student.exams || [];
        if (exams.length >= 2) {
          const latest = sn(exams[0].tytNet) + sn(exams[0].aytNet);
          const oldest = sn(exams[exams.length - 1].tytNet) + sn(exams[exams.length - 1].aytNet);
          netChange = latest - oldest;
        }
        const isNetRising = netChange >= 2;

        const entry = { name: student.name, weeklySolved, netChange: Math.round(netChange * 10) / 10 };

        if (isHighEffort && isNetRising) efficient.push(entry);
        else if (isHighEffort && !isNetRising) inefficient.push(entry);
        else if (!isHighEffort && isNetRising) talented.push(entry);
        else risk.push(entry);
      });

      const data = [
        { name: 'Verimli Çalışan', value: efficient.length, color: '#10b981', desc: 'Hem soru çözüyor hem net artıyor', students: efficient },
        { name: 'Çok Çalışıp Az Kazanan', value: inefficient.length, color: '#f59e0b', desc: 'Soru çözüyor ama net artmıyor', students: inefficient },
        { name: 'Stratejik Çalışan', value: talented.length, color: '#6366f1', desc: 'Az soru ama net artıyor', students: talented },
        { name: 'Risk Grubu', value: risk.length, color: '#ef4444', desc: 'Ne soru çözüyor ne net artıyor', students: risk },
      ].filter(item => item.value > 0);

      const totalValue = data.reduce((sum, item) => sum + item.value, 0);
      const finalData = data.map(item => ({ ...item, percentage: Math.round((item.value / totalValue) * 100) }));

      res.json(finalData);
    } catch (err) {
      console.error('KURUM_HATA:', err);
      res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
  });

  app.get('/api/students/trending', authMiddleware, requireRole('admin'), async (req, res) => {
    try {
      const where = req.user.role === 'super_admin' ? {} : { institutionId: req.user.institutionId };
      const sn = (v) => { const p = Number(v); return Number.isFinite(p) ? p : 0; };
      const students = await prisma.student.findMany({
        where,
        include: { exams: { orderBy: { date: 'desc' }, take: 3 } },
      });

      const allTrends = students
        .filter(s => s.exams && s.exams.length >= 2)
        .map(student => {
          const exams = student.exams.slice().reverse(); // chronological
          const tytNets = exams.map(e => sn(e.tytNet));
          const aytNets = exams.map(e => sn(e.aytNet));
          const totalNets = exams.map(e => sn(e.tytNet) + sn(e.aytNet));

          const first = totalNets[0];
          const last = totalNets[totalNets.length - 1];
          const diff = last - first;

          // Momentum: compare 1→2 vs 2→3 acceleration
          let momentum = 'stable';
          if (totalNets.length >= 3) {
            const delta1 = totalNets[1] - totalNets[0];
            const delta2 = totalNets[2] - totalNets[1];
            if (delta2 > 0 && delta2 > delta1) momentum = 'accelerating_up';
            else if (delta2 > 0 && delta2 <= delta1) momentum = 'slowing_up';
            else if (delta2 < 0 && delta2 < delta1) momentum = 'accelerating_down';
            else if (delta2 < 0 && delta2 >= delta1) momentum = 'slowing_down';
          } else if (diff > 0) {
            momentum = 'up';
          } else if (diff < 0) {
            momentum = 'down';
          }

          return {
            id: student.id, name: student.name, class: student.class,
            tytNets, aytNets, totalNets,
            lastNet: last, diff: Math.round(diff * 10) / 10, momentum,
            change: `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}`
          };
        })
        .sort((a, b) => b.diff - a.diff);

      res.json({
        rising: allTrends.filter(s => s.diff > 0).slice(0, 5),
        falling: allTrends.filter(s => s.diff < 0).sort((a, b) => a.diff - b.diff).slice(0, 5),
      });
    } catch (err) {
      console.error('KURUM_HATA:', err);
      res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
  });

  app.get('/api/ai-summary', authMiddleware, requireRole('admin'), async (req, res) => {
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

      const strongestText = subjectAvgs.slice(0, 3).map(s => `${s.name}: ${s.avg.toFixed(1)}`).join(', ');
      const weakestText = subjectAvgs.slice(-3).reverse().map(s => `${s.name}: ${s.avg.toFixed(1)}`).join(', ');

      const blindSpotItems = subjects.map(sub => {
        const vals = withExams.filter(s => s.exams[0]).map(s => sn(s.exams[0][sub.key]));
        if (vals.length === 0) return null;
        const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
        const belowAvg = vals.filter(v => v < avg).length;
        return { name: sub.name, pctBelow: Math.round((belowAvg / vals.length) * 100) };
      }).filter(Boolean).sort((a, b) => b.pctBelow - a.pctBelow);
      const blindSpotText = blindSpotItems.slice(0, 5).map(s => `${s.name}: %${s.pctBelow} ortalamanin altinda`).join(' | ');

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
      const efficiencyText = `Haftalik ortalama ${avgWeeklySolved} soru, deneme basina net degisimi: ${avgNetChange}`;

      const momentumItems = subjects.map(sub => {
        const rounds = [0, 1, 2].map(i => {
          const vals = withExams.filter(s => s.exams[i]).map(s => sn(s.exams[i][sub.key]));
          return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
        }).filter(v => v !== null);
        if (rounds.length < 2) return null;
        const diff = rounds[0] - rounds[rounds.length - 1];
        let dir = 'stable';
        if (diff > 0.5) dir = 'up'; else if (diff < -0.5) dir = 'down';
        return `${sub.name}: ${dir} (${diff >= 0 ? '+' : ''}${diff.toFixed(1)})`;
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
  });
}

module.exports = { registerDashboardRoutes };
