
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding real content (JS version)...');

    // --- HABERLER ---
    const newsData = [
        {
            title: "Dicle Üniversitesi ve DİSİDER Arasında İş Birliği Protokolü",
            content: "Dicle Üniversitesi ile Diyarbakır Sanayici ve İş Dünyası Derneği (DİSİDER) arasında inovasyon ve girişimcilik merkezi kurulmasına yönelik iş birliği protokolü imzalandı. Rektörümüz Prof. Dr. Kamuran Eronat ve DİSİDER Başkanı Şeyhmus Akbaş'ın katıldığı törenle imzalanan protokol, üniversite-sanayi iş birliğini güçlendirmeyi hedefliyor.",
            category: "Haber",
            date: new Date('2026-01-22'),
            image: "https://images.unsplash.com/photo-1629904853716-f004b3a43697?q=80&w=1000&auto=format&fit=crop",
            slug: "disider-isbirligi-protokolu"
        },
        {
            title: "6 Şubat Depremlerini Anma Programı",
            content: "6 Şubat depremlerinin yıl dönümü vesilesiyle Dicle Üniversitesi'nde hayatını kaybeden vatandaşlarımız için mevlit ve dua programı düzenlendi. Yoğun katılımla gerçekleşen programda duygusal anlar yaşandı.",
            category: "Haber",
            date: new Date('2026-02-06'),
            image: "https://images.unsplash.com/photo-1549488497-2956cf28734c?q=80&w=1000&auto=format&fit=crop",
            slug: "6-subat-depremleri-anma"
        },
        {
            title: "Hukuk Fakültesinde 'Kamu Sağlık Yönetimi' Konferansı",
            content: "Dicle Üniversitesi Hukuk Fakültesi tarafından düzenlenen 'Kamu Sağlık Yönetimi' konulu konferans, alanında uzman akademisyenlerin katılımıyla gerçekleştirildi. Sağlık hukuku ve yönetimi konularının derinlemesine ele alındığı konferansa öğrenciler yoğun ilgi gösterdi.",
            category: "Haber",
            date: new Date('2026-02-06'),
            image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop",
            slug: "kamu-saglik-yonetimi-konferansi"
        },
        {
            title: "3. Bölgesel Üniversiteler İstişare Toplantısı",
            content: "Bölge üniversiteleri arasındaki iş birliğini artırmak amacıyla düzenlenen istişare toplantılarının üçüncüsü Dicle Üniversitesi ev sahipliğinde yapıldı. Toplantıda eğitim kalitesinin artırılması ve ortak projeler geliştirilmesi konuları görüşüldü.",
            category: "Haber",
            date: new Date('2026-02-05'),
            image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1000&auto=format&fit=crop",
            slug: "bolgesel-universiteler-istisare"
        },
        {
            title: "Dicle Üniversitesi Hastaneleri 2025 Yılı Raporu",
            content: "Dicle Üniversitesi Hastaneleri, 2025 yılında toplam 1.18 milyon hastaya hizmet vererek bölgenin en önemli sağlık üslerinden biri olduğunu kanıtladı. Başhekimlik tarafından açıklanan rapora göre, hastaların 285 bini il dışından sevk ile geldi.",
            category: "Haber",
            date: new Date('2026-01-15'),
            image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=1000&auto=format&fit=crop",
            slug: "hastane-2025-raporu"
        }
    ];

    for (const news of newsData) {
        await prisma.news.upsert({
            where: { slug: news.slug },
            update: news,
            create: { ...news, published: true }
        });
    }
    console.log(`Updated ${newsData.length} news items.`);

    // --- ETKİNLİKLER ---
    const eventsData = [
        {
            title: "Matematiksel İlişkilendirmeyi Öğretme Çalıştayı",
            date: new Date('2026-02-02'),
            location: "Ziya Gökalp Eğitim Fakültesi",
            description: "Matematik eğitimi üzerine modern yaklaşımlar ve ilişkilendirme stratejileri."
        },
        {
            title: "Nurettin Rençber Konseri",
            date: new Date('2026-02-14'),
            location: "Kongre Merkezi",
            description: "Sevilen sanatçı Nurettin Rençber, Dicle Üniversitesi öğrencileriyle buluşuyor."
        },
        {
            title: "Finansal Okuryazarlık Eğitimi",
            date: new Date('2026-02-17'),
            location: "İktisadi ve İdari Bilimler Fakültesi",
            description: "Bütçe yönetimi, yatırım araçları ve ekonomik göstergelerin okunması üzerine sertifikalı eğitim."
        },
        {
            title: "Diyarbakır'ın Yaşayan Kültür İnsanları Paneli",
            date: new Date('2026-02-18'),
            location: "Kültür ve Sanat Merkezi",
            description: "Şehrin kültürüne katkı sunan değerli isimlerin katılacağı panel."
        },
        {
            title: "Uluslararası Kürt Dili Sempozyumu",
            date: new Date('2026-11-20'),
            location: "Kongre Merkezi",
            description: "Din, Tarih, Dil ve Kültür temalı uluslararası katılımlı sempozyum."
        }
    ];

    for (const event of eventsData) {
        const existing = await prisma.event.findFirst({
            where: {
                title: event.title
                // date consideration omitted for simple check
            }
        });

        if (!existing) {
            await prisma.event.create({
                data: event
            });
        }
    }
    console.log(`Updated events.`);


    // --- DUYURULAR (GENEL) ---
    const announcementsData = [
        {
            title: "2025-2026 Bahar Yarıyılı Yatay Geçiş Başvuruları",
            content: "Önlisans ve lisans programlarına kurumlar arası ve merkezi yerleştirme puanı ile yatay geçiş başvuruları başlamıştır. Detaylar ve başvuru takvimi için öğrenci işleri sayfasını ziyaret ediniz.",
            slug: "2025-2026-bahar-yatay-gecis",
            active: true
        },
        {
            title: "Lojman Genel Kurul Toplantısı",
            content: "Üniversitemiz lojman sakinleri için yıllık genel kurul toplantısı 20 Şubat 2026 tarihinde Rektörlük konferans salonunda yapılacaktır.",
            slug: "lojman-genel-kurul-2026",
            active: true
        },
        {
            title: "Yüksek Lisans Başvuru Sonuçları Açıklandı",
            content: "Sosyal Bilimler Enstitüsü Kamu Hukuku Ana Bilim Dalı Uluslararası Ortak Yüksek Lisans programı başvuru sonuçlarına enstitü web sayfasından ulaşabilirsiniz.",
            slug: "yuksek-lisans-sonuclari-2026",
            active: true
        }
    ];

    for (const ann of announcementsData) {
        await prisma.announcement.upsert({
            where: { slug: ann.slug },
            update: ann,
            create: ann
        });
    }
    console.log(`Updated ${announcementsData.length} announcements.`);

    // --- HASTANE DUYURULARI (HospitalAnnouncement) ---
    const hospitalAnnouncements = [
        {
            title: "Poliklinik Randevu Sistemi Güncellemesi",
            content: "Online randevu sistemimizde yapılan bakım çalışması tamamlanmıştır. Artık 15 gün sonrasına kadar randevu alabilirsiniz.",
            active: true
        },
        {
            title: "Diyabet Okulu Kayıtları Başladı",
            content: "Hastanemiz Endokrinoloji bölümü bünyesinde düzenlenecek olan Diyabet Okulu eğitim programı kayıtları başlamıştır.",
            active: true
        },
        {
            title: "Ziyaret Saatlerinde Düzenleme",
            content: "Kış saati uygulaması nedeniyle yataklı servis ziyaret saatleri 13:00-14:00 ve 18:00-19:00 olarak güncellenmiştir.",
            active: true
        }
    ];

    for (const hann of hospitalAnnouncements) {
        const existing = await prisma.hospitalAnnouncement.findFirst({
            where: { title: hann.title }
        });
        if (!existing) {
            await prisma.hospitalAnnouncement.create({
                data: hann
            });
        }
    }
    console.log("Updated hospital announcements.");

    console.log('Seeding completed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
