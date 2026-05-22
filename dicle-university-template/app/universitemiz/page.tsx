import { getPagesList } from "@/app/actions/pages";
import { UniversityPageClient } from "@/components/universitemiz/UniversityPageClient";

export default async function UniversityPage() {
    const { data: allPages } = await getPagesList();

    // Ensure allPages is an array even if data is null/undefined
    const pagesArray = Array.isArray(allPages) ? allPages : [];

    return <UniversityPageClient allPages={pagesArray} />;
}
