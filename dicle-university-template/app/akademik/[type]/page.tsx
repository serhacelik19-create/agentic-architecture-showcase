import { getAcademicUnits } from "@/app/actions/academic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GraduationCap, ArrowRight, Globe, School, BookOpen, ChevronDown, ChevronUp, MapPin, Phone, Mail, User } from "lucide-react";
import AcademicCard from "./AcademicCard"; // We will extract this to a Client Component for interactivity

// Map URL slugs to Database Types and Display Titles
const TYPE_MAP: Record<string, { type: string, title: string, subtitle: string }> = {
    'fakulteler': { type: 'FACULTY', title: 'Fakülteler', subtitle: 'Akademik mükemmeliyetin merkezi fakültelerimiz.' },
    'enstituler': { type: 'INSTITUTE', title: 'Enstitüler', subtitle: 'İleri düzey araştırma ve lisansüstü eğitim merkezlerimiz.' },
    'yuksekokullar': { type: 'SCHOOL', title: 'Yüksekokullar', subtitle: 'Mesleki uzmanlık kazandıran yüksekokullarımız.' },
    'meslek-yuksekokullari': { type: 'VOCATIONAL', title: 'Meslek Yüksekokulları', subtitle: 'Sektörle iç içe, uygulamalı eğitim.' },
    'arastirma-merkezleri': { type: 'CENTER', title: 'Araştırma Merkezleri', subtitle: 'Bilimsel üretim ve AR-GE çalışmalarımız.' },
    'rektorluk-birimleri': { type: 'DEPARTMENT', title: 'Rektörlük Birimleri', subtitle: 'Üniversitemizin idari ve akademik koordinasyon birimleri.' },
};

export default async function AcademicListPage({ params }: { params: Promise<{ type: string }> }) {
    const { type } = await params;
    const config = TYPE_MAP[type];

    if (!config) {
        return notFound();
    }

    const { data: units } = await getAcademicUnits(config.type);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Simple Hero */}
            <div className="bg-[#020617] text-white py-16 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{config.title}</h1>
                    <p className="text-slate-400 text-lg max-w-2xl">{config.subtitle}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12">
                {units && units.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                        {units.map((unit) => (
                            <AcademicCard key={unit.id} unit={unit} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800">
                        <GraduationCap className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white">Henüz Birim Eklenmemiş</h3>
                        <p className="text-slate-500 mt-2">Bu kategoride henüz akademik birim bulunmamaktadır.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
