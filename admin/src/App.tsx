import { useEffect, useMemo, useState, type ElementType, type FormEvent, type ReactNode } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Ban,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  CirclePlus,
  Clock3,
  Download,
  KeyRound,
  LogOut,
  PanelTop,
  PauseCircle,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  UserCog,
  Users,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Login from './Login';
import { adminApi } from './api';
import './index.css';

type TabId = 'overview' | 'institutions' | 'aiUsage' | 'users' | 'maintenance';
type UsageDays = 1 | 7 | 30 | 90;
type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface AdminUser {
  id?: number;
  name?: string | null;
  username?: string | null;
  role?: string | null;
  avatar?: string | null;
}

interface InstitutionControls {
  panelAccess: boolean;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  internalNote: string;
  updatedAt: string | null;
}

interface Institution {
  id: number;
  name: string;
  slug: string;
  code?: string;
  status: string;
  primaryColor?: string;
  secondaryColor?: string;
  adminUser?: {
    id: number;
    username: string | null;
    email: string | null;
  } | null;
  controls?: InstitutionControls;
  _count?: {
    students: number;
    users: number;
  };
  subscriptions?: Array<{
    id: number;
    planName: string;
    amount: number;
    status: string;
    endDate: string;
  }>;
}

interface User {
  id: number;
  name: string | null;
  username: string | null;
  email: string | null;
  role: string | null;
  institutionId?: number | null;
  institution?: { id?: number; name: string } | null;
}

interface AdminStats {
  totalInstitutions: number;
  totalStudents: number;
  activeInstitutions: number;
  totalUsers?: number;
}

interface SystemSettings {
  appMaintenance: boolean;
  panelMaintenance: boolean;
  appMaintenanceMessage: string;
  panelMaintenanceMessage: string;
  updatedAt: string | null;
}

interface InstitutionFormState {
  id: number | null;
  name: string;
  slug: string;
  username: string;
  password: string;
  status: string;
  primaryColor: string;
  secondaryColor: string;
}

interface UserFormState {
  id: number | null;
  name: string;
  username: string;
  email: string;
  password: string;
  role: string;
  institutionId: string;
}

interface AiUsageTotals {
  callCount: number;
  promptTokens: number;
  completionTokens: number;
  reasoningTokens: number;
  totalTokens: number;
  totalCostUsd: number;
}

interface AiUsageGroup extends AiUsageTotals {
  key: string;
}

interface AiUsageData {
  days: number;
  totals: AiUsageTotals;
  bySurface: AiUsageGroup[];
  byFeature: AiUsageGroup[];
  byModel: AiUsageGroup[];
  topStudents?: Array<AiUsageGroup & { studentId: number; name: string; class?: string | null }>;
  daily?: Array<AiUsageTotals & { date: string }>;
  events?: Array<{
    id: number | string;
    createdAt: string;
    studentId?: number | null;
    studentName?: string | null;
    userId?: number | null;
    actorType?: string | null;
    surface?: string | null;
    feature?: string | null;
    provider?: string | null;
    model?: string | null;
    promptTokens?: number | null;
    completionTokens?: number | null;
    reasoningTokens?: number | null;
    totalTokens?: number | null;
    inputCostUsd?: number | null;
    outputCostUsd?: number | null;
    totalCostUsd?: number | null;
    status?: string | null;
    cacheHit?: boolean | null;
    isImage?: boolean;
  }>;
  institutions?: Array<{
    institutionId: number;
    institutionName: string;
    totals: AiUsageTotals;
    studentUsage: AiUsageTotals;
    panelUsage: AiUsageTotals;
  }>;
}

const tabs: Array<{ id: TabId; label: string; contractLabel: string; icon: ElementType }> = [
  { id: 'overview', label: 'Genel Bakış', contractLabel: 'Genel', icon: ShieldCheck },
  { id: 'institutions', label: 'Kurumlar', contractLabel: 'Kurum Yonetimi', icon: Building2 },
  { id: 'aiUsage', label: 'AI Maliyet', contractLabel: 'AI Maliyet', icon: CircleDollarSign },
  { id: 'users', label: 'Kullanıcılar', contractLabel: 'Kullanici Yonetimi', icon: Users },
  { id: 'maintenance', label: 'Bakım Modları', contractLabel: 'Bakim Modlari', icon: Settings2 },
];

const defaultSystemSettings = (): SystemSettings => ({
  appMaintenance: false,
  panelMaintenance: false,
  appMaintenanceMessage: '',
  panelMaintenanceMessage: '',
  updatedAt: null,
});

const defaultInstitutionControls = (): InstitutionControls => ({
  panelAccess: true,
  maintenanceMode: false,
  maintenanceMessage: '',
  internalNote: '',
  updatedAt: null,
});

const defaultInstitutionForm = (): InstitutionFormState => ({
  id: null,
  name: '',
  slug: '',
  username: '',
  password: '',
  status: 'active',
  primaryColor: '#2367f4',
  secondaryColor: '#31c48d',
});

const defaultUserForm = (): UserFormState => ({
  id: null,
  name: '',
  username: '',
  email: '',
  password: '',
  role: 'admin',
  institutionId: '',
});

const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
});

const usdFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

