import { getAcademicUnitBySlug } from "@/app/actions/academic";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  BookOpen, 
  Users, 
  FileText, 
  ArrowLeft,
  ChevronRight,
  Info,
  Building2,
  Calendar,
  Award,
  Stethoscope,
  Cpu,
  Scale,
  Palette,
  Atom,
  Languages,
  Microscope,
  ShieldCheck,
  Dumbbell
} from "lucide-react";
import { cn } from "@/lib/utils";
import DepartmentList from "./DepartmentList";

interface PageProps {
  params: Promise<{
    type: string;
    slug: string;
  }>;
}

// Helper to determine theme based on unit name/type
const getUnitTheme = (name: string, type: string) => {
  const n = name.toLowerCase();
  
  if (n.includes('diş') || n.includes('tıp') || n.includes('sağlık') || n.includes('eczacı')) {
    return {
      primary: '#0d9488', // Teal
      bgClass: 'bg-teal-600',
      textClass: 'text-teal-600',
      shadowClass: 'shadow-teal-600/20',
      icon: Stethoscope,
      accent: 'text-teal-400',
      lightBg: 'bg-teal-50',
      borderClass: 'border-teal-500/20'
    };
  }
  
  if (n.includes('mühendis') || n.includes('teknik') || n.includes('bilgi') || n.includes('mimarlık')) {
    return {
      primary: '#f97316', // Orange
      bgClass: 'bg-orange-600',
      textClass: 'text-orange-600',
      shadowClass: 'shadow-orange-600/20',
      icon: Cpu,
      accent: 'text-orange-400',
      lightBg: 'bg-orange-50',
      borderClass: 'border-orange-500/20'
    };
  }

  if (n.includes('hukuk') || n.includes('iktisat') || n.includes('siyasal') || n.includes('adalet')) {
    return {
      primary: '#1e40af', // Blue 800
      bgClass: 'bg-blue-800',
      textClass: 'text-blue-800',
      shadowClass: 'shadow-blue-800/20',
      icon: Scale,
      accent: 'text-blue-400',
      lightBg: 'bg-blue-50',
      borderClass: 'border-blue-500/20'
    };
  }

  if (n.includes('fen') || n.includes('biyoloji') || n.includes('kimya') || n.includes('fizik')) {
    return {
      primary: '#0891b2', // Cyan 600
      bgClass: 'bg-cyan-600',
      textClass: 'text-cyan-600',
      shadowClass: 'shadow-cyan-600/20',
      icon: Atom,
      accent: 'text-cyan-400',
      lightBg: 'bg-cyan-50',
      borderClass: 'border-cyan-500/20'
    };
  }

  if (n.includes('güzel') || n.includes('sanat') || n.includes('iletişim') || n.includes('konservatuvar')) {
    return {
      primary: '#9333ea', // Purple 600
      bgClass: 'bg-purple-600',
      textClass: 'text-purple-600',
      shadowClass: 'shadow-purple-600/20',
      icon: Palette,
      accent: 'text-purple-400',
      lightBg: 'bg-purple-50',
      borderClass: 'border-purple-500/20'
    };
  }

  if (n.includes('eğitim') || n.includes('ilahiyat') || n.includes('sosyal') || n.includes('edebiyat')) {
    return {
      primary: '#16a34a', // Green 600
      bgClass: 'bg-green-600',
      textClass: 'text-green-600',
      shadowClass: 'shadow-green-600/20',
      icon: BookOpen,
      accent: 'text-green-400',
      lightBg: 'bg-green-50',
      borderClass: 'border-green-500/20'
    };
  }

  if (n.includes('spor')) {
    return {
      primary: '#dc2626', // Red 600
      bgClass: 'bg-red-600',
      textClass: 'text-red-600',
      shadowClass: 'shadow-red-600/20',
      icon: Dumbbell,
      accent: 'text-red-400',
      lightBg: 'bg-red-50',
      borderClass: 'border-red-500/20'
    };
  }

  // Default theme
  return {
    primary: '#4f46e5', // Indigo
    bgClass: 'bg-indigo-600',
    textClass: 'text-indigo-600',
    shadowClass: 'shadow-indigo-600/20',
    icon: GraduationCap,
    accent: 'text-indigo-400',
    lightBg: 'bg-indigo-50',
    borderClass: 'border-indigo-500/20'
  };
};

