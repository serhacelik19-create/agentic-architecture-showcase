
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        const count = await prisma.hospitalPolyclinic.count();
        console.log(`HospitalPolyclinic count: ${count}`);
        const announcementCount = await prisma.hospitalAnnouncement.count();
        console.log(`HospitalAnnouncement count: ${announcementCount}`);
        console.log("SUCCESS: Prisma Client is working correctly.");
    } catch (e) {
        console.error("ERROR: Prisma Client failed.", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
