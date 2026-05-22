import Link from "next/link";
import { PageHeader } from "@/components/layout/PageLayout";
import { Globe } from "lucide-react";
import { getActiveResearchItems } from "@/app/actions/research";
import * as Icons from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ResearchPage() {
    const { data: items = [] } = await getActiveResearchItems();

    const highlights = items?.filter(i => i.type === 'HIGHLIGHT') || [];
    const centers = items?.filter(i => i.type === 'CENTER') || [];

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <PageHeader
                title="Araştırma & Geliştirme"
                description="Dicle Üniversitesi, bilimsel araştırmaları ve projeleriyle geleceğe ışık tutuyor. Laboratuvarlarımız ve araştırma merkezlerimiz hakkında bilgi edinin."
            />

            <div className="container-custom py-12">
                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {highlights.map((item) => {
                        const Icon = (Icons as any)[item.icon || "Circle"] || Icons.Circle;
                        // Assign colors based on index or random for visual variety if needed, 
                        // or just use consistent styling as before.
                        // Leveraging the previous design's specific colors might require storing color in DB or hardcoding by index.
                        // For now, I'll use a consistent primary/secondary logic or class names if stored.
                        // To keep it simple and clean:

                        return (
                            <div key={item.id} className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow">
                                <Icon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-6" />
                                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{item.title}</h3>
                                <p className="text-slate-500 mb-6 leading-relaxed line-clamp-3">{item.description}</p>
                                <Link href={item.url || "#"} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                                    Detaylı Bilgi &rarr;
                                </Link>
                            </div>
                        );
                    })}
                </div>

                {/* Centers List */}
                <div className="mt-16">
                    <h2 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white border-l-4 border-indigo-600 pl-4">Araştırma Merkezleri</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {centers.map((center) => (
                            <div key={center.id} className="flex items-center p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-200 transition-colors">
                                <Globe className="w-5 h-5 text-slate-400 mr-3" />
                                <span className="font-medium text-slate-700 dark:text-slate-300">{center.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