export default async function AcademicDetailPage({ params }: PageProps) {
  const { type, slug } = await params;
  const { data: unit, success } = await getAcademicUnitBySlug(slug);

  if (!success || !unit) {
    return notFound();
  }

  const theme = getUnitTheme(unit.name, unit.type);
  const departments = unit.departments ? unit.departments.split(',').map((d: string) => d.trim()).filter((d: string) => d) : [];
  const ThemeIcon = theme.icon;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Breadcrumbs & Navigation */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link 
              href={`/akademik/${type}`}
              className={cn("flex items-center gap-1 text-slate-500 transition-colors hover:", theme.textClass)}
            >
              <ArrowLeft className="w-4 h-4" />
              Geri Dön
            </Link>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
            <span className="text-slate-400">Akademik</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className="text-slate-900 dark:text-white truncate max-w-[200px]">{unit.name}</span>
          </div>

          {unit.website && (
            <a 
              href={unit.website}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "hidden md:flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-semibold transition-all shadow-lg hover:opacity-90",
                theme.bgClass,
                theme.shadowClass
              )}
            >
              <Globe className="w-4 h-4" />
              Birim Web Sitesi
            </a>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#020617] text-white py-20 px-6">
        <div 
           className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" 
           style={{ 
             backgroundImage: `radial-gradient(circle at 2px 2px, ${theme.primary}50 1px, transparent 0)`,
             backgroundSize: '40px 40px'
           }}
        />
        <div className={cn("absolute inset-0 blur-3xl opacity-20 pointer-events-none bg-gradient-to-br from-slate-950", `via-${theme.bgClass}/10`, "to-slate-950")} />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-6 max-w-3xl">
              <div className={cn(
                "inline-flex items-center gap-2 px-3 py-1 border rounded-full text-xs font-bold uppercase tracking-wider",
                `bg-${theme.bgClass}/10`,
                theme.borderClass,
                theme.accent
              )}>
                {unit.type === 'FACULTY' ? 'Fakülte' : unit.type}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                {unit.name}
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed italic">
                "{unit.description || 'Dicle Üniversitesi bünyesinde eğitim veren köklü ve modern bir akademik birim.'}"
              </p>
            </div>

            {unit.leader && (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center gap-4 min-w-[300px]">
                <div 
                   className="w-14 h-14 rounded-full flex items-center justify-center border transition-transform hover:scale-105"
                   style={{ backgroundColor: `${theme.primary}20`, borderColor: `${theme.primary}40` }}
                >
                  <ThemeIcon className={cn("w-8 h-8", theme.accent)} />
                </div>
                <div>
                  <div className={cn("text-xs font-bold uppercase tracking-widest mb-1", theme.accent)}>Dekan / Müdür</div>
                  <div className="text-lg font-bold text-white">{unit.leader}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Quick Stats/Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-4", theme.lightBg)}>
                    <BookOpen className={cn("w-5 h-5", theme.textClass)} />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{departments.length}</div>
                  <div className="text-sm text-slate-500">Aktif Bölüm</div>
               </div>
               <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <Users className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">100+</div>
                  <div className="text-sm text-slate-500">Akademik Personel</div>
               </div>
               <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <Award className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">A+</div>
                  <div className="text-sm text-slate-500">Yükseköğretim Kalitesi</div>
               </div>
            </div>

            {/* About Section */}
            <section id="hakkimizda" className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg" style={{ backgroundColor: theme.primary, boxShadow: `0 10px 15px -3px ${theme.primary}30` }}>
                  <Info className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Hakkımızda</h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                  {unit.name}, Dicle Üniversitesi'nin en köklü ve saygın akademik birimlerinden biridir. 
                  Yıllardır verdiği kaliteli eğitim, yürüttüğü bilimsel araştırmalar ve topluma sunduğu hizmetlerle 
                  alanında öncü bir konumdadır. Modern teknoloji ile donatılmış laboratuvarları, zengin kütüphanesi 
                  ve deneyimli akademik kadrosuyla öğrencilerine dünya standartlarında bir eğitim ortamı sunmaktadır.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 underline decoration-2 underline-offset-4" style={{ textDecorationColor: theme.primary }}>Misyonumuz</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Evrensel değerler ışığında, bilim ve teknolojiyi kullanarak toplumun gelişimine katkı sağlayacak donanımlı bireyler yetiştirmek.</p>
                  </div>
                  <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 underline decoration-2 underline-offset-4" style={{ textDecorationColor: theme.primary }}>Vizyonumuz</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Ulusal ve uluslararası düzeyde tanınan, araştırmacı ve yenilikçi kimliğiyle öne çıkan bir eğitim ve bilim merkezi olmak.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Departments Section */}
            <DepartmentList departments={departments} color={theme.primary} />

            {/* Specialized High-Impact Section */}
            {(unit.name.toLowerCase().includes('tıp') || unit.name.toLowerCase().includes('diş')) && (
               <section id="klinikler" className="space-y-6 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg" style={{ backgroundColor: theme.primary }}>
                      <Stethoscope className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Sağlık Hizmetleri ve Klinikler</h2>
                  </div>
                  <div className="p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group border border-white/10" style={{ backgroundColor: theme.primary }}>
                    <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-12 -translate-y-12 rotate-12 transition-transform group-hover:scale-110 pointer-events-none">
                      <Stethoscope className="w-48 h-48" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Gelişmiş Tedavi ve Tanı Üniteleri</h3>
                      <p className="text-white/90 text-lg mb-8 leading-relaxed max-w-2xl font-medium">
                        Fakültemize bağlı uzmanlık hastanesi bünyesinde, tüm uzmanlık alanlarında modern cihazlarla donatılmış 
                        kliniklerimizde halkımıza sağlık hizmeti sunmaktayız. Öğrencilerimiz uzman akademisyenler gözetiminde 
                        en güncel tedavi yöntemlerini uygulama fırsatı bulmaktadır.
                      </p>
                      <button className={cn("px-8 py-3 bg-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 hover:scale-105 transition-all shadow-xl shadow-black/20", theme.textClass)}>
                        Randevu ve Bilgi Al
                      </button>
                    </div>
                  </div>
               </section>
            )}

            {/* Engineering Pattern Section */}
            {(unit.name.toLowerCase().includes('mühendis') || unit.name.toLowerCase().includes('teknik')) && (
              <section id="proje-lab" className="space-y-6 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg" style={{ backgroundColor: theme.primary }}>
                      <Cpu className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">AR-GE ve İnovasyon</h2>
                  </div>
                  <div className="p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group" style={{ backgroundColor: theme.primary }}>
                    <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 transition-transform group-hover:scale-110 pointer-events-none">
                      <Cpu className="w-64 h-64" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Geleceği Tasarlayan Teknolojiler</h3>
                      <p className="text-white/90 text-lg mb-8 leading-relaxed max-w-2xl font-medium">
                        Uluslararası standartlarda laboratuvar altyapımız ve TÜBİTAK destekli dev projelerimizle, 
                        bilimsel üretimin merkezindeyiz. Öğrencilerimiz henüz lisans seviyesinde teknofest ve 
                        patent süreçlerine dahil edilmektedir.
                      </p>
                      <button className={cn("px-8 py-3 bg-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 hover:scale-105 transition-all shadow-xl shadow-black/20", theme.textClass)}>
                        Laboratuvar Envanteri
                      </button>
                    </div>
                  </div>
               </section>
            )}

            {/* Social/Humanities Pattern Section */}
            {(unit.name.toLowerCase().includes('hukuk') || unit.name.toLowerCase().includes('sosyal') || unit.name.toLowerCase().includes('ilahiyat') || unit.name.toLowerCase().includes('edebiyat')) && (
              <section id="kultur" className="space-y-6 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg" style={{ backgroundColor: theme.primary }}>
                    <Languages className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Bilgi ve Toplum</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                   <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 transition-colors group">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/20">
                          <ShieldCheck className="w-6 h-6 text-blue-600" />
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Akademik Yayınlar</h4>
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed mb-6">Birimimiz bünyesinde çıkarılan uluslararası hakemli dergiler ve makale arşivimize buradan ulaşabilirsiniz.</p>
                      <button className="text-blue-600 text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Arşivi İncele <ChevronRight className="w-4 h-4" />
                      </button>
                   </div>
                   <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-green-500 transition-colors group">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-50 dark:bg-green-900/20">
                          <Info className="w-6 h-6 text-green-600" />
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Toplumsal Katkı</h4>
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed mb-6">Alanımızdaki uzmanlığı toplumla paylaştığımız sosyal sorumluluk ve danışmanlık faaliyetlerimiz.</p>
                      <button className="text-green-600 text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Faaliyet Raporu <ChevronRight className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Contact Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div 
                 className="p-6 border-b border-slate-200 dark:border-slate-700"
                 style={{ backgroundColor: `${theme.primary}08` }}
              >
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Mail className="w-5 h-5" style={{ color: theme.primary }} /> İletişim Bilgileri
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Adres</div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {unit.address || 'Dicle Üniversitesi Kampüsü, Sur / DİYARBAKIR'}
                    </p>
                  </div>
                </div>

                {unit.phone && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-1">Telefon</div>
                      <a href={`tel:${unit.phone}`} className={cn("text-sm transition-colors font-medium hover:", theme.textClass)}>
                        {unit.phone}
                      </a>
                    </div>
                  </div>
                )}

                {unit.email && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-1">E-Posta</div>
                      <a href={`mailto:${unit.email}`} className={cn("text-sm transition-colors font-medium hover:", theme.textClass)}>
                        {unit.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links / Documents */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div 
                 className="p-6 border-b border-slate-200 dark:border-slate-700"
                 style={{ backgroundColor: `${theme.primary}08` }}
              >
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" style={{ color: theme.primary }} /> Hızlı Erişim
                </h3>
              </div>
              <div className="p-2 space-y-1">
                {[
                  { name: 'Akademik Takvim', icon: Calendar, url: '#' },
                  { name: 'Öğrenci Kılavuzu', icon: Info, url: '#' },
                  { name: 'Staj Başvuruları', icon: FileText, url: '#' },
                  { name: 'Yönetmelikler', icon: FileText, url: '#' }
                ].map((link, idx) => (
                  <Link 
                    key={idx} 
                    href={link.url}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{link.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