const compactNumberFormatter = new Intl.NumberFormat('tr-TR', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const integerFormatter = new Intl.NumberFormat('tr-TR');

const usageDayOptions: Array<{ label: string; value: UsageDays }> = [
  { label: 'Bugün', value: 1 },
  { label: '7 gün', value: 7 },
  { label: '30 gün', value: 30 },
  { label: '90 gün', value: 90 },
];

const roleLabels: Record<string, string> = {
  super_admin: 'Süper admin',
  admin: 'Kurum admini',
  teacher: 'Öğretmen',
  student: 'Öğrenci',
};

const surfaceLabel = (value?: string | null) => {
  if (value === 'mobile_app') return 'Öğrenci uygulaması';
  if (value === 'institution_panel') return 'Kurum paneli';
  if (value === 'admin_panel') return 'Admin panel';
  return value || 'Bilinmiyor';
};

const actorLabel = (value?: string | null) => {
  if (value === 'student') return 'Öğrenci';
  if (value === 'admin') return 'Kurum admini';
  if (value === 'super_admin') return 'Süper admin';
  if (value === 'system') return 'Sistem';
  return value || 'Bilinmiyor';
};

const featureLabel = (value?: string | null) => {
  const labels: Record<string, string> = {
    question_solve: 'Soru çözümü',
    topic_explain: 'Konu anlatımı',
    question_retry: 'Tekrar çözüm',
    dashboard_summary: 'Kurum AI analizi',
    student_ai_update: 'Öğrenci AI güncelleme',
    batch_report: 'Toplu rapor',
    assignment_analysis: 'Ödev analizi',
  };
  return labels[value || ''] || value || 'Bilinmiyor';
};

const slugify = (text: string) =>
  text
    .toLocaleLowerCase('tr-TR')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const getInitial = (value?: string | null) => value?.trim().charAt(0).toLocaleUpperCase('tr-TR') || 'Y';

const getInstitutionState = (institution: Institution): { label: string; tone: Tone; icon: ElementType } => {
  if (institution.controls?.panelAccess === false) {
    return { label: 'Giriş kapalı', tone: 'danger', icon: Ban };
  }
  if (institution.controls?.maintenanceMode) {
    return { label: 'Bakımda', tone: 'warning', icon: PauseCircle };
  }
  if (institution.status !== 'active') {
    return { label: 'Pasif', tone: 'neutral', icon: Clock3 };
  }
  return { label: 'Aktif', tone: 'success', icon: CheckCircle2 };
};

const getTotals = (value?: AiUsageData | null): AiUsageTotals => ({
  callCount: value?.totals?.callCount || 0,
  promptTokens: value?.totals?.promptTokens || 0,
  completionTokens: value?.totals?.completionTokens || 0,
  reasoningTokens: value?.totals?.reasoningTokens || 0,
  totalTokens: value?.totals?.totalTokens || 0,
  totalCostUsd: value?.totals?.totalCostUsd || 0,
});

const StatusPill = ({ label, tone = 'neutral' }: { label: string; tone?: Tone }) => (
  <span className={`status-pill ${tone}`}>{label}</span>
);

const PanelCard = ({
  title,
  eyebrow,
  action,
  children,
  className = '',
}: {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) => (
  <section className={`panel-card ${className}`}>
    <div className="panel-card-header">
      <div>
        {eyebrow && <div className="panel-eyebrow">{eyebrow}</div>}
        <h3>{title}</h3>
      </div>
      {action}
    </div>
    {children}
  </section>
);

const MetricCard = ({
  title,
  value,
  hint,
  icon: Icon,
  tone = 'info',
}: {
  title: string;
  value: string;
  hint: string;
  icon: ElementType;
  tone?: Tone;
}) => (
  <div className="metric-card">
    <div className={`metric-icon ${tone}`}>
      <Icon size={18} />
    </div>
    <div>
      <div className="metric-title">{title}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-hint">{hint}</div>
    </div>
  </div>
);

const ToggleSwitch = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) => (
  <button
    type="button"
    className={`switch-control ${checked ? 'checked' : ''}`}
    onClick={() => onChange(!checked)}
    aria-pressed={checked}
    aria-label={label}
    title={label}
  >
    <span />
  </button>
);

const ModalShell = ({
  open,
  title,
  subtitle,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-panel"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="modal-header">
            <div>
              <h3>{title}</h3>
              {subtitle && <p>{subtitle}</p>}
            </div>
            <button className="icon-button" onClick={onClose} type="button" aria-label="Kapat" title="Kapat">
              <X size={18} />
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const App = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [user, setUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(defaultSystemSettings());
  const [aiUsageDays, setAiUsageDays] = useState<UsageDays>(30);
  const [aiUsageSummary, setAiUsageSummary] = useState<AiUsageData | null>(null);
  const [institutionAiUsage, setInstitutionAiUsage] = useState<AiUsageData | null>(null);
  const [aiUsageLoading, setAiUsageLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [institutionModalOpen, setInstitutionModalOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [adminPasswordModalOpen, setAdminPasswordModalOpen] = useState(false);
  const [institutionForm, setInstitutionForm] = useState<InstitutionFormState>(defaultInstitutionForm());
  const [userForm, setUserForm] = useState<UserFormState>(defaultUserForm());
  const [institutionControlsForm, setInstitutionControlsForm] =
    useState<InstitutionControls>(defaultInstitutionControls());
  const [nextAdminPassword, setNextAdminPassword] = useState('');

  useEffect(() => {
    if (user) {
      localStorage.setItem('admin_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('admin_user');
      localStorage.removeItem('admin_token');
    }
  }, [user]);

  const refreshData = async (silent = false) => {
    if (!user) return;
    setError('');
    if (silent) setRefreshing(true);
    else setLoading(true);

    try {
      const [nextStats, nextInstitutions, nextUsers, nextSystemSettings] = await Promise.all([
        adminApi.getAdminStats(),
        adminApi.getInstitutions(),
        adminApi.getUsers(),
        adminApi.getSystemSettings(),
      ]);

      const institutionsPayload = Array.isArray(nextInstitutions) ? nextInstitutions : [];
      setStats(nextStats);
      setInstitutions(institutionsPayload);
      setUsers(Array.isArray(nextUsers) ? nextUsers : []);
      setSystemSettings({ ...defaultSystemSettings(), ...nextSystemSettings });
      setSelectedInstitutionId((current) => {
        if (current && institutionsPayload.some((institution: Institution) => institution.id === current)) {
          return current;
        }
        return institutionsPayload[0]?.id ?? null;
      });
    } catch (err: any) {
      console.error('Admin verileri yüklenemedi:', err);
      setError(err.response?.data?.error || 'Panel verileri yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    adminApi.getAiUsageSummary(aiUsageDays)
      .then((payload) => setAiUsageSummary(Array.isArray(payload) ? null : payload))
      .catch((err) => {
        console.error('AI kullanım özeti yüklenemedi:', err);
        setAiUsageSummary(null);
      });
  }, [user, aiUsageDays]);

  useEffect(() => {
    if (!user || !selectedInstitutionId) {
      setInstitutionAiUsage(null);
      return;
    }

    setAiUsageLoading(true);
    adminApi.getInstitutionAiUsage(selectedInstitutionId, aiUsageDays)
      .then((payload) => setInstitutionAiUsage(Array.isArray(payload) ? null : payload))
      .catch((err) => {
        console.error('Kurum AI kullanımı yüklenemedi:', err);
        setInstitutionAiUsage(null);
      })
      .finally(() => setAiUsageLoading(false));
  }, [user, selectedInstitutionId, aiUsageDays]);

  const selectedInstitution = useMemo(
    () => institutions.find((institution) => institution.id === selectedInstitutionId) || null,
    [institutions, selectedInstitutionId],
  );

  useEffect(() => {
    if (!selectedInstitution) {
      setInstitutionControlsForm(defaultInstitutionControls());
      setNextAdminPassword('');
      setAdminPasswordModalOpen(false);
      return;
    }

    setInstitutionControlsForm({
      ...defaultInstitutionControls(),
      ...selectedInstitution.controls,
    });
  }, [selectedInstitution]);

  const query = search.trim().toLocaleLowerCase('tr-TR');

  const filteredInstitutions = useMemo(() => {
    if (!query) return institutions;
    return institutions.filter((institution) =>
      [institution.name, institution.slug, institution.code, getInstitutionState(institution).label]
        .filter(Boolean)
        .some((value) => String(value).toLocaleLowerCase('tr-TR').includes(query)),
    );
  }, [institutions, query]);

  const filteredUsers = useMemo(() => {
    if (!query) return users;
    return users.filter((entry) =>
      [entry.name, entry.username, entry.email, entry.role, roleLabels[entry.role || ''], entry.institution?.name]
        .filter(Boolean)
        .some((value) => String(value).toLocaleLowerCase('tr-TR').includes(query)),
    );
  }, [users, query]);

  const aiInstitutionRows = useMemo(() => {
    const rows = aiUsageSummary?.institutions || [];
    if (!query) return rows;
    return rows.filter((entry) => entry.institutionName.toLocaleLowerCase('tr-TR').includes(query));
  }, [aiUsageSummary?.institutions, query]);

  const activePage = tabs.find((tab) => tab.id === activeTab) || tabs[0];
  const activeInstitutions = stats?.activeInstitutions ?? institutions.filter((entry) => entry.status === 'active').length;
  const totalStudents = stats?.totalStudents ?? institutions.reduce((total, entry) => total + (entry._count?.students || 0), 0);
  const totalUsers = stats?.totalUsers ?? users.length;
  const blockedInstitutions = institutions.filter((entry) => {
    const state = getInstitutionState(entry);
    return state.tone === 'danger' || state.tone === 'warning' || state.tone === 'neutral';
  });
  const maintenanceActive = systemSettings.appMaintenance || systemSettings.panelMaintenance;
  const aiTotals = getTotals(aiUsageSummary);
  const selectedInstitutionState = selectedInstitution ? getInstitutionState(selectedInstitution) : null;
  const sortedAiInstitutions = [...aiInstitutionRows].sort(
    (left, right) => (right.totals.totalCostUsd || 0) - (left.totals.totalCostUsd || 0),
  );
  const topAiInstitution = sortedAiInstitutions[0] || null;
  const aiCostPerCall = aiTotals.callCount ? aiTotals.totalCostUsd / aiTotals.callCount : 0;
  const mobileAiUsage = aiUsageSummary?.bySurface?.find((entry) => entry.key === 'mobile_app');
  const panelAiUsage = aiUsageSummary?.bySurface?.find((entry) => entry.key === 'institution_panel');
  const aiDailyRows = aiUsageSummary?.daily || [];
  const aiDailyMidpoint = Math.max(1, Math.floor(aiDailyRows.length / 2));
  const previousAiDailyCost = aiDailyRows
    .slice(0, aiDailyMidpoint)
    .reduce((total, entry) => total + (entry.totalCostUsd || 0), 0);
  const currentAiDailyCost = aiDailyRows
    .slice(aiDailyMidpoint)
    .reduce((total, entry) => total + (entry.totalCostUsd || 0), 0);
  const aiTrendPercent = previousAiDailyCost > 0
    ? ((currentAiDailyCost - previousAiDailyCost) / previousAiDailyCost) * 100
    : 0;

  const openCreateInstitution = () => {
    setInstitutionForm(defaultInstitutionForm());
    setInstitutionModalOpen(true);
  };

  const openEditInstitution = (institution: Institution) => {
    const adminUser = users.find((entry) => entry.institutionId === institution.id && entry.role === 'admin');

    setInstitutionForm({
      id: institution.id,
      name: institution.name,
      slug: institution.slug,
      username: adminUser?.username || institution.adminUser?.username || institution.slug,
      password: '',
      status: institution.status,
      primaryColor: institution.primaryColor || '#2367f4',
      secondaryColor: institution.secondaryColor || '#31c48d',
    });
    setInstitutionModalOpen(true);
  };

  const openCreateUser = () => {
    setUserForm(defaultUserForm());
    setUserModalOpen(true);
  };

  const openEditUser = (entry: User) => {
    setUserForm({
      id: entry.id,
      name: entry.name || '',
      username: entry.username || '',
      email: entry.email || '',
      password: '',
      role: entry.role || 'admin',
      institutionId: entry.institutionId ? String(entry.institutionId) : '',
    });
    setUserModalOpen(true);
  };

  const handleSaveInstitution = async (event: FormEvent) => {
    event.preventDefault();
    setBusyAction('institution');
    try {
      if (institutionForm.id) {
        await adminApi.updateInstitution(institutionForm.id, {
          name: institutionForm.name,
          slug: institutionForm.slug,
          status: institutionForm.status,
          primaryColor: institutionForm.primaryColor,
          secondaryColor: institutionForm.secondaryColor,
          adminUser: {
            username: institutionForm.username,
            password: institutionForm.password || undefined,
          },
        });
      } else {
        await adminApi.createInstitution({
          name: institutionForm.name,
          slug: institutionForm.slug,
          primaryColor: institutionForm.primaryColor,
          secondaryColor: institutionForm.secondaryColor,
          adminUser: {
            name: `${institutionForm.name} Admin`,
            username: institutionForm.username,
            password: institutionForm.password,
            email: `admin@${institutionForm.slug}.com`,
          },
        });
      }

      setInstitutionModalOpen(false);
      setInstitutionForm(defaultInstitutionForm());
      await refreshData(true);
    } catch (err: any) {
      window.alert(err.response?.data?.error || 'Kurum kaydedilemedi.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleDeleteInstitution = async (institutionId: number) => {
    if (!window.confirm('Bu kurumu silmek istediğinize emin misiniz?')) return;
    setBusyAction(`institution-${institutionId}`);
    try {
      await adminApi.deleteInstitution(institutionId);
      await refreshData(true);
    } catch (err: any) {
      window.alert(err.response?.data?.error || 'Kurum silinemedi.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleToggleInstitutionStatus = async (institution: Institution) => {
    const nextStatus = institution.status === 'active' ? 'passive' : 'active';
    setBusyAction(`institution-status-${institution.id}`);
    try {
      await adminApi.updateInstitution(institution.id, {
        name: institution.name,
        slug: institution.slug,
        status: nextStatus,
      });
      await refreshData(true);
    } catch (err: any) {
      window.alert(err.response?.data?.error || 'Kurum durumu güncellenemedi.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleSaveInstitutionControls = async () => {
    if (!selectedInstitution) return;
    setBusyAction(`institution-controls-${selectedInstitution.id}`);

    try {
      const updated = await adminApi.updateInstitutionSettings(selectedInstitution.id, institutionControlsForm);
      setInstitutionControlsForm({ ...defaultInstitutionControls(), ...updated });
      await refreshData(true);
    } catch (err: any) {
      window.alert(err.response?.data?.error || 'Kurum ayarları kaydedilemedi.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleToggleInstitutionPanelAccess = async (institution: Institution) => {
    const currentAccess = institution.controls?.panelAccess ?? true;
    setBusyAction(`institution-access-${institution.id}`);

    try {
      await adminApi.updateInstitutionSettings(institution.id, {
        ...defaultInstitutionControls(),
        ...institution.controls,
        panelAccess: !currentAccess,
      });
      await refreshData(true);
    } catch (err: any) {
      window.alert(err.response?.data?.error || 'Kurum giriş ayarı güncellenemedi.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleResetInstitutionAdminPassword = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedInstitution) return;

    setBusyAction(`institution-password-${selectedInstitution.id}`);
    try {
      await adminApi.resetInstitutionAdminPassword(selectedInstitution.id, nextAdminPassword);
      setNextAdminPassword('');
      setAdminPasswordModalOpen(false);
      window.alert('Admin şifresi güncellendi.');
    } catch (err: any) {
      window.alert(err.response?.data?.error || 'Admin şifresi sıfırlanamadı.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleSaveUser = async (event: FormEvent) => {
    event.preventDefault();
    setBusyAction('user');
    try {
      const institutionId = userForm.institutionId ? Number(userForm.institutionId) : null;

      if (userForm.id) {
        await adminApi.updateUser(userForm.id, {
          name: userForm.name,
          email: userForm.email,
          role: userForm.role,
          institutionId,
          password: userForm.password || undefined,
        });
      } else {
        await adminApi.createUser({
          name: userForm.name,
          username: userForm.username,
          email: userForm.email,
          password: userForm.password,
          role: userForm.role,
          institutionId,
        });
      }

      setUserModalOpen(false);
      setUserForm(defaultUserForm());
      await refreshData(true);
    } catch (err: any) {
      window.alert(err.response?.data?.error || 'Kullanıcı kaydedilemedi.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;
    setBusyAction(`user-${userId}`);
    try {
      await adminApi.deleteUser(userId);
      await refreshData(true);
    } catch (err: any) {
      window.alert(err.response?.data?.error || 'Kullanıcı silinemedi.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleSaveMaintenance = async () => {
    setBusyAction('maintenance');
    try {
      const updated = await adminApi.updateSystemSettings(systemSettings);
      setSystemSettings({ ...defaultSystemSettings(), ...updated });
    } catch (err: any) {
      window.alert(err.response?.data?.error || 'Bakım ayarları kaydedilemedi.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleExportInstitutions = () => {
    const headers = ['kurum', 'slug', 'kod', 'durum', 'ogrenci', 'kullanici', 'plan', 'bitis'];
    const rows = filteredInstitutions.map((institution) => ({
      kurum: institution.name,
      slug: institution.slug,
      kod: institution.code || '',
      durum: institution.status,
      ogrenci: institution._count?.students || 0,
      kullanici: institution._count?.users || 0,
      plan: institution.subscriptions?.[0]?.planName || '',
      bitis: institution.subscriptions?.[0]?.endDate
        ? dateFormatter.format(new Date(institution.subscriptions[0].endDate))
        : '',
    }));
    const csv = [
      headers.join(','),
      ...rows.map((row) =>
        headers
          .map((key) => `"${String((row as Record<string, string | number>)[key] ?? '').replaceAll('"', '""')}"`)
          .join(','),
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kurumlar.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    setUser(null);
    setStats(null);
    setInstitutions([]);
    setUsers([]);
    setSystemSettings(defaultSystemSettings());
    setAiUsageSummary(null);
    setInstitutionAiUsage(null);
    setSelectedInstitutionId(null);
  };

  const renderUsageMetric = (
    title: string,
    value: string,
    hint: string,
    tone: Tone = 'info',
    icon: ElementType = CircleDollarSign,
  ) => {
    const Icon = icon;
    return (
      <div className={`usage-metric ${tone}`}>
        <div className={`usage-metric-icon ${tone}`}>
          <Icon size={18} />
        </div>
        <div>
          <span>{title}</span>
          <strong>{value}</strong>
          <small>{hint}</small>
        </div>
      </div>
    );
  };

  const renderUsageGroupTable = (title: string, rows: AiUsageGroup[] = [], labeler = (value: string) => value) => {
    const maxCost = Math.max(...rows.map((row) => row.totalCostUsd || 0), 0.0001);

    return (
      <div className="usage-rank-card">
        <div className="subsection-header compact">
          <strong>{title}</strong>
          <span>{rows.length} kalem</span>
        </div>
        {rows.length === 0 ? (
          <div className="empty-state compact">
            <span>Kayıt yok.</span>
          </div>
        ) : (
          <div className="usage-rank-list">
            {rows.slice(0, 6).map((row, index) => (
              <div className="usage-rank-row" key={row.key}>
                <div className="usage-rank-index">{index + 1}</div>
                <div className="usage-rank-main">
                  <div>
                    <strong>{labeler(row.key)}</strong>
                    <span>{compactNumberFormatter.format(row.totalTokens || 0)} token</span>
                  </div>
                  <div className="usage-rank-bar">
                    <div style={{ width: `${Math.max(5, ((row.totalCostUsd || 0) / maxCost) * 100)}%` }} />
                  </div>
                </div>
                <strong>{usdFormatter.format(row.totalCostUsd || 0)}</strong>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderDailyUsage = () => {
    const daily = aiUsageSummary?.daily || [];
    const maxCost = Math.max(...daily.map((entry) => entry.totalCostUsd || 0), 0.0001);

    return (
      <PanelCard title="Harcama ritmi" eyebrow={`${aiUsageDays} günlük trend`}>
        {daily.length === 0 ? (
          <div className="empty-state compact">
            <span>Günlük veri yok.</span>
          </div>
        ) : (
          <div className="daily-pulse">
            <div className="daily-pulse-summary">
              <div>
                <span>Son dönem</span>
                <strong>{usdFormatter.format(currentAiDailyCost || aiTotals.totalCostUsd)}</strong>
              </div>
              <StatusPill
                tone={aiTrendPercent > 15 ? 'danger' : aiTrendPercent > 0 ? 'warning' : 'success'}
                label={`${aiTrendPercent > 0 ? '+' : ''}${Math.round(aiTrendPercent)}%`}
              />
            </div>
            <div className="daily-sparkline" aria-label="Günlük maliyet grafiği">
              {daily.slice(-18).map((entry) => (
                <span
                  key={entry.date}
                  title={`${dateFormatter.format(new Date(entry.date))}: ${usdFormatter.format(entry.totalCostUsd || 0)}`}
                  style={{ height: `${Math.max(10, ((entry.totalCostUsd || 0) / maxCost) * 100)}%` }}
                />
              ))}
            </div>
            <div className="daily-bars">
              {daily.slice(-6).map((entry) => (
                <div className="daily-bar-row" key={entry.date}>
                  <span>{dateFormatter.format(new Date(entry.date))}</span>
                  <div className="daily-track">
                    <div style={{ width: `${Math.max(4, ((entry.totalCostUsd || 0) / maxCost) * 100)}%` }} />
                  </div>
                  <strong>{usdFormatter.format(entry.totalCostUsd || 0)}</strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </PanelCard>
    );
  };

  const renderInstitutionAiUsage = () => {
    if (aiUsageLoading) {
      return (
        <div className="empty-state compact">
          <RefreshCw size={18} className="spinning" />
          <span>AI kullanımı yükleniyor...</span>
        </div>
      );
    }
    if (!institutionAiUsage || !institutionAiUsage.totals?.callCount) {
      return (
        <div className="empty-state compact">
          <strong>AI kullanımı yok</strong>
          <span>Seçili dönemde kayıtlı AI çağrısı bulunmuyor.</span>
        </div>
      );
    }

    const totals = institutionAiUsage.totals;
    const mobileUsage = institutionAiUsage.bySurface?.find((entry) => entry.key === 'mobile_app');
    const panelUsage = institutionAiUsage.bySurface?.find((entry) => entry.key === 'institution_panel');
    const surfaceTotalCost = Math.max(
      0.0001,
      (mobileUsage?.totalCostUsd || 0) + (panelUsage?.totalCostUsd || 0),
    );
    const institutionCostPerCall = totals.callCount ? totals.totalCostUsd / totals.callCount : 0;
    const topFeature = [...(institutionAiUsage.byFeature || [])].sort(
      (left, right) => (right.totalCostUsd || 0) - (left.totalCostUsd || 0),
    )[0];
    const topModel = [...(institutionAiUsage.byModel || [])].sort(
      (left, right) => (right.totalCostUsd || 0) - (left.totalCostUsd || 0),
    )[0];

    return (
      <div className="ai-detail-stack">
        <div className="ai-detail-hero">
          <div>
            <span>Seçili kurum maliyeti</span>
            <strong>{usdFormatter.format(totals.totalCostUsd || 0)}</strong>
            <small>{compactNumberFormatter.format(totals.totalTokens || 0)} token / {totals.callCount} çağrı</small>
          </div>
          <div className="ai-health-grid">
            <div>
              <span>Çağrı başı</span>
              <strong>{usdFormatter.format(institutionCostPerCall)}</strong>
            </div>
            <div>
              <span>En pahalı özellik</span>
              <strong>{topFeature ? featureLabel(topFeature.key) : '-'}</strong>
            </div>
            <div>
              <span>Baskın model</span>
              <strong>{topModel?.key || '-'}</strong>
            </div>
          </div>
        </div>

        <div className="channel-split-card">
          <div className="subsection-header compact">
            <strong>Kanal dağılımı</strong>
            <span>Maliyet payı</span>
          </div>
          <div className="channel-bars">
            <div className="channel-row">
              <div>
                <strong>Öğrenci uygulaması</strong>
                <span>{compactNumberFormatter.format(mobileUsage?.totalTokens || 0)} token</span>
              </div>
              <div className="channel-track">
                <div style={{ width: `${Math.max(4, ((mobileUsage?.totalCostUsd || 0) / surfaceTotalCost) * 100)}%` }} />
              </div>
              <strong>{usdFormatter.format(mobileUsage?.totalCostUsd || 0)}</strong>
            </div>
            <div className="channel-row panel">
              <div>
                <strong>Kurum paneli</strong>
                <span>{compactNumberFormatter.format(panelUsage?.totalTokens || 0)} token</span>
              </div>
              <div className="channel-track">
                <div style={{ width: `${Math.max(4, ((panelUsage?.totalCostUsd || 0) / surfaceTotalCost) * 100)}%` }} />
              </div>
              <strong>{usdFormatter.format(panelUsage?.totalCostUsd || 0)}</strong>
            </div>
          </div>
        </div>

        <div className="usage-grid">
          {renderUsageGroupTable('Özellik bazlı', institutionAiUsage.byFeature, featureLabel)}
          {renderUsageGroupTable('Model bazlı', institutionAiUsage.byModel)}
        </div>

        <div className="usage-rank-card">
          <div className="subsection-header compact">
            <strong>En çok kullanan öğrenciler</strong>
            <span>Maliyet ve token sırası</span>
          </div>
          {(institutionAiUsage.topStudents || []).length === 0 ? (
            <div className="empty-state compact">
              <span>Öğrenci kullanımı yok.</span>
            </div>
          ) : (
            <div className="student-cost-grid">
              {(institutionAiUsage.topStudents || []).slice(0, 6).map((student) => (
                <div className="student-cost-card" key={student.studentId}>
                  <div>
                    <strong>{student.name}</strong>
                    <span>{student.class || 'Sınıf yok'} / #{student.studentId}</span>
                  </div>
                  <div>
                    <strong>{usdFormatter.format(student.totalCostUsd || 0)}</strong>
                    <span>{compactNumberFormatter.format(student.totalTokens || 0)} token</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="usage-rank-card usage-ledger-block">
          <div className="subsection-header compact">
            <div>
              <strong>Son AI çağrıları</strong>
              <span>Yakın dönemde maliyet üreten istekler.</span>
            </div>
            <span>{institutionAiUsage.events?.length || 0} kayıt</span>
          </div>
          {(institutionAiUsage.events || []).length === 0 ? (
            <div className="empty-state compact">
              <span>Event yok.</span>
            </div>
          ) : (
            <div className="ai-event-feed">
              {(institutionAiUsage.events || []).slice(0, 10).map((event) => (
                <div className="ai-event-card" key={event.id}>
                  <div className="ai-event-main">
                    <div className={`row-icon ${event.status === 'error' ? 'danger' : event.cacheHit ? 'info' : 'success'}`}>
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <strong>{featureLabel(event.feature)}</strong>
                      <span>
                        {event.studentName || actorLabel(event.actorType)} / {surfaceLabel(event.surface)}
                        {event.studentId ? ` / #${event.studentId}` : ''}
                      </span>
                    </div>
                  </div>
                  <div className="ai-event-meta">
                    <span>{dateTimeFormatter.format(new Date(event.createdAt))}</span>
                    <strong>{usdFormatter.format(event.totalCostUsd || 0)}</strong>
                    <small>
                      {event.model || '-'} / {compactNumberFormatter.format(event.totalTokens || 0)} token
                    </small>
                    <div className="ai-event-token-grid">
                      <span>Input <strong>{compactNumberFormatter.format(event.promptTokens || 0)}</strong></span>
                      <span>Output <strong>{compactNumberFormatter.format(event.completionTokens || 0)}</strong></span>
                      <span>Reasoning <strong>{compactNumberFormatter.format(event.reasoningTokens || 0)}</strong></span>
                    </div>
                    <div className="ai-event-cost-grid">
                      <span>in {usdFormatter.format(event.inputCostUsd || 0)}</span>
                      <span>out {usdFormatter.format(event.outputCostUsd || 0)}</span>
                    </div>
                  </div>
                  <StatusPill
                    tone={event.status === 'error' ? 'danger' : event.cacheHit ? 'info' : 'success'}
                    label={event.cacheHit ? 'Cache' : event.status || 'success'}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderOverview = () => (
    <div className="content-stack" data-contract="Genel Bakış">
      <section className="hero-panel">
        <div>
          <div className="panel-eyebrow">Hoş Geldiniz</div>
          <h1>YKS operasyonunu tek ekrandan yönet.</h1>
          <p>
            Kurum erişimleri, kullanıcı yetkileri, bakım modları ve AI maliyeti artık daha hızlı
            taranan, daha az tıklama isteyen bir kontrol merkezinde.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={openCreateInstitution}>
              <CirclePlus size={18} />
              Yeni Kurum
            </button>
            <button className="secondary-button" onClick={() => setActiveTab('aiUsage')}>
              <CircleDollarSign size={18} />
              AI Maliyeti
            </button>
          </div>
        </div>

        <div className="hero-spotlight">
          <div className="spotlight-card">
            <span>Operasyon durumu</span>
            <strong>{maintenanceActive ? 'Müdahale gerekli' : 'Sistem açık'}</strong>
            <p>
              {maintenanceActive
                ? 'Bakım modlarından en az biri açık.'
                : `${activeInstitutions} kurum aktif çalışıyor.`}
            </p>
          </div>
          <div className="spotlight-grid">
            <div>
              <span>Toplam Kurum</span>
              <strong>{integerFormatter.format(stats?.totalInstitutions || institutions.length)}</strong>
            </div>
            <div>
              <span>AI maliyet</span>
              <strong>{usdFormatter.format(aiTotals.totalCostUsd)}</strong>
            </div>
          </div>
        </div>
      </section>

      <div className="metrics-grid compact">
        <MetricCard
          title="Aktif kurum"
          value={integerFormatter.format(activeInstitutions)}
          hint={`${blockedInstitutions.length} kurum takipte`}
          icon={Building2}
          tone="success"
        />
        <MetricCard
          title="Öğrenci"
          value={integerFormatter.format(totalStudents)}
          hint="Tüm kurumlarda kayıtlı"
          icon={Users}
          tone="info"
        />
        <MetricCard
          title="Kullanıcı"
          value={integerFormatter.format(totalUsers)}
          hint={`${users.filter((entry) => entry.role === 'super_admin').length} süper admin`}
          icon={UserCog}
          tone="neutral"
        />
        <MetricCard
          title="Bakım modu"
          value={maintenanceActive ? 'Açık' : 'Kapalı'}
          hint="Mobil ve kurum paneli"
          icon={AlertTriangle}
          tone={maintenanceActive ? 'warning' : 'success'}
        />
      </div>

      <div className="dashboard-grid">
        <PanelCard
          title="Dikkat isteyen kurumlar"
          eyebrow={`${blockedInstitutions.length} kayıt`}
          action={
            <button className="ghost-button small" onClick={() => setActiveTab('institutions')}>
              Tümünü Aç
              <ArrowUpRight size={16} />
            </button>
          }
        >
          <div className="compact-list">
            {blockedInstitutions.slice(0, 6).map((institution) => {
              const state = getInstitutionState(institution);
              const Icon = state.icon;
              return (
                <button
                  className="compact-row"
                  key={institution.id}
                  onClick={() => {
                    setSelectedInstitutionId(institution.id);
                    setActiveTab('institutions');
                  }}
                >
                  <div className={`row-icon ${state.tone}`}>
                    <Icon size={17} />
                  </div>
                  <div>
                    <strong>{institution.name}</strong>
                    <span>{institution.slug}</span>
                  </div>
                  <StatusPill label={state.label} tone={state.tone} />
                </button>
              );
            })}
            {blockedInstitutions.length === 0 && (
              <div className="empty-state compact">
                <CheckCircle2 size={20} />
                <strong>Kritik kurum yok</strong>
                <span>Tüm kurumlar normal erişim durumunda.</span>
              </div>
            )}
          </div>
        </PanelCard>

        <PanelCard title="Hızlı bakım kontrolü" eyebrow="Bakim Modlari">
          <div className="quick-settings">
            <label className="toggle-row">
              <div>
                <strong>Mobil uygulama</strong>
                <span>{systemSettings.appMaintenance ? 'Bakımda' : 'Açık'}</span>
              </div>
              <ToggleSwitch
                checked={systemSettings.appMaintenance}
                onChange={(checked) => setSystemSettings((prev) => ({ ...prev, appMaintenance: checked }))}
                label="Mobil uygulama bakım modu"
              />
            </label>
            <label className="toggle-row">
              <div>
                <strong>Kurum paneli</strong>
                <span>{systemSettings.panelMaintenance ? 'Bakımda' : 'Açık'}</span>
              </div>
              <ToggleSwitch
                checked={systemSettings.panelMaintenance}
                onChange={(checked) => setSystemSettings((prev) => ({ ...prev, panelMaintenance: checked }))}
                label="Kurum paneli bakım modu"
              />
            </label>
            <button
              className="primary-button wide"
              onClick={handleSaveMaintenance}
              disabled={busyAction === 'maintenance'}
            >
              {busyAction === 'maintenance' ? 'Kaydediliyor...' : 'Bakım Ayarlarını Kaydet'}
            </button>
          </div>
        </PanelCard>
      </div>
    </div>
  );

  const renderAiUsagePage = () => {
    const maxInstitutionCost = Math.max(
      ...sortedAiInstitutions.map((entry) => entry.totals.totalCostUsd || 0),
      0.0001,
    );
    const selectedInstitutionCost = sortedAiInstitutions.find(
      (entry) => entry.institutionId === selectedInstitutionId,
    );

    return (
      <div className="content-stack ai-command-page">
        <section className="ai-command-hero">
          <div>
            <div className="panel-eyebrow">AI Maliyet Takibi</div>
            <h2>Harcamayı izle, sapmayı yakala, nedeni hemen gör.</h2>
            <p>
              Bu ekran token defteri değil; kurum, özellik ve model seviyesinde maliyet sinyali verir.
              En pahalı akışı seç, çağrı başı maliyeti ve son istekleri aynı yerde incele.
            </p>
          </div>
          <div className="ai-hero-controls">
            <div className="segmented-control" aria-label="AI kullanım aralığı">
              {usageDayOptions.map((option) => (
                <button
                  key={option.value}
                  className={aiUsageDays === option.value ? 'active' : ''}
                  onClick={() => setAiUsageDays(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="ai-hero-total">
              <span>Toplam maliyet</span>
              <strong>{usdFormatter.format(aiTotals.totalCostUsd)}</strong>
              <small>{aiTotals.callCount} çağrı / {compactNumberFormatter.format(aiTotals.totalTokens)} token</small>
            </div>
          </div>
        </section>

        <div className="usage-metrics-grid ai-kpi-grid">
          {renderUsageMetric('Çağrı başı maliyet', usdFormatter.format(aiCostPerCall), 'Ortalama istek maliyeti', 'danger', CircleDollarSign)}
          {renderUsageMetric(
            'En pahalı kurum',
            topAiInstitution?.institutionName || '-',
            topAiInstitution ? usdFormatter.format(topAiInstitution.totals.totalCostUsd || 0) : 'Veri yok',
            'warning',
            Building2,
          )}
          {renderUsageMetric(
            'Öğrenci uygulaması',
            usdFormatter.format(mobileAiUsage?.totalCostUsd || 0),
            `${compactNumberFormatter.format(mobileAiUsage?.totalTokens || 0)} token`,
            'info',
            Users,
          )}
          {renderUsageMetric(
            'Dönem trendi',
            `${aiTrendPercent > 0 ? '+' : ''}${Math.round(aiTrendPercent)}%`,
            `${aiUsageDays} günlük ritim`,
            aiTrendPercent > 15 ? 'danger' : aiTrendPercent > 0 ? 'warning' : 'success',
            ArrowUpRight,
          )}
        </div>

        <div className="ai-insight-grid">
          <div className="ai-insight-card">
            <span>Maliyet odağı</span>
            <strong>
              {topAiInstitution
                ? `${topAiInstitution.institutionName} toplam harcamanın ${Math.round(((topAiInstitution.totals.totalCostUsd || 0) / Math.max(aiTotals.totalCostUsd, 0.0001)) * 100)}%'ini kullanıyor.`
                : 'Henüz kurum maliyet verisi yok.'}
            </strong>
          </div>
          <div className="ai-insight-card">
            <span>Kanal dengesi</span>
            <strong>
              Öğrenci uygulaması {Math.round(((mobileAiUsage?.totalCostUsd || 0) / Math.max(aiTotals.totalCostUsd, 0.0001)) * 100)}%,
              kurum paneli {Math.round(((panelAiUsage?.totalCostUsd || 0) / Math.max(aiTotals.totalCostUsd, 0.0001)) * 100)}%.
            </strong>
          </div>
          <div className="ai-insight-card">
            <span>Kontrol noktası</span>
            <strong>
              {aiTrendPercent > 15
                ? 'Artış hızlı; pahalı kurum ve özellik kırılımını kontrol et.'
                : aiTrendPercent > 0
                  ? 'Kullanım artıyor; çağrı başı maliyeti takipte tut.'
                  : 'Trend sakin; olağan dışı maliyet sinyali görünmüyor.'}
            </strong>
          </div>
        </div>

        <div className="ai-control-grid">
          <div className="content-stack dense">
            <PanelCard title="Kurum harcama radarı" eyebrow={`${sortedAiInstitutions.length} kurum`}>
              <div className="ai-institution-radar">
                {sortedAiInstitutions.map((entry, index) => (
                  <button
                    key={entry.institutionId}
                    className={`ai-institution-card ${selectedInstitutionId === entry.institutionId ? 'active' : ''}`}
                    onClick={() => setSelectedInstitutionId(entry.institutionId)}
                  >
                    <div className="ai-institution-rank">{index + 1}</div>
                    <div className="ai-institution-main">
                      <div>
                        <strong>{entry.institutionName}</strong>
                        <span>{entry.totals.callCount} çağrı / {compactNumberFormatter.format(entry.totals.totalTokens || 0)} token</span>
                      </div>
                      <div className="ai-cost-bar">
                        <div style={{ width: `${Math.max(5, ((entry.totals.totalCostUsd || 0) / maxInstitutionCost) * 100)}%` }} />
                      </div>
                    </div>
                    <div className="ai-institution-cost">
                      <strong>{usdFormatter.format(entry.totals.totalCostUsd || 0)}</strong>
                      <span>
                        {entry.totals.callCount
                          ? usdFormatter.format((entry.totals.totalCostUsd || 0) / entry.totals.callCount)
                          : usdFormatter.format(0)}
                        /çağrı
                      </span>
                    </div>
                  </button>
                ))}
                {sortedAiInstitutions.length === 0 && (
                  <div className="empty-state compact">
                    <span>AI kullanımı yok.</span>
                  </div>
                )}
              </div>
            </PanelCard>
            {renderDailyUsage()}
          </div>

          <PanelCard
            className="ai-detail-panel"
            title={selectedInstitutionCost?.institutionName || selectedInstitution?.name || 'Kurum AI detayı'}
            eyebrow={selectedInstitution ? `${aiUsageDays} günlük kullanım` : 'Kurum seçin'}
          >
            {selectedInstitution ? (
              renderInstitutionAiUsage()
            ) : (
              <div className="empty-state">
                <strong>Kurum seçin</strong>
                <span>Soldaki radardan kurum seçerek maliyet kırılımını görebilirsiniz.</span>
              </div>
            )}
          </PanelCard>
        </div>
      </div>
    );
  };

  const renderInstitutions = () => (
    <div className="content-stack" data-contract="Kurum Yonetimi">
      <div className="section-toolbar">
        <div>
          <div className="panel-eyebrow">Kurum Yönetimi</div>
          <h2>Kayıtlı kurumları hızlıca denetle ve aksiyon al.</h2>
          <p>Liste solda kalır; seçtiğin kurumun durum, erişim, şifre ve not kontrolleri sağda açılır.</p>
        </div>
        <div className="toolbar-actions">
          <button className="secondary-button" onClick={handleExportInstitutions}>
            <Download size={18} />
            Dışa Aktar
          </button>
          <button className="primary-button" onClick={openCreateInstitution}>
            <CirclePlus size={18} />
            Yeni Kurum
          </button>
        </div>
      </div>

      <div className="institution-workbench">
        <PanelCard title="Kayıtlı Kurumlar" eyebrow={`${filteredInstitutions.length} kayıt`}>
          <div className="institution-list">
            {filteredInstitutions.map((institution) => {
              const state = getInstitutionState(institution);
              return (
                <button
                  key={institution.id}
                  className={`institution-row ${selectedInstitutionId === institution.id ? 'active' : ''}`}
                  onClick={() => setSelectedInstitutionId(institution.id)}
                >
                  <div
                    className="institution-avatar"
                    style={{ background: institution.primaryColor || '#2367f4' }}
                  >
                    {getInitial(institution.name)}
                  </div>
                  <div className="institution-meta">
                    <strong>{institution.name}</strong>
                    <span>{institution.slug}</span>
                  </div>
                  <div className="institution-mini-stats">
                    <span>{integerFormatter.format(institution._count?.students || 0)} öğrenci</span>
                    <StatusPill label={state.label} tone={state.tone} />
                  </div>
                </button>
              );
            })}
            {filteredInstitutions.length === 0 && (
              <div className="empty-state compact">
                <Search size={20} />
                <strong>Kurum bulunamadı</strong>
                <span>Aramayı temizleyip tekrar deneyin.</span>
              </div>
            )}
          </div>
        </PanelCard>

        <PanelCard
          className="institution-detail-card"
          title={selectedInstitution?.name || 'Kurum Detayı'}
          eyebrow={selectedInstitution?.code || selectedInstitution?.slug || 'Seçim bekleniyor'}
          action={
            selectedInstitution ? (
              <div className="toolbar-actions">
                <button className="secondary-button small" onClick={() => openEditInstitution(selectedInstitution)}>
                  Düzenle
                </button>
                <button
                  className="danger-button small"
                  onClick={() => handleDeleteInstitution(selectedInstitution.id)}
                  disabled={busyAction === `institution-${selectedInstitution.id}`}
                >
                  <Trash2 size={15} />
                  Sil
                </button>
              </div>
            ) : null
          }
        >
          {selectedInstitution ? (
            <div className="content-stack dense">
              <div className="detail-hero">
                <div>
                  <div
                    className="institution-avatar large"
                    style={{ background: selectedInstitution.primaryColor || '#2367f4' }}
                  >
                    {getInitial(selectedInstitution.name)}
                  </div>
                  <div>
                    <h3>{selectedInstitution.name}</h3>
                    <span>{selectedInstitution.slug}</span>
                  </div>
                </div>
                {selectedInstitutionState && (
                  <StatusPill label={selectedInstitutionState.label} tone={selectedInstitutionState.tone} />
                )}
              </div>

              <div className="detail-grid">
                <div className="detail-row">
                  <span>Kurum kodu</span>
                  <strong>{selectedInstitution.code || '-'}</strong>
                </div>
                <div className="detail-row">
                  <span>Öğrenci</span>
                  <strong>{integerFormatter.format(selectedInstitution._count?.students || 0)}</strong>
                </div>
                <div className="detail-row">
                  <span>Kullanıcı</span>
                  <strong>{integerFormatter.format(selectedInstitution._count?.users || 0)}</strong>
                </div>
                <div className="detail-row">
                  <span>Kurum admini</span>
                  <strong>{selectedInstitution.adminUser?.username || '-'}</strong>
                </div>
                <div className="detail-row">
                  <span>Aktif plan</span>
                  <strong>{selectedInstitution.subscriptions?.[0]?.planName || 'Plan yok'}</strong>
                </div>
                <div className="detail-row">
                  <span>Plan bitiş</span>
                  <strong>
                    {selectedInstitution.subscriptions?.[0]?.endDate
                      ? dateFormatter.format(new Date(selectedInstitution.subscriptions[0].endDate))
                      : '-'}
                  </strong>
                </div>
                <div className="detail-row">
                  <span>Kontrat</span>
                  <strong>
                    {selectedInstitution.subscriptions?.[0]?.amount
                      ? currencyFormatter.format(selectedInstitution.subscriptions[0].amount)
                      : '-'}
                  </strong>
                </div>
                <div className="detail-row">
                  <span>Panel erişimi</span>
                  <StatusPill
                    tone={selectedInstitution.controls?.panelAccess === false ? 'danger' : 'success'}
                    label={selectedInstitution.controls?.panelAccess === false ? 'Kapalı' : 'Açık'}
                  />
                </div>
              </div>

              <div className="action-strip">
                <button
                  className="secondary-button"
                  onClick={() => handleToggleInstitutionPanelAccess(selectedInstitution)}
                  disabled={busyAction === `institution-access-${selectedInstitution.id}`}
                >
                  <PanelTop size={18} />
                  {selectedInstitution.controls?.panelAccess === false ? 'Girişi Aç' : 'Girişi Kapat'}
                </button>
                <button
                  className="secondary-button"
                  onClick={() => handleToggleInstitutionStatus(selectedInstitution)}
                  disabled={busyAction === `institution-status-${selectedInstitution.id}`}
                >
                  <SlidersHorizontal size={18} />
                  {selectedInstitution.status === 'active' ? 'Pasife Al' : 'Aktif Et'}
                </button>
                <button
                  className="secondary-button"
                  title="Admin Sifresi Sifirla"
                  onClick={() => {
                    setNextAdminPassword('');
                    setAdminPasswordModalOpen(true);
                  }}
                >
                  <KeyRound size={18} />
                  Admin Şifresi Sıfırla
                </button>
              </div>

              <div className="subsection-card" data-contract="Kurum erisimi ve notlar">
                <div className="subsection-header">
                  <div>
                    <strong>Kurum erişimi ve notlar</strong>
                    <span>Kurum paneli girişini, bakım mesajını ve iç operasyon notunu buradan yönet.</span>
                  </div>
                  <StatusPill
                    tone={
                      !institutionControlsForm.panelAccess
                        ? 'danger'
                        : institutionControlsForm.maintenanceMode
                          ? 'warning'
                          : 'success'
                    }
                    label={
                      !institutionControlsForm.panelAccess
                        ? 'Giriş kapalı'
                        : institutionControlsForm.maintenanceMode
                          ? 'Bakımda'
                          : 'Normal'
                    }
                  />
                </div>

                <div className="maintenance-card">
                  <label className="toggle-row">
                    <div>
                      <strong>Panel erişimi açık</strong>
                      <span>Kapatıldığında kurum adminleri kendi paneline giriş yapamaz.</span>
                    </div>
                    <ToggleSwitch
                      checked={institutionControlsForm.panelAccess}
                      onChange={(checked) =>
                        setInstitutionControlsForm((prev) => ({ ...prev, panelAccess: checked }))
                      }
                      label="Kurum panel erişimi"
                    />
                  </label>

                  <label className="toggle-row">
                    <div>
                      <strong>Kurum paneli bakım modunda</strong>
                      <span>Açık olduğunda kuruma özel bakım mesajı gösterilir.</span>
                    </div>
                    <ToggleSwitch
                      checked={institutionControlsForm.maintenanceMode}
                      onChange={(checked) =>
                        setInstitutionControlsForm((prev) => ({ ...prev, maintenanceMode: checked }))
                      }
                      label="Kurum paneli bakım modu"
                    />
                  </label>

                  <label>
                    <span>Bakım mesajı</span>
                    <textarea
                      rows={4}
                      value={institutionControlsForm.maintenanceMessage}
                      onChange={(event) =>
                        setInstitutionControlsForm((prev) => ({
                          ...prev,
                          maintenanceMessage: event.target.value,
                        }))
                      }
                      placeholder="Kurum paneli geçici olarak bakımdadır."
                    />
                  </label>

                  <label>
                    <span>Süper admin notu</span>
                    <textarea
                      rows={4}
                      value={institutionControlsForm.internalNote}
                      onChange={(event) =>
                        setInstitutionControlsForm((prev) => ({
                          ...prev,
                          internalNote: event.target.value,
                        }))
                      }
                      placeholder="Bu kurumla ilgili iç notlarını buraya yaz."
                    />
                  </label>

                  <div className="subsection-actions">
                    <button
                      className="secondary-button"
                      title="Admin Sifresi Sifirla"
                      onClick={() => {
                        setNextAdminPassword('');
                        setAdminPasswordModalOpen(true);
                      }}
                    >
                      <KeyRound size={18} />
                      Admin Şifresi Sıfırla
                    </button>
                    <button
                      className="primary-button"
                      onClick={handleSaveInstitutionControls}
                      disabled={busyAction === `institution-controls-${selectedInstitution.id}`}
                    >
                      {busyAction === `institution-controls-${selectedInstitution.id}`
                        ? 'Kaydediliyor...'
                        : 'Kurum Ayarlarını Kaydet'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <Building2 size={24} />
              <strong>Kurum seçin</strong>
              <span>Soldan bir kurum seçerek detaylarını görebilirsiniz.</span>
            </div>
          )}
        </PanelCard>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="content-stack" data-contract="Kullanici Yonetimi">
      <div className="section-toolbar">
        <div>
          <div className="panel-eyebrow">Kullanıcı Yönetimi</div>
          <h2>Rolleri, kurum bağlantılarını ve erişimi temiz bir listede yönet.</h2>
        </div>
        <div className="toolbar-actions">
          <button className="primary-button" onClick={openCreateUser}>
            <CirclePlus size={18} />
            Yeni Kullanıcı
          </button>
        </div>
      </div>

      <div className="role-summary">
        {['super_admin', 'admin', 'teacher'].map((role) => (
          <div className="role-chip" key={role}>
            <span>{roleLabels[role]}</span>
            <strong>{users.filter((entry) => entry.role === role).length}</strong>
          </div>
        ))}
      </div>

      <PanelCard title="Kullanıcı Listesi" eyebrow={`${filteredUsers.length} kayıt`}>
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Kullanıcı</th>
                <th>Rol</th>
                <th>Kurum</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((entry) => (
                <tr key={entry.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">{getInitial(entry.name || entry.username)}</div>
                      <div className="table-primary">
                        <strong>{entry.name || 'İsimsiz'}</strong>
                        <span>
                          @{entry.username || 'yok'} / {entry.email || 'E-posta yok'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <StatusPill label={roleLabels[entry.role || ''] || entry.role || '-'} tone="info" />
                  </td>
                  <td>{entry.institution?.name || 'Sistem geneli'}</td>
                  <td>
                    <div className="table-actions">
                      <button className="secondary-button small" onClick={() => openEditUser(entry)}>
                        Düzenle
                      </button>
                      <button
                        className="danger-button small"
                        onClick={() => handleDeleteUser(entry.id)}
                        disabled={busyAction === `user-${entry.id}`}
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4}>Kullanıcı bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </PanelCard>
    </div>
  );

  const renderMaintenance = () => (
    <div className="content-stack" data-contract="Bakim Modlari">
      <div className="section-toolbar">
        <div>
          <div className="panel-eyebrow">Bakım Modları</div>
          <h2>Uygulamayı ve kurum panelini kontrollü biçimde bakıma al.</h2>
          <p>Her kanal için ayrı mesaj yaz; kaydetmeden canlıya alınmaz.</p>
        </div>
        <div className="toolbar-actions">
          <button
            className="primary-button"
            onClick={handleSaveMaintenance}
            disabled={busyAction === 'maintenance'}
          >
            {busyAction === 'maintenance' ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>

      <div className="analytics-grid">
        <PanelCard title="Mobil Uygulama" eyebrow="App Maintenance">
          <div className="maintenance-card">
            <label className="toggle-row">
              <div>
                <strong>Bakım modu</strong>
                <span>Mobil uygulama kullanıcılarına bakım mesajı göster.</span>
              </div>
              <ToggleSwitch
                checked={systemSettings.appMaintenance}
                onChange={(checked) => setSystemSettings((prev) => ({ ...prev, appMaintenance: checked }))}
                label="Mobil bakım modu"
              />
            </label>
            <label>
              <span>Mesaj</span>
              <textarea
                rows={5}
                value={systemSettings.appMaintenanceMessage}
                onChange={(event) =>
                  setSystemSettings((prev) => ({
                    ...prev,
                    appMaintenanceMessage: event.target.value,
                  }))
                }
                placeholder="Uygulama bakımdadır. Lütfen daha sonra tekrar deneyin."
              />
            </label>
          </div>
        </PanelCard>

        <PanelCard title="Kurum Paneli" eyebrow="Panel Maintenance">
          <div className="maintenance-card">
            <label className="toggle-row">
              <div>
                <strong>Bakım modu</strong>
                <span>Kurum yönetim panelini geçici olarak kapat.</span>
              </div>
              <ToggleSwitch
                checked={systemSettings.panelMaintenance}
                onChange={(checked) => setSystemSettings((prev) => ({ ...prev, panelMaintenance: checked }))}
                label="Kurum paneli bakım modu"
              />
            </label>
            <label>
              <span>Mesaj</span>
              <textarea
                rows={5}
                value={systemSettings.panelMaintenanceMessage}
                onChange={(event) =>
                  setSystemSettings((prev) => ({
                    ...prev,
                    panelMaintenanceMessage: event.target.value,
                  }))
                }
                placeholder="Panel geçici olarak bakımdadır."
              />
            </label>
          </div>
        </PanelCard>
      </div>

      <PanelCard title="Son kayıt" eyebrow="Sistem ayarı geçmişi">
        <div className="detail-grid">
          <div className="detail-row">
            <span>Uygulama</span>
            <StatusPill
              tone={systemSettings.appMaintenance ? 'warning' : 'success'}
              label={systemSettings.appMaintenance ? 'Bakımda' : 'Açık'}
            />
          </div>
          <div className="detail-row">
            <span>Kurum paneli</span>
            <StatusPill
              tone={systemSettings.panelMaintenance ? 'warning' : 'success'}
              label={systemSettings.panelMaintenance ? 'Bakımda' : 'Açık'}
            />
          </div>
          <div className="detail-row">
            <span>Son güncelleme</span>
            <strong>
              {systemSettings.updatedAt
                ? dateFormatter.format(new Date(systemSettings.updatedAt))
                : '-'}
            </strong>
          </div>
        </div>
      </PanelCard>
    </div>
  );

  const renderTabContent = () => {
    if (activeTab === 'overview') return renderOverview();
    if (activeTab === 'institutions') return renderInstitutions();
    if (activeTab === 'aiUsage') return renderAiUsagePage();
    if (activeTab === 'users') return renderUsers();
    return renderMaintenance();
  };

  if (!user) {
    return <Login onLoginSuccess={(loggedUser) => setUser(loggedUser)} />;
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">Y</div>
          <div>
            <strong>YKS Admin</strong>
            <span>Super admin paneli</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                data-contract={tab.contractLabel}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-status">
          <div>
            <span>Durum</span>
            <strong>{maintenanceActive ? 'Bakım aktif' : 'Operasyon açık'}</strong>
          </div>
          <StatusPill label={maintenanceActive ? 'Kontrol et' : 'Normal'} tone={maintenanceActive ? 'warning' : 'success'} />
        </div>

        <div className="sidebar-footer">
          <div className="identity-card">
            <div className="identity-avatar">{getInitial(user.name || user.username || user.avatar)}</div>
            <div>
              <strong>{user.name || 'Super Admin'}</strong>
              <span>{roleLabels[user.role || 'super_admin'] || user.role || 'super_admin'}</span>
            </div>
          </div>
          <button className="secondary-button wide sidebar-logout" onClick={handleLogout}>
            <LogOut size={18} />
            Çıkış
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span>{activePage.label}</span>
            <h2>{activePage.contractLabel === 'Genel' ? 'Genel Bakış' : activePage.label}</h2>
          </div>

          <div className="topbar-actions">
            <div className="search-shell">
              <Search size={18} />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={
                  activeTab === 'users'
                    ? 'Kullanıcı, rol veya kurum ara...'
                    : activeTab === 'aiUsage'
                      ? 'AI kurumlarında ara...'
                      : 'Kurum, slug veya durum ara...'
                }
              />
            </div>
            <button className="secondary-button" onClick={() => refreshData(true)}>
              <RefreshCw size={18} className={refreshing ? 'spinning' : ''} />
              Yenile
            </button>
          </div>
        </header>

        <section className="admin-content">
          {error && (
            <div className="inline-alert">
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="loading-state">
              <RefreshCw size={22} className="spinning" />
              <strong>Panel yükleniyor...</strong>
              <span>Kurum ve sistem ayarları hazırlanıyor.</span>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          )}
        </section>
      </main>

      <ModalShell
        open={institutionModalOpen}
        title={institutionForm.id ? 'Kurumu Düzenle' : 'Yeni Kurum'}
        subtitle="Kurum ve ilk admin bilgileri"
        onClose={() => setInstitutionModalOpen(false)}
      >
        <form className="modal-form" onSubmit={handleSaveInstitution}>
          <label>
            <span>Kurum adı</span>
            <input
              value={institutionForm.name}
              onChange={(event) => {
                const name = event.target.value;
                setInstitutionForm((prev) => ({
                  ...prev,
                  name,
                  slug: prev.id ? prev.slug : slugify(name),
                  username: prev.id ? prev.username : slugify(name),
                }));
              }}
              required
            />
          </label>

          <div className="form-grid">
            <label>
              <span>Slug</span>
              <input
                value={institutionForm.slug}
                onChange={(event) =>
                  setInstitutionForm((prev) => ({ ...prev, slug: slugify(event.target.value) }))
                }
                required
              />
            </label>
            <label>
              <span>Admin kullanıcı adı</span>
              <input
                value={institutionForm.username}
                onChange={(event) =>
                  setInstitutionForm((prev) => ({ ...prev, username: event.target.value }))
                }
                required
              />
            </label>
          </div>

          <div className="form-grid">
            <label>
              <span>{institutionForm.id ? 'Yeni şifre (opsiyonel)' : 'Admin şifresi'}</span>
              <input
                type="password"
                value={institutionForm.password}
                onChange={(event) =>
                  setInstitutionForm((prev) => ({ ...prev, password: event.target.value }))
                }
                required={!institutionForm.id}
              />
            </label>
            <label>
              <span>Durum</span>
              <select
                value={institutionForm.status}
                onChange={(event) =>
                  setInstitutionForm((prev) => ({ ...prev, status: event.target.value }))
                }
              >
                <option value="active">Aktif</option>
                <option value="passive">Pasif</option>
              </select>
            </label>
          </div>

          <div className="form-grid">
            <label>
              <span>Ana renk</span>
              <input
                type="color"
                value={institutionForm.primaryColor}
                onChange={(event) =>
                  setInstitutionForm((prev) => ({ ...prev, primaryColor: event.target.value }))
                }
              />
            </label>
            <label>
              <span>İkinci renk</span>
              <input
                type="color"
                value={institutionForm.secondaryColor}
                onChange={(event) =>
                  setInstitutionForm((prev) => ({ ...prev, secondaryColor: event.target.value }))
                }
              />
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={() => setInstitutionModalOpen(false)}>
              Vazgeç
            </button>
            <button type="submit" className="primary-button" disabled={busyAction === 'institution'}>
              {busyAction === 'institution' ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </ModalShell>

      <ModalShell
        open={adminPasswordModalOpen}
        title="Admin Şifresini Sıfırla"
        subtitle={selectedInstitution ? `${selectedInstitution.name} için yeni şifre belirle` : undefined}
        onClose={() => setAdminPasswordModalOpen(false)}
      >
        <form className="modal-form" onSubmit={handleResetInstitutionAdminPassword}>
          <label>
            <span>Yeni şifre</span>
            <input
              type="password"
              value={nextAdminPassword}
              onChange={(event) => setNextAdminPassword(event.target.value)}
              required
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={() => setAdminPasswordModalOpen(false)}>
              Vazgeç
            </button>
            <button
              type="submit"
              className="primary-button"
              disabled={Boolean(
                selectedInstitution && busyAction === `institution-password-${selectedInstitution.id}`,
              )}
            >
              {selectedInstitution && busyAction === `institution-password-${selectedInstitution.id}`
                ? 'Sıfırlanıyor...'
                : 'Şifreyi Güncelle'}
            </button>
          </div>
        </form>
      </ModalShell>

      <ModalShell
        open={userModalOpen}
        title={userForm.id ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı'}
        subtitle="Rol ve kurum erişimi"
        onClose={() => setUserModalOpen(false)}
      >
        <form className="modal-form" onSubmit={handleSaveUser}>
          <label>
            <span>Ad soyad</span>
            <input
              value={userForm.name}
              onChange={(event) => setUserForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
          </label>

          <div className="form-grid">
            <label>
              <span>Kullanıcı adı</span>
              <input
                value={userForm.username}
                onChange={(event) =>
                  setUserForm((prev) => ({ ...prev, username: event.target.value }))
                }
                required={!userForm.id}
                disabled={Boolean(userForm.id)}
              />
            </label>
            <label>
              <span>E-posta</span>
              <input
                type="email"
                value={userForm.email}
                onChange={(event) => setUserForm((prev) => ({ ...prev, email: event.target.value }))}
                required
              />
            </label>
          </div>

          <div className="form-grid">
            <label>
              <span>{userForm.id ? 'Yeni şifre (opsiyonel)' : 'Şifre'}</span>
              <input
                type="password"
                value={userForm.password}
                onChange={(event) =>
                  setUserForm((prev) => ({ ...prev, password: event.target.value }))
                }
                required={!userForm.id}
              />
            </label>
            <label>
              <span>Rol</span>
              <select
                value={userForm.role}
                onChange={(event) => setUserForm((prev) => ({ ...prev, role: event.target.value }))}
              >
                <option value="admin">Admin</option>
                <option value="teacher">Öğretmen</option>
                <option value="super_admin">Süper Admin</option>
              </select>
            </label>
          </div>

          <label>
            <span>Kurum</span>
            <select
              value={userForm.institutionId}
              onChange={(event) =>
                setUserForm((prev) => ({ ...prev, institutionId: event.target.value }))
              }
            >
              <option value="">Sistem geneli</option>
              {institutions.map((institution) => (
                <option key={institution.id} value={institution.id}>
                  {institution.name}
                </option>
              ))}
            </select>
          </label>

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={() => setUserModalOpen(false)}>
              Vazgeç
            </button>
            <button type="submit" className="primary-button" disabled={busyAction === 'user'}>
              {busyAction === 'user' ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </ModalShell>
    </div>
  );
};

export default App;
