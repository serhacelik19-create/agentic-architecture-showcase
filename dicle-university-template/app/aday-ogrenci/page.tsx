"use client";

import { PageHeader } from "@/components/layout/PageLayout";
import { CheckCircle2, Map, Home, Heart, HelpCircle, ArrowRight, Utensils, GraduationCap, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProspectiveStudentPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <PageHeader
                title="Aday Öğrenci"
                description="Geleceğine Dicle Üniversitesi'nde yön ver. Bilim, kültür ve tarihin buluştuğu kampüsümüze hoş geldin."
            />

            <div className="container-custom py-12 space-y-20">

                {/* Intro Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold">
                            <GraduationCap className="w-4 h-4" />
                            <span>Geleceğin Seni Bekliyor</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                            Neden <span className="text-[var(--primary)]">Dicle Üniversitesi?</span>
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                            Köklü geçmişi, bölgenin en büyük sağlık ve araştırma kampüsü, uluslararası standartlarda eğitimi ile Dicle Üniversitesi, sadece bir diploma değil, hayat boyu sürecek bir vizyon kazandırır.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "50 yılı aşkın akademik tecrübe ve köklü gelenek",
                                "27.000 dönümlük Türkiye'nin en büyük ve yeşil kampüslerinden biri",
                                "Gelişmiş kütüphane, laboratuvar ve araştırma merkezleri",
                                "Zengin sosyal, kültürel ve sportif olanaklar"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-200">
                                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative h-[450px] rounded-3xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 border-4 border-white dark:border-slate-800">
                        <Image
                            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop"
                            alt="Campus Life"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-8 left-8 text-white max-w-sm">
                            <p className="font-bold text-2xl mb-2">Canlı Bir Kampüs</p>
                            <p className="text-white/80 text-sm">Doğa ile iç içe, öğrenci odaklı bir yaşam alanı.</p>
                        </div>
                    </div>
                </section>

                {/* Virtual Tour CTA */}
                <section className="bg-slate-900 rounded-3xl p-8 md:p-12 relative overflow-hidden text-center md:text-left">
                    <div className="absolute inset-0 opacity-20">
                        <Image
                            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format&fit=crop"
                            alt="Background"
                            fill
                            className="object-cover grayscale"
                        />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-4 max-w-2xl">
                            <h2 className="text-3xl font-bold text-white">Kampüsü Keşfetmeye Hazır mısın?</h2>
                            <p className="text-slate-300 text-lg">
                                Evinden çıkmadan üniversitemizin tüm fakültelerini, sosyal alanlarını ve yeşil doğasını 360° sanal tur ile gezebilirsin.
                            </p>
                        </div>
                        <Link href="/sanal-tur">
                            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-8 h-14 text-lg font-bold shadow-xl hover:scale-105 transition-transform group">
                                <Video className="w-5 h-5 mr-2 text-[var(--primary)]" />
                                Sanal Tura Başla
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* Info Cards Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            icon: <Home className="w-7 h-7 text-rose-500" />,
                            title: "Barınma",
                            desc: "Kampüs içinde KYK yurtları ve çevresinde özel yurt imkanları.",
                            color: "bg-rose-50 dark:bg-rose-900/10"
                        },
                        {
                            icon: <Utensils className="w-7 h-7 text-orange-500" />,
                            title: "Yemek",
                            desc: "Öğrenci bütçesine uygun, hijyenik ve kaliteli yemekhane hizmeti.",
                            color: "bg-orange-50 dark:bg-orange-900/10"
                        },
                        {
                            icon: <Map className="w-7 h-7 text-blue-500" />,
                            title: "Ulaşım",
                            desc: "Şehir merkezinden kampüse otobüs ve minibüslerle kolay ulaşım.",
                            color: "bg-blue-50 dark:bg-blue-900/10"
                        },
                        {
                            icon: <Heart className="w-7 h-7 text-purple-500" />,
                            title: "Sosyal Yaşam",
                            desc: "Öğrenci kulüpleri, festivaller ve spor kompleksleri ile aktif bir yaşam.",
                            color: "bg-purple-50 dark:bg-purple-900/10"
                        }
                    ].map((card, idx) => (
                        <div key={idx} className={`${card.color} p-6 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all hover:-translate-y-1 hover:shadow-md`}>
                            <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                                {card.icon}
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{card.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{card.desc}</p>
                        </div>
                    ))}
                </section>

                {/* FAQ / Registration Guide */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Registration Steps */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Nasıl Dicle'li Olurum?</h2>
                            <p className="text-slate-500">Adım adım kayıt ve yerleşme süreci.</p>
                        </div>

                        <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-10 pb-4">
                            {[
                                { title: "YKS Sınavı ve Tercih", desc: "ÖSYM tarafından düzenlenen YKS sınavına gir ve tercih döneminde Dicle Üniversitesi bölümlerini listene ekle." },
                                { title: "Yerleşme Sonuçları", desc: "Sonuçlar açıklandığında Dicle Üniversitesi'ni kazandığını öğrenmenin mutluluğunu yaşa!" },
                                { title: "E-Kayıt (e-Devlet)", desc: "Üniversiteye gelmene gerek kalmadan, e-Devlet üzerinden kaydını kolayca tamamla." },
                                { title: "Ders Kaydı ve Başlangıç", desc: "Akademik takvimde belirtilen tarihlerde ders kaydını yap ve kampüs hayatına merhaba de!" }
                            ].map((step, idx) => (
                                <div key={idx} className="relative pl-8">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[var(--primary)] border-4 border-white dark:border-slate-950 shadow-sm"></div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{step.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FAQ Accordion */}
                    <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 h-fit">
                        <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white">
                            <HelpCircle className="w-6 h-6 text-yellow-500" />
                            <h2 className="text-xl font-bold">Sıkça Sorulan Sorular</h2>
                        </div>

                        <div className="space-y-4">
                            {[
                                { q: "Kampüste yurt imkanı var mı?", a: "Evet, kampüs alanı içerisinde Kredi ve Yurtlar Kurumu'na (KYK) ait yaklaşık 10.000 kapasiteli kız ve erkek öğrenci yurtları bulunmaktadır." },
                                { q: "Burs imkanları nelerdir?", a: "Öğrencilerimiz KYK burs/kredi imkanlarının yanı sıra, üniversitemiz vakfı ve çeşitli kuruluşlar tarafından sağlanan başarı ve yemek burslarından faydalanabilir." },
                                { q: "Yemekhane ücretleri ne kadar?", a: "Üniversitemiz yemekhanesi, öğrencilerine çok uygun fiyatlarla (sembolik ücretlerle) 4 çeşit kaliteli yemek hizmeti sunmaktadır." },
                                { q: "Kampüse ulaşım nasıl?", a: "Şehir merkezinden kampüse belediye otobüsleri ve minibüsler ile sürekli ulaşım sağlanmaktadır. Kampüs içi ring servisleri ücretsizdir." }
                            ].map((faq, idx) => (
                                <details key={idx} className="group border-b border-slate-100 dark:border-slate-800 last:border-0 pb-4 last:pb-0">
                                    <summary className="flex items-center justify-between font-medium cursor-pointer list-none text-slate-800 dark:text-slate-200 hover:text-[var(--primary)] transition-colors">
                                        {faq.q}
                                        <ArrowRight className="w-4 h-4 transition-transform group-open:rotate-90 text-slate-400" />
                                    </summary>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-3 leading-relaxed animate-in slide-in-from-top-2 fade-in duration-300">
                                        {faq.a}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
