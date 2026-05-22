import { db } from "@/lib/db";
import NewsAdminClient from "@/components/admin/NewsAdminClient";

export const dynamic = 'force-dynamic';

export default async function NewsPage() {
    const news = await db.news.findMany({
        orderBy: {
            date: 'desc'
        }
    });

    return <NewsAdminClient initialNews={news} />;
}
