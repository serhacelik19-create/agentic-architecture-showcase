
import { PageHeader } from "@/components/layout/PageLayout";
import { Utensils, Award, Heart, Music, Palmtree } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SKSPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <PageHeader
                title="Sağlık, Kültür ve Spor Daire Başkanlığı"
                description="Öğrencilerimizin beslenme, barınma, sağlık, kültür ve spor ihtiyaçlarını karşılıyoruz."
            />

            <div className="container-custom py-12">

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Dining */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center group hover:border-orange-500 transition-colors">
                        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Utensils className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Beslenme Hizmetleri</h3>
                        <p className="text-slate-500 mb-6 leading-relaxed text-sm">
                            Merkezi yemekhanemiz ve fakülte kantinlerimizde hijyenik, dengeli ve ekonomik yemek hizmeti sunulmaktadır.
                        </p>
                        <Button variant="outline" className="mt-auto">Yemek Menüsü</Button>
                    </div>

                    {/* Culture */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center group hover:border-purple-500 transition-colors">
                        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Music className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Kültür & Sanat</h3>
                        <p className="text-slate-500 mb-6 leading-relaxed text-sm">
                            Kongre merkezimizde yıl boyunca konserler, tiyatrolar, sergiler ve paneller düzenlenmektedir.
                        </p>
                        <Button variant="outline" className="mt-auto">Etkinlik Takvimi</Button>
                    </div>

                    {/* Sports */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center group hover:border-blue-500 transition-colors">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Award className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Spor Hizmetleri</h3>
                        <p className="text-slate-500 mb-6 leading-relaxed text-sm">
                            Yarı olimpik yüzme havuzu, kapalı spor salonu, tenis kortları ve halı sahalarımız hizmetinizdedir.
                        </p>
                        <Button variant="outline" className="mt-auto">Tesisleri İncele</Button>
                    </div>

                    {/* Health */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center group hover:border-red-500 transition-colors">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Heart className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Psikolojik Danışmanlık</h3>
                        <p className="text-slate-500 mb-6 leading-relaxed text-sm">
                            Mediko-Sosyal Merkezimizde uzman psikologlarımız tarafından ücretsiz danışmanlık hizmeti verilmektedir.
                        </p>
                        <Button variant="outline" className="mt-auto">Randevu Al</Button>
                    </div>

                    {/* Social Facilities */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center group hover:border-green-500 transition-colors">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Palmtree className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Sosyal Tesisler</h3>
                        <p className="text-slate-500 mb-6 leading-relaxed text-sm">
                            Dicle Nehri kıyısındaki piknik alanları ve konukevimiz ile sosyal yaşamı destekliyoruz.
                        </p>
                        <Button variant="outline" className="mt-auto">Rezervasyon</Button>
                    </div>

                </div>
            </div>
        </main>
    );
}
