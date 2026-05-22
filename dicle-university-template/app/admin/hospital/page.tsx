import { getPolyclinics, getHospitalAnnouncements } from "@/app/actions/hospital";
import HospitalTabs from "@/components/admin/HospitalTabs";

export const dynamic = 'force-dynamic';

export default async function HospitalAdminPage() {
    const [polyclinicsRes, announcementsRes] = await Promise.all([
        getPolyclinics(),
        getHospitalAnnouncements()
    ]);

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Hastane Yönetimi</h1>
                <p className="text-slate-500 mt-2">
                    Hastane polikliniklerini ve duyurularını buradan yönetebilirsiniz.
                </p>
            </div>

            <HospitalTabs
                polyclinics={polyclinicsRes.data || []}
                announcements={announcementsRes.data || []}
            />
        </div>
    );
}
