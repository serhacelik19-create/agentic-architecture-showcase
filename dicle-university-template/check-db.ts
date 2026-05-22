
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCounts() {
    const newsCount = await prisma.news.count();
    const announcementsCount = await prisma.announcement.count();
    const hospitalAnnouncementsCount = await prisma.hospitalAnnouncement.count();
    const eventsCount = await prisma.event.count();

    console.log({
        news: newsCount,
        announcements: announcementsCount,
        hospitalAnnouncements: hospitalAnnouncementsCount,
        events: eventsCount
    });
}

checkCounts()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
