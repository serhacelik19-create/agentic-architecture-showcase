import { db } from "@/lib/db";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, ArrowLeft, Share2, Eye } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageLayout";

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: idStr } = await params;
    const id = parseInt(idStr);

    if (isNaN(id)) {
        return notFound();
    }

    const newsItem = await db.news.findUnique({
        where: { id: id },
    });

    if (!newsItem) {
        return notFound();
    }

    const date = new Date(newsItem.date);
    const formattedDate = date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });

    // Generate breadcrumb items
    const breadcrumbItems = [
        { label: "Ana Sayfa", href: "/" },
        { label: newsItem.title, active: true }
    ];

    return (
        <article className="min-h-screen bg-white dark:bg-slate-950">
            {/* Standard Uniform Header */}
            <PageHeader
                title={newsItem.title}
                description={`${newsItem.category} • ${formattedDate}`}
                breadcrumbItems={breadcrumbItems}
            />

            <div className="container-custom py-12 max-w-5xl">
                {/* Content Area */}
                <div className="clearfix">
                    {/* Floated Image */}
                    {newsItem.image && (
                        <div className="float-none md:float-right md:ml-8 mb-6 md:mb-2 w-full md:w-[450px]">
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800">
                                <Image
                                    src={newsItem.image}
                                    alt={newsItem.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    )}

                    {/* Text */}
                    <div className="prose prose-lg dark:prose-invert max-w-none 
                        prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
                        prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed text-justify
                        first-letter:float-left first-letter:text-5xl first-letter:font-bold first-letter:text-slate-900 
                        dark:first-letter:text-white first-letter:mr-3 first-letter:mt-[-4px]">
                        {newsItem.content.split('\n').map((paragraph, index) => (
                            paragraph.trim() !== "" && (
                                <p key={index} className={index === 0 ? "first-letter:float-left first-letter:text-5xl first-letter:font-bold first-letter:text-slate-900 dark:first-letter:text-white first-letter:mr-3 first-letter:mt-[-6px] first-letter:font-serif" : "mb-6"}>
                                    {paragraph}
                                </p>
                            )
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-[var(--primary)] font-medium transition-colors bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-200">
                        <ArrowLeft className="w-4 h-4" />
                        Listeye Dön
                    </Link>

                    <button className="inline-flex items-center gap-2 text-slate-500 hover:text-[var(--primary)] transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Paylaş</span>
                    </button>
                </div>
            </div>
        </article>
    );
}
