import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding research data...')

    // 1. Research Highlights
    const highlights = [
        {
            title: "DÜBAP Projeleri",
            description: "Bilimsel Araştırma Projeleri Koordinatörlüğü tarafından desteklenen projeler ve başvuru süreçleri.",
            icon: "FlaskConical",
            type: "HIGHLIGHT",
            url: "#",
            order: 1
        },
        {
            title: "Merkezi Laboratuvar",
            description: "İleri teknoloji cihazlarla donatılmış merkezi araştırma laboratuvarımız araştırmacıların hizmetindedir.",
            icon: "Microscope",
            type: "HIGHLIGHT",
            url: "#",
            order: 2
        },
        {
            title: "Yayınlar & Patentler",
            description: "Akademisyenlerimizin ulusal ve uluslararası hakemli dergilerde yayınlanan makaleleri.",
            icon: "FileText",
            type: "HIGHLIGHT",
            url: "#",
            order: 3
        }
    ]

    for (const item of highlights) {
        await prisma.researchItem.create({ data: item })
    }

    // 2. Research Centers
    const centers = [
        "Güneş Enerjisi Uygulama ve Araştırma Merkezi",
        "Kanser Araştırma Merkezi",
        "Kadın Sorunları Uygulama ve Araştırma Merkezi",
        "GAP Uygulama ve Araştırma Merkezi",
        "Bilim ve Teknoloji Uygulama ve Araştırma Merkezi",
        "Sosyal Araştırmalar Merkezi"
    ]

    for (const center of centers) {
        await prisma.researchItem.create({
            data: {
                title: center,
                type: "CENTER",
                order: 0
            }
        })
    }

    console.log('Research seeding completed!')
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
