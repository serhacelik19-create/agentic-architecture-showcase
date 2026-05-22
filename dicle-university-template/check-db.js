
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
    try {
        const news = await prisma.news.findMany({ take: 3 });
        const hospitalAnnouncements = await prisma.hospitalAnnouncement.findMany({ take: 3 });
        const events = await prisma.event.findMany({ take: 3 });

        const output = {
            timestamp: new Date().toISOString(),
            counts: {
                news: await prisma.news.count(),
                hospitalAnnouncements: await prisma.hospitalAnnouncement.count(),
                events: await prisma.event.count()
            },
            samples: {
                news: news,
                hospitalAnnouncements: hospitalAnnouncements,
                events: events
            }
        };

        fs.writeFileSync('db-status.txt', JSON.stringify(output, null, 2));
        console.log('Detailed status written to db-status.txt');
    } catch (error) {
        fs.writeFileSync('db-status.txt', 'Error: ' + error.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
