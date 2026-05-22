import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding hospital data...')

    // 1. Polyclinics
    const clinics = [
        "Dahiliye",
        "Kardiyoloji",
        "Genel Cerrahi",
        "Ortopedi",
        "Nöroloji",
        "Göz Hastalıkları",
        "KBB (Kulak Burun Boğaz)",
        "Pediatri (Çocuk Sağlığı)",
        "Kadın Hastalıkları ve Doğum",
        "Dermatoloji (Cildiye)",
        "Üroloji",
        "Psikiyatri"
    ]

    for (const [index, name] of clinics.entries()) {
        await prisma.hospitalPolyclinic.create({
            data: {
                name,
                order: index
            }
        })
    }

    // 2. Announcements
    const announcements = [
        {
            title: "Poliklinik Saatlerinde Düzenleme",
            content: "Ramazan ayı dolayısıyla poliklinik hizmet saatlerimiz 08:30 - 16:30 olarak güncellenmiştir. Acil servisimiz 7/24 hizmet vermeye devam etmektedir.",
            date: new Date()
        },
        {
            title: "Yeni MR Cihazı Hizmete Girdi",
            content: "Hastanemiz Radyoloji bölümüne kazandırılan son teknoloji 3 Tesla MR cihazı hasta kabulüne başlamıştır.",
            date: new Date(new Date().setDate(new Date().getDate() - 2))
        },
        {
            title: "Hasta Ziyaret Saatleri Hakkında",
            content: "Artan gribal enfeksiyonlar nedeniyle, yatan hasta ziyaretleri ikinci bir duyuruya kadar günde tek saat ile sınırlandırılmıştır.",
            date: new Date(new Date().setDate(new Date().getDate() - 5))
        }
    ]

    for (const announcement of announcements) {
        await prisma.hospitalAnnouncement.create({
            data: announcement
        })
    }

    console.log('Hospital seeding completed!')
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
