"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function Footer() {
    const { t } = useLanguage();
    return (
        <footer className="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Column 1: Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center p-2">
                                <img
                                    src="/logo.png?v=1"
                                    alt="Dicle Üniversitesi Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div>
                                <h2 className="font-bold text-xl uppercase tracking-wider">Dicle Üniversitesi</h2>
                                <span className="text-slate-400 text-sm">Köklü Geçmiş, Güçlü Gelecek</span>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 italic">
                            Bölgenin bilim, kültür ve sanat merkezi olarak, 50 yılı aşkın tecrübesiyle geleceği şekillendiriyoruz.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[var(--primary)] transition-colors">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[var(--secondary)] transition-colors">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-700 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-6 border-b border-slate-700 pb-2 inline-block">{t("footer.quickLinks")}</h3>
                        <ul className="space-y-3 text-sm text-slate-300">
                            <li><Link href="/universitemiz/hakkimizda" className="hover:text-[var(--accent)] transition-colors">{t("footer.about")}</Link></li>
                            <li><Link href="/universitemiz/misyon-vizyon" className="hover:text-[var(--accent)] transition-colors">{t("footer.mission")}</Link></li>
                            <li><Link href="/universitemiz/basin-merkezi" className="hover:text-[var(--accent)] transition-colors">{t("footer.press")}</Link></li>
                            <li><Link href="/sanal-tur" className="hover:text-[var(--accent)] transition-colors">{t("footer.virtualTour")}</Link></li>
                            <li><Link href="/kampus-haritasi" className="hover:text-[var(--accent)] transition-colors">{t("footer.map")}</Link></li>
                            <li><Link href="/ogrenci/takvim" className="hover:text-[var(--accent)] transition-colors">{t("footer.calendar")}</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Academic */}
                    <div>
                        <h3 className="font-bold text-lg mb-6 border-b border-slate-700 pb-2 inline-block">{t("footer.academic")}</h3>
                        <ul className="space-y-3 text-sm text-slate-300">
                            <li><Link href="/akademik/fakulteler" className="hover:text-[var(--accent)] transition-colors">{t("footer.faculties")}</Link></li>
                            <li><Link href="/akademik/enstituler" className="hover:text-[var(--accent)] transition-colors">{t("footer.institutes")}</Link></li>
                            <li><Link href="/akademik/yuksekokullar" className="hover:text-[var(--accent)] transition-colors">{t("footer.schools")}</Link></li>
                            <li><Link href="/arastirma" className="hover:text-[var(--accent)] transition-colors">{t("footer.researchCenters")}</Link></li>
                            <li><Link href="/hastane" className="hover:text-[var(--accent)] transition-colors">{t("footer.hospitalLink")}</Link></li>
                            <li><Link href="/mezun" className="hover:text-[var(--accent)] transition-colors text-[var(--secondary)] font-bold">{t("footer.alumni")}</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h3 className="font-bold text-lg mb-6 border-b border-slate-700 pb-2 inline-block">{t("footer.contact")}</h3>
                        <ul className="space-y-4 text-sm text-slate-300">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-[var(--primary)] shrink-0 mt-1" />
                                <span>{t("footer.address")}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-[var(--primary)] shrink-0" />
                                <span>+90 (412) 241 10 00</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-[var(--primary)] shrink-0" />
                                <span>iletisim@dicle.edu.tr</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>&copy; {new Date().getFullYear()} {t("footer.copyright")}</p>
                    <div className="flex gap-6">
                        <Link href="/gizlilik-politikasi" className="hover:text-white">Gizlilik Politikası</Link>
                        <Link href="/kvkk" className="hover:text-white">KVKK Aydınlatma Metni</Link>
                        <Link href="/cerez-politikasi" className="hover:text-white">Çerez Politikası</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
