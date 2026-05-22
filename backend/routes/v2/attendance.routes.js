const { sendError } = require('../utils/errorHandler');

function registerAttendanceRoutes(app, deps) {
  const {
    prisma,
    authMiddleware,
    requireRole,
    studentScopeGuard,
  } = deps;

  app.get('/api/attendance', authMiddleware, requireRole('admin', 'teacher'), async (req, res) => {
    const { date } = req.query;
    try {
      const targetDate = date ? new Date(date) : new Date();
      targetDate.setHours(0, 0, 0, 0);

      const students = await prisma.student.findMany({
        where: { institutionId: req.user.institutionId },
        select: {
          id: true,
          name: true,
          class: true,
          parentName: true,
          parentPhone: true,
        },
      });

      const attendances = await prisma.attendance.findMany({
        where: {
          institutionId: req.user.institutionId,
          date: targetDate,
        },
      });

      const result = students.map((student) => {
        const attendance = attendances.find((item) => item.studentId === student.id);
        return {
          ...student,
          status: attendance ? attendance.status : null,
        };
      });

      res.json(result);
    } catch (err) {
      sendError(res, err);
    }
  });

  app.post('/api/attendance', authMiddleware, requireRole('admin', 'teacher'), async (req, res) => {
    const { studentId, date, status } = req.body;
    try {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);

      const attendance = await prisma.attendance.upsert({
        where: {
          studentId_date: {
            studentId: parseInt(studentId, 10),
            date: targetDate,
          },
        },
        update: { status },
        create: {
          studentId: parseInt(studentId, 10),
          date: targetDate,
          status,
          institutionId: req.user.institutionId,
        },
      });

      res.json(attendance);
    } catch (err) {
      sendError(res, err);
    }
  });

  app.post('/api/attendance/bulk', authMiddleware, requireRole('admin', 'teacher'), async (req, res) => {
    const { date, studentIds, status } = req.body;
    try {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);

      const operations = studentIds.map((id) =>
        prisma.attendance.upsert({
          where: { studentId_date: { studentId: parseInt(id, 10), date: targetDate } },
          update: { status },
          create: { studentId: parseInt(id, 10), date: targetDate, status, institutionId: req.user.institutionId },
        }),
      );

      await Promise.all(operations);
      res.json({ success: true });
    } catch (err) {
      sendError(res, err);
    }
  });

  app.get('/api/students/:id/attendance', authMiddleware, requireRole('admin', 'teacher', 'student', 'super_admin'), studentScopeGuard, async (req, res) => {
    try {
      const studentId = parseInt(req.params.id, 10);
      const attendanceWhere = req.user.role === 'super_admin'
        ? { studentId }
        : { studentId, institutionId: req.targetStudent.institutionId };

      const history = await prisma.attendance.findMany({
        where: attendanceWhere,
        orderBy: { date: 'desc' },
      });
      res.json(history);
    } catch (err) {
      sendError(res, err);
    }
  });

  app.get('/api/attendance/risk-analysis', authMiddleware, requireRole('admin', 'teacher'), async (req, res) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const riskyStudents = await prisma.attendance.groupBy({
        by: ['studentId'],
        where: {
          institutionId: req.user.institutionId,
          date: { gte: thirtyDaysAgo },
          status: { in: ['gelmedi', 'gec_kaldi'] },
        },
        _count: { status: true },
        having: { status: { _count: { gt: 3 } } },
      });

      const studentDetails = await prisma.student.findMany({
        where: { id: { in: riskyStudents.map((item) => item.studentId) } },
        select: { id: true, name: true, class: true },
      });

      const result = riskyStudents.map((item) => {
        const student = studentDetails.find((detail) => detail.id === item.studentId);
        const absentCount = item._count.status;
        return {
          ...student,
          studentName: student?.name || 'Bilinmeyen Öğrenci',
          absentCount,
          riskLevel: absentCount >= 6 ? 'High' : 'Medium',
        };
      });

      res.json(result);
    } catch (err) {
      sendError(res, err);
    }
  });
}

module.exports = { registerAttendanceRoutes };
