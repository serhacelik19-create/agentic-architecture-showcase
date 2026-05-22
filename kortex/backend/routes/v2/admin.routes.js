const fs = require('fs');
const path = require('path');

const SYSTEM_SETTINGS_DIR = path.join(__dirname, '..', 'data');
const SYSTEM_SETTINGS_FILE = path.join(SYSTEM_SETTINGS_DIR, 'system-settings.json');
const INSTITUTION_SETTINGS_FILE = path.join(SYSTEM_SETTINGS_DIR, 'institution-settings.json');

const DEFAULT_SYSTEM_SETTINGS = {
  appMaintenance: false,
  panelMaintenance: false,
  appMaintenanceMessage: '',
  panelMaintenanceMessage: '',
  updatedAt: null,
};

const DEFAULT_INSTITUTION_SETTINGS = {
  panelAccess: true,
  maintenanceMode: false,
  maintenanceMessage: '',
  internalNote: '',
  updatedAt: null,
};

function readSystemSettings() {
  try {
    if (!fs.existsSync(SYSTEM_SETTINGS_FILE)) {
      return { ...DEFAULT_SYSTEM_SETTINGS };
    }
    const raw = fs.readFileSync(SYSTEM_SETTINGS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SYSTEM_SETTINGS,
      ...parsed,
    };
  } catch (_error) {
    return { ...DEFAULT_SYSTEM_SETTINGS };
  }
}

