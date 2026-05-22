import { getStaffMembers } from "@/app/actions/staff";
import StaffAdminClient from "@/components/admin/StaffAdminClient";

export default async function StaffAdminPage() {
    const { data: staff } = await getStaffMembers();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Personel Rehberi Yönetimi</h1>
                <p className="text-slate-500">Akademik ve idari personel listesini buradan yönetebilirsiniz.</p>
            </div>

            <StaffAdminClient initialStaff={staff || []} />
        </div>
    );
}
