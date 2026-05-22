import { PageHeader } from "@/components/layout/PageLayout";
import { FoodMenu } from "@/components/widgets/FoodMenu";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function DiningPage() {
    // Calculate "Today" based on local time
    const now = new Date();
    // Adjust for timezone to get correct local YYYY-MM-DD
    const localIsoString = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString();
    const todayString = localIsoString.split('T')[0]; // YYYY-MM-DD

    const searchDateStart = new Date(todayString); // UTC 00:00:00
    const searchDateEnd = new Date(todayString);
    searchDateEnd.setHours(23, 59, 59, 999);

    const foodMenu = await db.foodMenu.findFirst({
        where: {
            date: {
                gte: searchDateStart,
                lte: searchDateEnd
            }
        }
    });

    // Serialize for Client Component
    const formattedMenu = foodMenu ? {
        ...foodMenu,
        date: foodMenu.date.toISOString(),
    } : null;

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
            <PageHeader
                title="Yemekhane"
                description="Sağlık, Kültür ve Spor Daire Başkanlığı Yemek Hizmetleri"
            />

            <div className="container-custom py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Hizmetlerimiz Hakkında</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                Üniversitemiz merkez mutfağında hazırlanan yemekler, gıda mühendisleri denetiminde,
                                hijyenik koşullarda üretilmekte ve kalori hesaplamaları yapılarak sunulmaktadır.
                            </p>
                            <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Yemek Saatleri</h3>
                            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
                                <li>Öğle Yemeği: 11:30 - 14:00</li>
                                <li>Akşam Yemeği: 16:30 - 18:30</li>
                            </ul>
                        </div>
                    </div>

                    {/* Menu Widget */}
                    <div>
                        <FoodMenu menu={formattedMenu} />
                    </div>
                </div>
            </div>
        </main>
    );
}
