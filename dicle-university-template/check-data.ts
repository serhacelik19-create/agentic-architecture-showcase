import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const count = await prisma.hospitalPolyclinic.count()
    console.log(`Polyclinic Count: ${count}`)
    const announcements = await prisma.hospitalAnnouncement.count()
    console.log(`Announcement Count: ${announcements}`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
