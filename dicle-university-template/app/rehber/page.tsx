import { PageHeader } from "@/components/layout/PageLayout";
import { getStaffMembers, getDepartments } from "@/app/actions/staff";
import StaffClientSearch from "@/components/rehber/StaffClientSearch";

export const metadata = {
    title: "Personel Rehberi | Dicle Üniversitesi",
    description: "Dicle Üniversitesi akademik ve idari personel rehberi."
};

export default async function RehberPage() {
    const { data: allStaff } = await getStaffMembers();
    const { data: departments } = await getDepartments();

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <PageHeader
                title="Personel Rehberi"
                description="Üniversitemiz bünyesindeki akademik ve idari personele buradan ulaşabilirsiniz."
            />

            <div className="container-custom py-12">
                <StaffClientSearch
                    initialStaff={allStaff || []}
                    departments={departments || []}
                />
            </div>
        </main>
    );
}
