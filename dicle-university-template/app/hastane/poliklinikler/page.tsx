import { PageHeader } from "@/components/layout/PageLayout";
import { Search, Stethoscope } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getActivePolyclinics } from "@/app/actions/hospital";
import IconRenderer from "@/components/ui/IconRenderer";
import ClientSearch from "./ClientSearch";

export const dynamic = 'force-dynamic';

export default async function PolyclinicsPage() {
    const result = await getActivePolyclinics();
    const clinics = result.data || [];

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <PageHeader
                title="Polikliniklerimiz"
                description="Hastanemizde hizmet veren tüm polikliniklerimiz ve uzmanlık alanlarımız."
            />

            <div className="container-custom py-12">
                <ClientSearch clinics={clinics} />
            </div>
        </main>
    );
}
