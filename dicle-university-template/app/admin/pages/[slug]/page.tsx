
import { getPage } from "@/app/actions/pages";
import PageEditorClient from "../PageEditorClient";

export default async function PageEditorPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { data: page } = await getPage(slug);

    if (!page) {
        return (
            <div className="p-12 text-center">
                <h2 className="text-2xl font-bold text-slate-900">Sayfa Bulunamadı</h2>
                <p className="text-slate-500 mt-2">Aradığınız içerik silinmiş veya taşınmış olabilir.</p>
            </div>
        );
    }

    return (
        <PageEditorClient page={page} />
    );
}
