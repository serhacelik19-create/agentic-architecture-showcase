import { getResearchItems } from "@/app/actions/research";
import ResearchTabs from "@/components/admin/ResearchTabs";

export default async function ResearchAdminPage() {
    const { data } = await getResearchItems();

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Araştırma Yönetimi</h1>
                <p className="text-slate-500 mt-2">
                    Araştırma sayfasındaki projeleri, laboratuvarları ve merkezleri buradan yönetebilirsiniz.
                </p>
            </div>

            <ResearchTabs items={data || []} />
        </div>
    );
}
