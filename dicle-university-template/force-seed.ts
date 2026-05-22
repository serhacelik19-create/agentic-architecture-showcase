import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Forcing seed...");

    // Delete existing to avoid duplicates if any (or just createMany with skipDuplicates if supported, but simple create is fine for now)
    // Actually, let's just create if not exists or just create more

    await prisma.hospitalPolyclinic.createMany({
        data: [
            { name: "Acil Servis", active: true, order: 1 },
            { name: "Kardiyoloji", active: true, order: 2 },
            { name: "Dahiliye", active: true, order: 3 },
            { name: "Göz Hastalıkları", active: true, order: 4 },
            { name: "Ortopedi", active: true, order: 5 },
            { name: "Çocuk Hastalıkları", active: true, order: 6 },
        ]
    });

    await prisma.hospitalAnnouncement.createMany({
        data: [
            { title: "Randevu Sistemi Güncellemesi", content: "Online randevu sistemimiz daha hızlı hizmet verebilmek için güncellenmiştir.", active: true, date: new Date() },
            { title: "Yeni Poliklinik Hizmete Girdi", content: "Geleneksel ve Tamamlayıcı Tıp (GETAT) polikliniğimiz hizmete başlamıştır.", active: true, date: new Date() },
        ]
    });

    console.log("Seeding complete.");
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
