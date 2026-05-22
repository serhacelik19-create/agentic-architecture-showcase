import { db } from "@/lib/db";
import { HomepageClient } from "@/components/home/HomepageClient";

export default async function Home() {
  // Calculate "Today" based on local time
  const now = new Date();
  // Adjust for timezone to get correct local YYYY-MM-DD
  const localIsoString = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString();
  const todayString = localIsoString.split('T')[0]; // YYYY-MM-DD

  // The admin panel saves menus as UTC midnight of the selected date (new Date("YYYY-MM-DD"))
  // So we expect the stored date to be exactly new Date(todayString)
  // We'll search for a tight range around it to be safe, or just the exact match if we trust it.
  // Let's use a range covering the whole day in UTC context to be safe.

  const searchDateStart = new Date(todayString); // UTC 00:00:00
  const searchDateEnd = new Date(todayString);
  searchDateEnd.setHours(23, 59, 59, 999);

  const [foodMenu, newsItems, events] = await Promise.all([
    db.foodMenu.findFirst({
      where: {
        date: {
          gte: searchDateStart,
          lte: searchDateEnd
        }
      }
    }),
    db.news.findMany({
      where: { published: true },
      orderBy: { date: 'desc' },
      take: 10
    }),
    db.event.findMany({
      where: {
        date: {
          gte: new Date() // Only upcoming events
        }
      },
      orderBy: { date: 'asc' },
      take: 20
    })
  ]);

  // Serialize for Client Component
  const formattedMenu = foodMenu ? {
    ...foodMenu,
    date: foodMenu.date.toISOString(),
  } : null;

  const formattedNews = newsItems.map(item => ({
    ...item,
    date: item.date.toISOString(),
    active: true
  }));

  const formattedEvents = events.map(event => ({
    ...event,
    date: event.date.toISOString(),
    description: event.description || null
  }));

  return (
    <HomepageClient
      formattedNews={formattedNews}
      formattedMenu={formattedMenu}
      formattedEvents={formattedEvents}
    />
  );
}
