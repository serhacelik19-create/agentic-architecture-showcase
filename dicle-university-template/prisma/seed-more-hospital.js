
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding MORE content for Hospital Page...');

    // --- FAZLA HASTANE DUYURULARI ---
    const extraHospitalAnnouncements = [
        {
            title: "Kardiyoloji Polikliniği Yer Değişikliği",
            content: "Kardiyoloji polikliniklerimiz 10 Şubat 2026 tarihinden itibaren B Blok Zemin Katta hizmet verecektir. Hastalarımızın randevu saatinden 15 dakika önce yeni yerinde olmaları rica olunur.",
            active: true,
            date: new Date('2026-02-05')
        },
        {
            title: "Hasta Ziyaret Kuralları Hakkında",
            content: "Enfeksiyon riskini azaltmak amacıyla hasta ziyaretlerine kısıtlama getirilmiştir. Ziyaretçi sayısının 1 kişi ile sınırlandırılması ve maske kullanımı zorunludur.",
            active: true,
            date: new Date('2026-02-04')
        },
        {
            title: "Kan Bağışı Kampanyası",
            content: "Hastanemiz ve Kızılay iş birliği ile 20-22 Şubat tarihleri arasında kan bağışı kampanyası düzenlenecektir. Tüm personelimiz ve halkımız davetlidir.",
            active: true,
            date: new Date('2026-02-01')
        },
        {
            title: "Yeni MR Cihazı Hizmete Girdi",
            content: "Radyoloji ünitemize kazandırılan son teknoloji 3 Tesla MR cihazı hasta kabulüne başlamıştır. Daha hızlı ve yüksek çözünürlüklü görüntüleme imkanı sağlanmaktadır.",
            active: true,
            date: new Date('2026-01-28')
        },
        {
            title: "Gebe Okulu Yeni Dönem Kayıtları",
            content: "Anne adaylarına yönelik düzenlenen Gebe Okulu eğitim programı yeni dönem kayıtları Kadın Doğum Polikliniği sekreterliğinden yapılmaktadır.",
            active: true,
            date: new Date('2026-01-25')
        }
    ];

    for (const ann of extraHospitalAnnouncements) {
        // Check if exists by title
        const existing = await prisma.hospitalAnnouncement.findFirst({ where: { title: ann.title } });
        if (!existing) {
            await prisma.hospitalAnnouncement.create({ data: ann });
        }
    }
    console.log("Added extra hospital announcements.");

    // --- FAZLA ETKİNLİKLER ---
    const extraEvents = [
        {
            title: " Sağlıkta Yapay Zeka Sempozyumu",
            date: new Date('2026-03-10'),
            location: "Tıp Fakültesi Konferans Salonu",
            description: "Yapay zekanın tıbbi tanı ve tedavideki yeri, geleceği ve etik boyutlarının tartışılacağı sempozyum."
        },
        {
            title: "Hemşirelik Haftası Kutlama Etkinliği",
            date: new Date('2026-05-12'),
            location: "Kültür Merkezi",
            description: "Hemşirelik haftası kapsamında düzenlenecek panel, müzik dinletisi ve ödül töreni."
        },
        {
            title: "Dicle Tıp Bahar Futbol Turnuvası",
            date: new Date('2026-04-01'),
            location: "Üniversite Stadyumu",
            description: "Fakülte ve hastane personeli arası geleneksel futbol turnuvası başlangıcı."
        },
        {
            title: "Kanser Farkındalık Semineri",
            date: new Date('2026-04-04'),
            location: "Onkoloji Hastanesi",
            description: "Erken teşhis hayat kurtarır. Kanser türleri, korunma yolları ve tarama yöntemleri hakkında bilgilendirme."
        },
        {
            title: "Tıp Bayramı Balosu",
            date: new Date('2026-03-14'),
            location: "Dicle Üniversitesi Sosyal Tesisleri",
            description: "14 Mart Tıp Bayramı vesilesiyle hekimlerimiz ve sağlık çalışanlarımız için düzenlenecek resepsiyon."
        }
    ];

    for (const event of extraEvents) {
        const existing = await prisma.event.findFirst({
            where: { title: event.title }
        });

        if (!existing) {
            await prisma.event.create({
                data: event
            });
        }
    }
    console.log("Added extra events.");

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
