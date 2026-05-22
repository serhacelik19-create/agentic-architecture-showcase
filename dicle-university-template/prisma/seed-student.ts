import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding student data...')

    // 1. Seed Student Services
    const services = [
        {
            title: "Öğrenci İşleri (OBS)",
            description: "Ders kaydı, not görüntüleme ve belge işlemleri.",
            icon: "Book",
            type: "LINK",
            url: "https://obs.dicle.edu.tr/",
            order: 1
        },
        {
            title: "Yemekhane",
            description: "Günlük yemek menüsü ve rezervasyon sistemi.",
            icon: "Coffee",
            type: "MENU",
            order: 2
        },
        {
            title: "Akademik Takvim",
            description: "Sınav tarihleri ve tatil günleri.",
            icon: "Calendar",
            type: "CALENDAR",
            order: 3
        },
        {
            title: "Ulaşım & Ring",
            description: "Kampüs ring saatleri ve güzergah bilgileri.",
            icon: "Bus",
            type: "MODAL",
            content: `
        <h3>Ring Sefer Saatleri</h3>
        <p>Kampüs içi ring servislerimiz hafta içi her gün hizmet vermektedir.</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr style="background: #f1f5f9;">
                <th style="padding: 8px; text-align: left;">Güzergah</th>
                <th style="padding: 8px; text-align: left;">Saatler</th>
            </tr>
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Tıp Fakültesi - Rektörlük</td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">07:30 - 17:00 (Her 15 dk)</td>
            </tr>
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Lojmanlar - İlahiyat</td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">08:00 - 16:30 (Her 30 dk)</td>
            </tr>
        </table>
        <p style="margin-top: 10px; font-size: 0.875rem; color: #64748b;">* Hafta sonu nöbetçi araçlarımız 09:00 - 15:00 arası çalışmaktadır.</p>
      `,
            order: 4
        },
        {
            title: "Kütüphane",
            description: "Katalog tarama ve e-kaynaklara erişim.",
            icon: "Library",
            type: "LINK",
            url: "http://www.dicle.edu.tr/kutuphane",
            order: 5
        },
        {
            title: "Spor Tesisleri",
            description: "Havuz, fitness ve saha rezervasyonları.",
            icon: "Activity",
            type: "LINK",
            url: "/saglik-kultur-spor",
            order: 6
        }
    ]

    console.log('Upserting services...')
    for (const service of services) {
        await prisma.studentService.create({
            data: {
                ...service,
                active: true
            }
        })
    }

    // 2. Seed Food Menu for Today (if not exists)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existingMenu = await prisma.foodMenu.findFirst({
        where: { date: today }
    })

    if (!existingMenu) {
        console.log('Adding today\'s food menu...')
        await prisma.foodMenu.create({
            data: {
                date: today,
                soup: "Mercimek Çorbası",
                main: "Orman Kebabı",
                side: "Pirinç Pilavı",
                extra: "Mevsim Salata",
                totalCal: 850
            }
        })
    }

    // 3. Seed Upcoming Event (if not exists)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    const existingEvent = await prisma.event.findFirst({
        where: { date: { gte: today } }
    })

    if (!existingEvent) {
        console.log('Adding upcoming academic event...')
        await prisma.event.create({
            data: {
                title: "Bahar Dönemi Vize Sınavları Başlangıcı",
                date: nextWeek,
                location: "Tüm Kampüs",
                description: "2025-2026 Eğitim Öğretim Yılı Bahar Dönemi ara sınavları başlamaktadır."
            }
        })
    }

    console.log('Seeding completed!')
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