function writeSystemSettings(nextSettings) {
  fs.mkdirSync(SYSTEM_SETTINGS_DIR, { recursive: true });
  fs.writeFileSync(
    SYSTEM_SETTINGS_FILE,
    JSON.stringify(
      {
        ...DEFAULT_SYSTEM_SETTINGS,
        ...nextSettings,
        updatedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
    'utf8',
  );
  return readSystemSettings();
}

function readInstitutionSettingsStore() {
  try {
    if (!fs.existsSync(INSTITUTION_SETTINGS_FILE)) {
      return {};
    }
    const raw = fs.readFileSync(INSTITUTION_SETTINGS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (_error) {
    return {};
  }
}

function getInstitutionSettings(institutionId) {
  const store = readInstitutionSettingsStore();
  return {
    ...DEFAULT_INSTITUTION_SETTINGS,
    ...(store[String(institutionId)] || {}),
  };
}

function writeInstitutionSettings(institutionId, nextSettings) {
  const store = readInstitutionSettingsStore();
  const current = getInstitutionSettings(institutionId);
  const normalized = {
    ...current,
    ...nextSettings,
    panelAccess: nextSettings.panelAccess !== undefined
      ? Boolean(nextSettings.panelAccess)
      : current.panelAccess,
    maintenanceMode: nextSettings.maintenanceMode !== undefined
      ? Boolean(nextSettings.maintenanceMode)
      : current.maintenanceMode,
    maintenanceMessage:
      typeof nextSettings.maintenanceMessage === 'string'
        ? nextSettings.maintenanceMessage.trim()
        : current.maintenanceMessage,
    internalNote:
      typeof nextSettings.internalNote === 'string'
        ? nextSettings.internalNote.trim()
        : current.internalNote,
    updatedAt: new Date().toISOString(),
  };

  store[String(institutionId)] = normalized;
  fs.mkdirSync(SYSTEM_SETTINGS_DIR, { recursive: true });
  fs.writeFileSync(INSTITUTION_SETTINGS_FILE, JSON.stringify(store, null, 2), 'utf8');
  return normalized;
}

function deleteInstitutionSettings(institutionId) {
  const store = readInstitutionSettingsStore();
  if (!store[String(institutionId)]) {
    return;
  }

  delete store[String(institutionId)];
  fs.mkdirSync(SYSTEM_SETTINGS_DIR, { recursive: true });
  fs.writeFileSync(INSTITUTION_SETTINGS_FILE, JSON.stringify(store, null, 2), 'utf8');
}

function registerAdminRoutes(app, deps) {
  const {
    prisma,
    bcrypt,
    authMiddleware,
    requireRole,
    findNextInstitutionCode,
  } = deps;

  app.get('/api/admin/institutions', authMiddleware, requireRole('super_admin'), async (_req, res) => {
    try {
      const institutions = await prisma.institution.findMany({
        include: {
          _count: {
            select: { students: true, users: true },
          },
          subscriptions: {
            orderBy: { endDate: 'desc' },
            take: 1,
          },
          users: {
            where: { role: 'admin' },
            select: {
              id: true,
              username: true,
              email: true,
            },
            orderBy: { id: 'asc' },
            take: 1,
          },
        },
      });
      res.json(institutions.map((institution) => {
        const { users, ...rest } = institution;
        return {
          ...rest,
          adminUser: users?.[0] || null,
          controls: getInstitutionSettings(institution.id),
        };
      }));
    } catch (err) {
      console.error('KURUM_HATA:', err);
      res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
  });

  app.get('/api/admin/subscriptions', authMiddleware, requireRole('super_admin'), async (_req, res) => {
    try {
      const subscriptions = await prisma.subscription.findMany({
        include: { institution: true },
        orderBy: { createdAt: 'desc' },
      });
      res.json(subscriptions);
    } catch (err) {
      console.error('KURUM_HATA:', err);
      res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
  });

  app.post('/api/admin/subscriptions', authMiddleware, requireRole('super_admin'), async (req, res) => {
    const { institutionId, planName, amount, endDate } = req.body;
    try {
      const subscription = await prisma.subscription.create({
        data: {
          institutionId: parseInt(institutionId, 10),
          planName,
          amount: parseFloat(amount),
          endDate: new Date(endDate),
          status: 'active',
        },
      });
      await prisma.institution.update({
        where: { id: parseInt(institutionId, 10) },
        data: { status: 'active' },
      });
      res.json(subscription);
    } catch (err) {
      console.error('KURUM_HATA:', err);
      res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
  });

  app.get('/api/admin/payments', authMiddleware, requireRole('super_admin'), async (_req, res) => {
    try {
      const payments = await prisma.payment.findMany({
        include: { institution: true },
        orderBy: { paidAt: 'desc' },
      });
      res.json(payments);
    } catch (err) {
      console.error('KURUM_HATA:', err);
      res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
  });

  app.post('/api/admin/payments', authMiddleware, requireRole('super_admin'), async (req, res) => {
    const { institutionId, amount, paymentMethod, transactionId } = req.body;
    try {
      const payment = await prisma.payment.create({
        data: {
          institutionId: parseInt(institutionId, 10),
          amount: parseFloat(amount),
          paymentMethod,
          transactionId,
          status: 'completed',
        },
      });
      res.json(payment);
    } catch (err) {
      console.error('KURUM_HATA:', err);
      res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
  });

  app.post('/api/admin/institutions', authMiddleware, requireRole('super_admin'), async (req, res) => {
    const { name, slug, logo, primaryColor, secondaryColor, adminUser } = req.body;
    try {
      const result = await prisma.$transaction(async (tx) => {
        const institutionCode = await findNextInstitutionCode(tx);
        if (!institutionCode) {
          throw new Error('Kurum kodu üretilemedi.');
        }

        const institution = await tx.institution.create({
          data: {
            name,
            slug: slug || name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''),
            logo,
            primaryColor,
            secondaryColor,
            code: institutionCode,
            studentCounter: 0,
          },
        });

        if (adminUser && adminUser.username && adminUser.password) {
          const hashedPassword = await bcrypt.hash(adminUser.password, 10);
          await tx.user.create({
            data: {
              name: adminUser.name || `${name} Admin`,
              username: adminUser.username,
              email: adminUser.email,
              password: hashedPassword,
              role: 'admin',
              institutionId: institution.id,
            },
          });
        }

        return institution;
      });

      res.json(result);
    } catch (err) {
      console.error('KURUM_HATA:', err);

      if (err.code === 'P2002') {
        const target = err.meta?.target || [];
        if (target.includes('name')) return res.status(400).json({ error: 'Bu isimde bir kurum zaten mevcut.' });
        if (target.includes('slug')) return res.status(400).json({ error: 'Bu kurum takma adı (slug) zaten kullanımda.' });
        if (target.includes('code')) return res.status(400).json({ error: 'Kurum kodu çakışması oluştu, lütfen tekrar deneyin.' });
        if (target.includes('username')) return res.status(400).json({ error: 'Bu yönetici kullanıcı adı zaten alınmış.' });
        if (target.includes('email')) return res.status(400).json({ error: 'Bu admin e-posta adresi zaten kayıtlı.' });
        return res.status(400).json({ error: 'Bu bilgilerle daha önce bir kayıt oluşturulmuş.' });
      }

      res.status(500).json({ error: 'Kurum oluşturulurken bir hata oluştu.' });
    }
  });

  app.put('/api/admin/institutions/:id', authMiddleware, requireRole('super_admin'), async (req, res) => {
    const { name, slug, logo, status, primaryColor, secondaryColor, adminUser } = req.body;
    const institutionId = parseInt(req.params.id, 10);

    try {
      const result = await prisma.$transaction(async (tx) => {
        const institution = await tx.institution.update({
          where: { id: institutionId },
          data: { name, slug, logo, status, primaryColor, secondaryColor },
        });

        if (adminUser) {
          const admin = await tx.user.findFirst({
            where: { institutionId, role: 'admin' },
          });

          if (admin) {
            const userData = {};
            if (adminUser.username) userData.username = adminUser.username;
            if (adminUser.password) {
              userData.password = await bcrypt.hash(adminUser.password, 10);
            }

            if (Object.keys(userData).length > 0) {
              await tx.user.update({
                where: { id: admin.id },
                data: userData,
              });
            }
          }
        }

        return institution;
      });

      res.json(result);
    } catch (err) {
      console.error('KURUM_HATA:', err);
      res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
  });

  app.delete('/api/admin/institutions/:id', authMiddleware, requireRole('super_admin'), async (req, res) => {
    const institutionId = parseInt(req.params.id, 10);
    try {
      await prisma.$transaction([
        prisma.user.deleteMany({ where: { institutionId } }),
        prisma.student.deleteMany({ where: { institutionId } }),
        prisma.class.deleteMany({ where: { institutionId } }),
        prisma.exam.deleteMany({ where: { institutionId } }),
        prisma.institution.delete({ where: { id: institutionId } }),
      ]);
      deleteInstitutionSettings(institutionId);
      res.json({ success: true });
    } catch (err) {
      console.error('KURUM_SILME_HATA:', err);
      res.status(500).json({ error: 'Kurum silinirken bir hata oluştu.' });
    }
  });

  app.get('/api/admin/institutions/:id/settings', authMiddleware, requireRole('super_admin'), async (req, res) => {
    try {
      const institutionId = parseInt(req.params.id, 10);
      res.json(getInstitutionSettings(institutionId));
    } catch (err) {
      console.error('KURUM_AYAR_HATA:', err);
      res.status(500).json({ error: 'Kurum ayarlari okunamadi.' });
    }
  });

  app.put('/api/admin/institutions/:id/settings', authMiddleware, requireRole('super_admin'), async (req, res) => {
    try {
      const institutionId = parseInt(req.params.id, 10);
      const updated = writeInstitutionSettings(institutionId, req.body || {});
      res.json(updated);
    } catch (err) {
      console.error('KURUM_AYAR_HATA:', err);
      res.status(500).json({ error: 'Kurum ayarlari guncellenemedi.' });
    }
  });

  app.post('/api/admin/institutions/:id/reset-admin-password', authMiddleware, requireRole('super_admin'), async (req, res) => {
    const institutionId = parseInt(req.params.id, 10);
    const nextPassword = typeof req.body?.password === 'string' ? req.body.password.trim() : '';

    if (!nextPassword) {
      return res.status(400).json({ error: 'Yeni sifre zorunludur.' });
    }

    try {
      const admin = await prisma.user.findFirst({
        where: { institutionId, role: 'admin' },
        orderBy: { id: 'asc' },
      });

      if (!admin) {
        return res.status(404).json({ error: 'Bu kuruma ait admin kullanicisi bulunamadi.' });
      }

      const hashedPassword = await bcrypt.hash(nextPassword, 10);
      await prisma.user.update({
        where: { id: admin.id },
        data: { password: hashedPassword },
      });

      res.json({ success: true });
    } catch (err) {
      console.error('KURUM_ADMIN_SIFRE_HATA:', err);
      res.status(500).json({ error: 'Admin sifresi sifirlanamadi.' });
    }
  });

  app.get('/api/active-students-details', authMiddleware, requireRole('admin', 'super_admin'), async (req, res) => {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const institutionId = req.user.institutionId ? Number(req.user.institutionId) : null;
      const institutionWhere = req.user.role === 'super_admin' ? {} : { institutionId };

      const activeStudents = await prisma.student.findMany({
        where: {
          ...institutionWhere,
          lastActiveAt: { gt: fiveMinutesAgo },
        },
        select: {
          id: true,
          name: true,
          class: true,
          lastActiveAt: true,
          institutionId: true,
          institution: {
            select: {
              id: true,
              name: true,
              slug: true,
              status: true,
            },
          },
        },
      });

      if (!activeStudents || activeStudents.length === 0) {
        return res.json([]);
      }

      const detailedList = await Promise.all(activeStudents.map(async (st) => {
        try {
          const [lastAnalysis, lastSession] = await Promise.all([
            prisma.questionAnalysis.findFirst({
              where: { studentId: st.id },
              orderBy: { createdAt: 'desc' },
            }),
            prisma.chatSession.findFirst({
              where: { studentId: st.id },
              orderBy: { lastActivity: 'desc' },
            }),
          ]);

          let activity = 'Uygulamada geziniyor';
          let activityTime = st.lastActiveAt;

          const analysisTime = lastAnalysis?.createdAt || new Date(0);
          const sessionTime = lastSession?.lastActivity || new Date(0);

          if (analysisTime > sessionTime && analysisTime > new Date(Date.now() - 15 * 60 * 1000)) {
            activity = `${lastAnalysis.course} dersinde soru çözüyor`;
            activityTime = analysisTime;
          } else if (sessionTime > analysisTime && sessionTime > new Date(Date.now() - 15 * 60 * 1000)) {
            activity = `${lastSession.course || 'Asistan'} ile çalışıyor`;
            activityTime = sessionTime;
          }

          return {
            id: st.id,
            name: st.name,
            class: st.class,
            institutionId: st.institutionId,
            institution: st.institution,
            activity,
            lastActiveAt: activityTime,
          };
        } catch (innerErr) {
          console.error(`Student detail error for ${st.id}:`, innerErr);
          return {
            id: st.id,
            name: st.name,
            class: st.class,
            institutionId: st.institutionId,
            institution: st.institution,
            activity: 'Aktif',
            lastActiveAt: st.lastActiveAt,
          };
        }
      }));

      res.json(detailedList.sort((a, b) => new Date(b.lastActiveAt) - new Date(a.lastActiveAt)));
    } catch (err) {
      console.error('LIVE_ACTIVITY_HATA:', err);
      res.status(500).json({ error: 'Aktif öğrenciler yüklenirken bir sorun oluştu.' });
    }
  });

  app.get('/api/admin/stats', authMiddleware, requireRole('super_admin'), async (_req, res) => {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const fourteenDaysAhead = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

      const [
        instCount,
        studentCount,
        activeInst,
        userCount,
        activeSubscriptionCount,
        expiringSubscriptionCount,
        paymentsLastThirtyDays,
      ] = await Promise.all([
        prisma.institution.count(),
        prisma.student.count(),
        prisma.institution.count({ where: { status: 'active' } }),
        prisma.user.count(),
        prisma.subscription.count({
          where: {
            status: 'active',
            endDate: { gte: new Date() },
          },
        }),
        prisma.subscription.count({
          where: {
            status: 'active',
            endDate: {
              gte: new Date(),
              lte: fourteenDaysAhead,
            },
          },
        }),
        prisma.payment.aggregate({
          _sum: { amount: true },
          where: { paidAt: { gte: thirtyDaysAgo } },
        }),
      ]);
      res.json({
        totalInstitutions: instCount,
        totalStudents: studentCount,
        activeInstitutions: activeInst,
        totalUsers: userCount,
        activeSubscriptions: activeSubscriptionCount,
        expiringSubscriptions: expiringSubscriptionCount,
        recentCollections: paymentsLastThirtyDays._sum.amount || 0,
      });
    } catch (err) {
      console.error('KURUM_HATA:', err);
      res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
  });

  app.get('/api/admin/system-settings', authMiddleware, requireRole('super_admin'), async (_req, res) => {
    try {
      res.json(readSystemSettings());
    } catch (err) {
      console.error('SYSTEM_SETTINGS_HATA:', err);
      res.status(500).json({ error: 'Sistem ayarlari okunamadi.' });
    }
  });

  app.put('/api/admin/system-settings', authMiddleware, requireRole('super_admin'), async (req, res) => {
    try {
      const {
        appMaintenance,
        panelMaintenance,
        appMaintenanceMessage,
        panelMaintenanceMessage,
      } = req.body;

      const updated = writeSystemSettings({
        appMaintenance: Boolean(appMaintenance),
        panelMaintenance: Boolean(panelMaintenance),
        appMaintenanceMessage:
          typeof appMaintenanceMessage === 'string' ? appMaintenanceMessage.trim() : '',
        panelMaintenanceMessage:
          typeof panelMaintenanceMessage === 'string' ? panelMaintenanceMessage.trim() : '',
      });

      res.json(updated);
    } catch (err) {
      console.error('SYSTEM_SETTINGS_HATA:', err);
      res.status(500).json({ error: 'Sistem ayarlari guncellenemedi.' });
    }
  });
}

module.exports = { registerAdminRoutes };
