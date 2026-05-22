import { PageHeader } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { getActiveStudentServices } from "@/app/actions/student-services";
import { ServiceCard } from "@/components/student/ServiceCard";

export const dynamic = 'force-dynamic';

export default async function StudentPage() {
    const { data: services = [] } = await getActiveStudentServices();

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <PageHeader
                title="Öğrenci"
                description="Eğitim hayatınızı kolaylaştıracak tüm hizmetler bir arada."
            />

            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                    ))}

                    {services.length === 0 && (
                        <div className="col-span-3 text-center py-12 text-slate-500">
                            Henüz aktif bir hizmet bulunmuyor.
                        </div>
                    )}
                </div>

                <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">Öğrenci Topluluklarına Katılın</h2>
                        <p className="text-blue-100 mb-8 text-lg">Kültür, sanat, spor ve bilim alanında faaliyet gösteren 50'den fazla topluluk sizi bekliyor.</p>
                        <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90 border-none">Toplulukları İncele</Button>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
                </div>
            </div>
        </main>
    );
}
