import { PageHeader } from "@/components/layout/PageLayout";
import { Hammer, HardHat } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ConstructionProps {
    title: string;
    parent?: string;
}

export default function ConstructionPage({ title, parent }: ConstructionProps) {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <PageHeader
                title={title}
                description="Bu sayfa şu anda yapım aşamasındadır."
            />

            <div className="container-custom py-20 flex flex-col items-center justify-center text-center">
                <div className="flex gap-4 mb-8 text-slate-300">
                    <Hammer className="w-16 h-16" />
                    <HardHat className="w-16 h-16" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">{title} Sayfası Hazırlanıyor</h2>
                <p className="text-slate-500 max-w-md mb-8">
                    İçerik ekibimiz bu sayfayı doldurmak için çalışıyor. Yakında detaylı bilgilerle burada olacağız.
                </p>
                <div className="flex gap-4">
                    <Link href="/">
                        <Button variant="outline">Anasayfaya Dön</Button>
                    </Link>
                    {parent && (
                        <Link href={`/${parent.toLowerCase()}`}>
                            <Button>{parent} Sayfasına Git</Button>
                        </Link>
                    )}
                </div>
            </div>
        </main>
    );
}
