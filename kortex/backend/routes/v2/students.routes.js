function registerStudentRoutes(app, deps) {
  const {
    prisma,
    bcrypt,
    authMiddleware,
    requireRole,
    studentScopeGuard,
    generateStudentUsername,
  } = deps;

  app.get('/api/students', authMiddleware, requireRole('admin', 'super_admin'), async (req, res) => {
    try {
      const where =
        req.user.role === 'super_admin' ? {} : { institutionId: req.user.institutionId };

      const studentsRaw = await prisma.student.findMany({
        where,
        select: {
          id: true,
          name: true,
          class: true,
          target: true,
          progress: true,
          solvedCount: true,
          lastSeen: true,
          lastActiveAt: true,
          trend: true,
          username: true,
          studentNumber: true,
          branch: true,
          reportStatus: true,
          lastReport: true,
          parentName: true,
          parentPhone: true,
          onboardingComplete: true,
          aiStressLevel: true,
          aiStressComment: true,
          aiComment: true,
          aiStreak: true,
          aiHardTopics: true,
          aiExamReport: true,
          aiTargetAnalysis: true,
          aiNetAnalysis: true,
          goalUniversity: true,
          goalScore: true,
          examDate: true,
          unlockedAchievements: true,
          institutionId: true,
          institution: {
            select: {
              id: true,
              name: true,
              slug: true,
              status: true,
            },
          },
          password: true,
        },
      });

      const students = studentsRaw.map(({ password, ...student }) => ({
        ...student,
        hasPassword: Boolean(password),
      }));
      res.json(students);
    } catch (err) {
      console.error('KURUM_HATA:', err);
      res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
  });

  app.post('/api/students/:id/sync', authMiddleware, studentScopeGuard, async (req, res) => {
    const { id } = req.params;
    const { solvedCount, progress, lastSeen, onboardingComplete, streak } = req.body;

    try {
      await prisma.student.update({
        where: { id: parseInt(id, 10) },
        data: {
          solvedCount: solvedCount !== undefined ? solvedCount : undefined,
          aiStreak: streak !== undefined ? streak : undefined,
          lastSeen: lastSeen !== undefined ? lastSeen : 'Şimdi',
          onboardingComplete:
            onboardingComplete !== undefined ? onboardingComplete : undefined,
          lastActiveAt: new Date(),
        },
      });
      res.json({ success: true });
    } catch (err) {
      console.error('KURUM_HATA:', err);
      res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
  });

  app.post('/api/students/:id/ai-analysis', authMiddleware, studentScopeGuard, async (req, res) => {
    const { id } = req.params;
    const { course, topic, subtopic, difficulty } = req.body;

    try {
      const analysis = await prisma.questionAnalysis.create({
        data: {
          studentId: parseInt(id, 10),
          course,
          topic,
          subtopic,
          difficulty,
        },
      });

      await prisma.student.update({
        where: { id: parseInt(id, 10) },
        data: { lastActiveAt: new Date() },
      });

      res.json({ success: true, analysis });
    } catch (err) {
      console.error('KURUM_HATA:', err);
      res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
  });

  app.get('/api/students/:id/exams', authMiddleware, studentScopeGuard, async (req, res) => {
    const exams = await prisma.exam.findMany({
      where: { studentId: parseInt(req.params.id, 10) },
    });
    res.json(exams);
  });

  app.post('/api/students', authMiddleware, requireRole('admin'), async (req, res) => {
    const {
      name,
      class: studentClass,
      target,
      progress,
      password,
      parentName,
      parentPhone,
    } = req.body;

    try {
      const institutionIdRaw =
        req.user.role === 'super_admin'
          ? req.body.institutionId
          : req.user.institutionId;
      const institutionId = parseInt(institutionIdRaw, 10);
      if (!institutionIdRaw || Number.isNaN(institutionId)) {
        return res
          .status(400)
          .json({ error: 'Öğrenci oluşturmak için kurum bilgisi zorunludur.' });
      }

      const student = await prisma.$transaction(async (tx) => {
        const generatedUsername = await generateStudentUsername(tx, institutionId);
        const hashedPassword = password ? await bcrypt.hash(password, 10) : '';

        return tx.student.create({
          data: {
            name,
            studentNumber: req.body.studentNumber || null,
            class: studentClass,
            target: target || '',
            progress: progress || 0,
            xp: 0,
            username: generatedUsername,
            password: hashedPassword,
            parentName: parentName || null,
            parentPhone: parentPhone || null,
            institutionId,
          },
        });
      });

      const { password: _password, ...safeStudent } = student;
      res.json({ ...safeStudent, generatedUsername: student.username });
    } catch (err) {
      console.error('KURUM_HATA:', err);
      res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
  });

  app.put('/api/students/:id', authMiddleware, requireRole('admin'), async (req, res) => {
    const {
      name,
      class: studentClass,
      target,
      progress,
      username,
      password,
      parentName,
      parentPhone,
    } = req.body;
    const studentId = parseInt(req.params.id, 10);

    try {
      const existingStudent = await prisma.student.findUnique({ where: { id: studentId } });
      if (
        !existingStudent ||
        (req.user.role !== 'super_admin' &&
          existingStudent.institutionId !== req.user.institutionId)
      ) {
        return res.status(403).json({ error: 'Bu öğrenciyi güncelleme yetkiniz yok.' });
      }
      if (username !== undefined && username !== existingStudent.username) {
        return res.status(400).json({
          error: 'Kullanıcı adı manuel değiştirilemez. Sistem tarafından otomatik üretilir.',
        });
      }

      const updateFields = {
        name,
        studentNumber: req.body.studentNumber || undefined,
        class: studentClass,
        target: target || '',
        progress: progress || 0,
        parentName: parentName !== undefined ? parentName : undefined,
        parentPhone: parentPhone !== undefined ? parentPhone : undefined,
      };

      if (typeof password === 'string' && password.length > 0) {
        updateFields.password = await bcrypt.hash(password, 10);
        if (!existingStudent.username) {
          if (!existingStudent.institutionId) {
            return res.status(400).json({
              error: 'Öğrenciye bağlı kurum bilgisi eksik. Kullanıcı adı üretilemedi.',
            });
          }
          const generatedUsername = await prisma.$transaction((tx) =>
            generateStudentUsername(tx, existingStudent.institutionId),
          );
          updateFields.username = generatedUsername;
        }
      } else if (password === '') {
        updateFields.password = '';
      }

      await prisma.student.update({
        where: { id: studentId },
        data: updateFields,
      });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
  });

  app.delete('/api/students/:id', authMiddleware, requireRole('admin'), async (req, res) => {
    const studentId = parseInt(req.params.id, 10);
    try {
      const existingStudent = await prisma.student.findUnique({ where: { id: studentId } });
      if (
        !existingStudent ||
        (req.user.role !== 'super_admin' &&
          existingStudent.institutionId !== req.user.institutionId)
      ) {
        return res.status(403).json({ error: 'Bu öğrenciyi silme yetkiniz yok.' });
      }

      await prisma.exam.deleteMany({ where: { studentId } });
      await prisma.student.delete({ where: { id: studentId } });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
  });
}

module.exports = { registerStudentRoutes };
