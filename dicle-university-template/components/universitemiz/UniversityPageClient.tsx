"use client";

import { PageHeader } from "@/components/layout/PageLayout";
import { Building2, History, Users, Award, ChevronRight, FileText, Layout, Info, ShieldCheck, HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function UniversityPageClient({ allPages }: { allPages: any[] }) {
    const { t } = useLanguage();

    // Group pages by category
    const kurumsal = allPages?.filter(p => p.category === "KURUMSAL") || [];
    const idari = allPages?.filter(p => p.category === "IDARI") || [];
    const bilgi = allPages?.filter(p => p.category === "BILGI") || [];
    const hizmet = allPages?.filter(p => p.category === "HIZMET") || [];

    const stats = [
        { label: t("uni.estYear"), value: "1973", icon: <History className="w-6 h-6" />, color: "blue" },
        { label: t("uni.facultyCount"), value: "15", icon: <Building2 className="w-6 h-6" />, color: "green" },
        { label: t("uni.studentCount"), value: "30K+", icon: <Users className="w-6 h-6" />, color: "purple" },
        { label: t("uni.academicStaff"), value: "2K+", icon: <Award className="w-6 h-6" />, color: "orange" },
    ];

    return (
        <main className="min-h-screen bg-slate-50 pb-20">
            <PageHeader
                title={t("nav.university")}
                description={t("hero.subtitle")}
            />

            <div className="container-custom py-12">
                {/* Intro & Stats Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
                    <div className="lg:col-span-7 max-w-none">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">{t("uni.pastFuture")}</h2>
                        <p className="text-lg text-slate-600 leading-relaxed mb-6">
                            {t("uni.intro1")}
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            {t("uni.intro2")}
                        </p>
                    </div>

                    <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                                    stat.color === 'green' ? 'bg-green-100 text-green-600' :
                                        stat.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                                            'bg-orange-100 text-orange-600'
                                    }`}>
                                    {stat.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                                <p className="text-xs text-slate-500 uppercase font-semibold">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Database Powered Links Grid */}
                <div className="space-y-12">
                    <div className="border-t border-slate-200 pt-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                            <span className="w-8 h-1 bg-[var(--primary)] rounded-full"></span>
                            {t("uni.corporate")}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {kurumsal.map((page) => (
                                <Link
                                    key={page.id}
                                    href={`/universitemiz/${page.slug}`}
                                    className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-[var(--primary)] hover:shadow-xl transition-all"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-blue-50 text-[var(--primary)] rounded-xl group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                                            <Info size={24} />
                                        </div>
                                        <ChevronRight size={20} className="text-slate-300 group-hover:text-[var(--primary)] transition-colors" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{page.title}</h3>
                                    <p className="text-sm text-slate-500 line-clamp-2">{t("uni.corporateDesc").replace('{title}', page.title.toLowerCase())}</p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="bg-slate-100/50 p-8 rounded-3xl border border-slate-200">
                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <HelpCircle className="text-[var(--primary)]" /> {t("nav.research")}
                            </h3>
                            <div className="space-y-4">
                                {bilgi.length > 0 ? bilgi.map(page => (
                                    <Link
                                        key={page.id}
                                        href={`/universitemiz/${page.slug}`}
                                        className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-[var(--primary)] transition-colors group"
                                    >
                                        <span className="font-semibold text-slate-700 group-hover:text-[var(--primary)]">{page.title}</span>
                                        <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                )) : <p className="text-sm text-slate-400 italic">No content found.</p>}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Layout className="text-green-600" size={20} /> {t("footer.quickLinks")}
                                </h3>
                                <div className="grid grid-cols-1 gap-2">
                                    {hizmet.map(page => (
                                        <Link key={page.id} href={`/universitemiz/${page.slug}`} className="text-sm text-slate-600 hover:text-[var(--primary)] flex items-center gap-2 py-1">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> {page.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <ShieldCheck className="text-red-600" size={20} /> {t("uni.adminStructure")}
                                </h3>
                                <div className="grid grid-cols-1 gap-2">
                                    {idari.map(page => (
                                        <Link key={page.id} href={`/universitemiz/${page.slug}`} className="text-sm text-slate-600 hover:text-[var(--primary)] flex items-center gap-2 py-1">
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> {page.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
