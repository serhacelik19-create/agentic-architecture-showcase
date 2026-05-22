"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, List } from "lucide-react";
import ResearchHighlightsClient from "./ResearchHighlightsClient";
import ResearchCentersClient from "./ResearchCentersClient";
import { ResearchItem } from "@prisma/client";

export default function ResearchTabs({ items }: { items: ResearchItem[] }) {
    const highlights = items.filter(i => i.type === 'HIGHLIGHT');
    const centers = items.filter(i => i.type === 'CENTER');

    return (
        <Tabs defaultValue="highlights" className="space-y-6">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
                <TabsTrigger value="highlights" className="gap-2">
                    <LayoutGrid size={16} /> Öne Çıkanlar
                </TabsTrigger>
                <TabsTrigger value="centers" className="gap-2">
                    <List size={16} /> Merkezler Listesi
                </TabsTrigger>
            </TabsList>

            <TabsContent value="highlights" className="space-y-4 animate-in fade-in-50 duration-300">
                <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg text-sm text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/30">
                    Araştırma sayfasının en üstünde yer alan büyük kartları buradan yönetebilirsiniz.
                </div>
                <ResearchHighlightsClient items={highlights} />
            </TabsContent>

            <TabsContent value="centers" className="space-y-4 animate-in fade-in-50 duration-300">
                <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-lg text-sm text-green-700 dark:text-green-300 border border-green-100 dark:border-green-900/30">
                    Sayfanın altındaki "Araştırma Merkezleri" listesini buradan yönetebilirsiniz.
                </div>
                <ResearchCentersClient items={centers} />
            </TabsContent>
        </Tabs>
    );
}
