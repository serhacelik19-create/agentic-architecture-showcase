
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const events = [
    { term: "Güz Yarıyılı", date: "16 Eylül 2025", event: "Güz Yarıyılı Derslerin Başlaması", order: 1 },
    { term: "Güz Yarıyılı", date: "20-24 Ekim 2025", event: "Ara Sınavlar (Vize)", order: 2 },
    { term: "Güz Yarıyılı", date: "29 Aralık 2025", event: "Güz Yarıyılı Derslerin Sona Ermesi", order: 3 },
    { term: "Güz Yarıyılı", date: "02-13 Ocak 2026", event: "Yarıyıl Sonu Sınavları (Final)", order: 4 },
    { term: "Bahar Yarıyılı", date: "10 Şubat 2026", event: "Bahar Yarıyılı Derslerin Başlaması", order: 5 },
    { term: "Bahar Yarıyılı", date: "06-10 Nisan 2026", event: "Ara Sınavlar (Vize)", order: 6 },
    { term: "Bahar Yarıyılı", date: "22 Mayıs 2026", event: "Bahar Yarıyılı Derslerin Sona Ermesi", order: 7 },
    { term: "Bahar Yarıyılı", date: "01-12 Haziran 2026", event: "Yarıyıl Sonu Sınavları (Final)", order: 8 },
];

async function main() {
    console.log("Seeding Academic Calendar...");

    // Clear existing to avoid duplicates if re-run
    await prisma.academicCalendarItem.deleteMany();

    for (const item of events) {
        await prisma.academicCalendarItem.create({
            data: item
        });
    }

    console.log(`Seeded ${events.length} academic calendar items.`);
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
