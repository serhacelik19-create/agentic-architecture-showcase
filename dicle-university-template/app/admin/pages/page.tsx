
import { getPagesList, deletePage, savePage } from "@/app/actions/pages";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, ArrowLeft, Layout } from "lucide-react";
import Link from "next/link";
import PagesAdminList from "./PagesAdminList";
import CreatePageForm from "@/components/admin/CreatePageForm";

export default async function PagesAdminPage() {
    const { data: pages } = await getPagesList();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Kurumsal Sayfa Yönetimi</h1>
                    <p className="text-sm text-slate-500 mt-1">Sitedeki tüm statik içerik sayfalarını buradan yönetebilirsiniz.</p>
                </div>
                <Link href="/admin">
                    <Button variant="outline" size="sm" className="gap-2 rounded-full shadow-sm">
                        <ArrowLeft className="h-4 w-4" />
                        Geri Dön
                    </Button>
                </Link>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Create New Page Card */}
                <div className="space-y-6">
                    <CreatePageForm />
                </div>

                {/* Pages List */}
                <div className="space-y-6">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex justify-between items-center px-1">
                        <span>Mevcut Sayfalar</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-normal italic lowercase">Kategoriye tıklayın</span>
                            <span className="text-xs font-normal bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{pages?.length || 0}</span>
                        </div>
                    </h3>

                    <PagesAdminList pages={pages || []} />
                </div>
            </div>
        </div>
    );
}
