"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function DynamicPageClient({ page, slug }: { page: any; slug: string }) {
    const { t } = useLanguage();

    if (!page) {
        return (
            <PageLayout title={slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ")}>
                <div className="py-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                        <span className="text-2xl">🚧</span>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">{t("page.underConstruction")}</h2>
                    <p className="text-slate-500 max-w-md mx-auto">
                        {t("page.underConstructionDesc")}
                    </p>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout title={page.title}>
            <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: page.content }} />
            </div>
        </PageLayout>
    );
}
