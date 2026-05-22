import { getPage } from "@/app/actions/pages";
import { PageLayout } from "@/components/layout/PageLayout";
import { useLanguage } from "@/components/providers/LanguageProvider";

// This needs to be a client component to use useLanguage, 
// or we can pass translations from server.
// Since it's a dynamic page fetching from DB, we can use a Client component wrapper.

import { DynamicPageClient } from "./DynamicPageClient";

export default async function DynamicUniversityPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { data: page } = await getPage(slug);

    return <DynamicPageClient page={page} slug={slug} />;
}
