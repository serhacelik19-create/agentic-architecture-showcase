import { getStudentInfo } from "@/app/actions/student-info";
import { getStudentServices } from "@/app/actions/student-services";
import StudentManagementTabs from "@/components/admin/StudentManagementTabs";

export default async function StudentInfoPage() {
    // Parallel fetching for performance
    const [infoRes, servicesRes] = await Promise.all([
        getStudentInfo(),
        getStudentServices()
    ]);

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Öğrenci Yönetim Paneli</h1>
                <p className="text-slate-500 mt-2">
                    Ana sayfadaki öğrenci kartını ve öğrenci merkezindeki hizmetleri tek bir yerden yönetin.
                </p>
            </div>

            <StudentManagementTabs
                studentInfoData={infoRes.data}
                servicesData={servicesRes.data || []}
            />
        </div>
    );
}
