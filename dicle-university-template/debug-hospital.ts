import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Checking Hospital Data...");

    const polyclinics = await prisma.hospitalPolyclinic.findMany();
    console.log(`Found ${polyclinics.length} polyclinics.`);
    if (polyclinics.length > 0) {
        console.log("First 3 polyclinics:", polyclinics.slice(0, 3));
    } else {
        console.log("No polyclinics found. Attempting to seed...");
        await prisma.hospitalPolyclinic.createMany({
            data: [
                { name: "Acil Tıp", active: true, order: 1 },
                { name: "Adli Tıp", active: true, order: 2 },
                { name: "Aile Hekimliği", active: true, order: 3 },
                { name: "Anesteziyoloji ve Reanimasyon", active: true, order: 4 },
                { name: "Beyin ve Sinir Cerrahisi", active: true, order: 5 },
            ]
        });
        console.log("Seeded 5 sample polyclinics.");
    }

    const announcements = await prisma.hospitalAnnouncement.findMany();
    console.log(`Found ${announcements.length} announcements.`);
    if (announcements.length === 0) {
        console.log("No announcements found. Attempting to seed...");
        await prisma.hospitalAnnouncement.createMany({
            data: [
                { title: "Ziyaret Saatleri Hakkında", content: "Hastanemiz ziyaret saatleri güncellenmiştir.", active: true, date: new Date() },
                { title: "Poliklinik Randevuları", content: "Online randevu sistemimiz yenilenmiştir.", active: true, date: new Date() },
            ]
        });
        console.log("Seeded 2 sample announcements.");
    }
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
