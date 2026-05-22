function registerAppointmentRoutes(app, deps) {
  const { prisma, authMiddleware, requireRole, studentScopeGuard } = deps;

  // Randevuları listele
  app.get('/api/appointments', authMiddleware, async (req, res) => {
    try {
      const { studentId, teacherId, status } = req.query;
      const where = {
        institutionId: req.user.role === 'super_admin' ? undefined : req.user.institutionId,
      };

      if (req.user.role === 'student') {
        where.studentId = req.user.id;
      } else if (studentId) {
        where.studentId = parseInt(studentId, 10);
      }

      if (teacherId) {
        where.teacherId = parseInt(teacherId, 10);
      }

      if (status) {
        where.status = status;
      }

      const appointments = await prisma.appointment.findMany({
        where,
        include: {
          student: { select: { id: true, name: true, class: true } },
          teacher: { select: { id: true, name: true } },
        },
        orderBy: { startTime: 'asc' },
      });

      res.json(appointments);
    } catch (err) {
      console.error('APPOINTMENT_GET_ERROR:', err);
      res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
  });

  // Yeni randevu oluştur (Hoca/Admin)
  app.post('/api/appointments', authMiddleware, requireRole('admin', 'teacher'), async (req, res) => {
    const { studentId, startTime, endTime, title, note } = req.body;

    try {
      const appointment = await prisma.appointment.create({
        data: {
          studentId: parseInt(studentId, 10),
          teacherId: req.user.id,
          institutionId: req.user.institutionId,
          startTime: new Date(startTime),
          endTime: endTime ? new Date(endTime) : null,
          title,
          note,
          status: 'pending',
        },
      });

      res.json(appointment);
    } catch (err) {
      console.error('APPOINTMENT_CREATE_ERROR:', err);
      res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
  });

  // Randevu güncelle (Durum vs.)
  app.put('/api/appointments/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { status, note, startTime, endTime, title } = req.body;

    try {
      const existing = await prisma.appointment.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!existing) return res.status(404).json({ error: 'Randevu bulunamadı.' });

      // Yetki kontrolü
      if (req.user.role !== 'super_admin' && existing.institutionId !== req.user.institutionId) {
        return res.status(403).json({ error: 'Yetkiniz yok.' });
      }

      const appointment = await prisma.appointment.update({
        where: { id: parseInt(id, 10) },
        data: {
          status: status || undefined,
          note: note !== undefined ? note : undefined,
          startTime: startTime ? new Date(startTime) : undefined,
          endTime: endTime ? new Date(endTime) : undefined,
          title: title || undefined,
        },
      });

      res.json(appointment);
    } catch (err) {
      console.error('APPOINTMENT_UPDATE_ERROR:', err);
      res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
  });

  // Randevu sil
  app.delete('/api/appointments/:id', authMiddleware, requireRole('admin', 'teacher'), async (req, res) => {
    const { id } = req.params;

    try {
      const existing = await prisma.appointment.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!existing) return res.status(404).json({ error: 'Randevu bulunamadı.' });

      if (req.user.role !== 'super_admin' && existing.institutionId !== req.user.institutionId) {
        return res.status(403).json({ error: 'Yetkiniz yok.' });
      }

      await prisma.appointment.delete({
        where: { id: parseInt(id, 10) },
      });

      res.json({ success: true });
    } catch (err) {
      console.error('APPOINTMENT_DELETE_ERROR:', err);
      res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
  });
}

module.exports = { registerAppointmentRoutes };
