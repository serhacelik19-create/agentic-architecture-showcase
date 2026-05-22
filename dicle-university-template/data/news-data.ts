
export interface NewsItem {
    id: string;
    title: string;
    content: string;
    category: "Haber" | "Duyuru" | "Etkinlik";
    imageUrl: string;
    date: Date;
    active: boolean;
    summary?: string; // Optional field for valid mock data compatibility
}

export const NEWS_DATA: NewsItem[] = [
    // --- ETKİNLİKLER ---
    {
        id: "e1",
        title: "Mert Demir Konseri - SelfyFest'2025",
        content: "Dicle Üniversitesi SelfyFest'2025 kapsamında Mert Demir ile coşuyor! Kampüs stadyumunda gerçekleşecek dev konsere tüm öğrencilerimiz davetlidir. Biletler SKS Daire Başkanlığı'ndan temin edilebilir. Konser alanı saat 17:00'de açılacaktır.",
        category: "Etkinlik",
        imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1200&auto=format&fit=crop",
        date: new Date("2025-10-06"),
        active: true,
        summary: "SelfyFest'2025 kapsamında Mert Demir konseri kampüs stadyumunda!"
    },
    {
        id: "e2",
        title: "Dicle Üniversitesi Devlet Konservatuvarı Yılsonu Konseri",
        content: "Konservatuvar öğrencilerimizin hazırladığı Türk Halk Müziği ve Klasik Batı Müziği eserlerinin icra edileceği konserimiz 15 Temmuz Kongre Merkezi'nde. Katılım ücretsizdir ve tüm halkımız davetlidir.",
        category: "Etkinlik",
        imageUrl: "https://images.unsplash.com/photo-1514320291940-7cea0133a81b?q=80&w=1200&auto=format&fit=crop",
        date: new Date("2025-05-22"),
        active: true,
        summary: "Konservatuvar Yılsonu Konseri 15 Temmuz Kongre Merkezi'nde."
    },
    {
        id: "e3",
        title: "2024-2025 Akademik Yılı Açılış Töreni",
        content: "Yeni akademik yıl açılış törenimiz, YÖK Başkanı Prof. Dr. Erol Özvar ve il protokolünün katılımıyla büyük bir heyecanla gerçekleştirildi. Törende akademik başarı ödülleri de sahiplerini buldu.",
        category: "Etkinlik",
        imageUrl: "https://dicle.edu.tr/Contents/2024/10/02/2024-2025-akademik-yil-acilis-toreni-1.jpg",
        date: new Date("2024-10-21"),
        active: true,
        summary: "YÖK Başkanı katılımıyla akademik yıl açılışı yapıldı."
    },
    {
        id: "e4",
        title: "Uluslararası Mezopotamya Tarihi Sempozyumu",
        content: "Dünyanın önde gelen tarihçilerinin katılımıyla gerçekleşecek sempozyumda bölgemizin kadim tarihi ele alınacak. 3 gün sürecek oturumlarda 50'den fazla bildiri sunulacak.",
        category: "Etkinlik",
        imageUrl: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=1200&auto=format&fit=crop",
        date: new Date("2024-11-15"),
        active: true
    },
    {
        id: "e5",
        title: "Kampüs'te Sinema Geceleri: 'Vizontele'",
        content: "Açık hava sinema etkinliklerimiz başlıyor! Bu hafta nostaljik bir yolculuğa çıkıyoruz. Mısırlar bizden, keyif sizden. Etkinlik Rektörlük önü çim alanda yapılacaktır.",
        category: "Etkinlik",
        imageUrl: "https://images.unsplash.com/photo-1513106580091-1d82408b8cd8?q=80&w=1200&auto=format&fit=crop",
        date: new Date("2024-09-10"),
        active: true
    },

    // --- DUYURULAR ---
    {
        id: "d1",
        title: "2024-2025 Bahar Yarıyılı Yatay Geçiş Başvuruları",
        content: "Ön lisans ve lisans programlarına not ortalaması (AGNO) ile yatay geçiş başvuruları başlamıştır. Başvuru kılavuzu ve kontenjanlar için Öğrenci İşleri Daire Başkanlığı sayfasını ziyaret ediniz.",
        category: "Duyuru",
        imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop",
        date: new Date("2025-01-27"),
        active: true,
        summary: "Bahar yarıyılı yatay geçiş başvuruları başladı."
    },
    {
        id: "d2",
        title: "Yemek Bursu Başvuru Sonuçları Açıklandı",
        content: "Sağlık, Kültür ve Spor Daire Başkanlığı tarafından verilen yemek bursu sonuçları OBS üzerinden erişime açılmıştır. Burs kazanan öğrencilerimizin kartlarına tanımlamalar hafta başında yapılacaktır.",
        category: "Duyuru",
        imageUrl: "https://images.unsplash.com/photo-1576267423048-15c0040fec78?q=80&w=1200&auto=format&fit=crop",
        date: new Date("2024-10-15"),
        active: true
    },
    {
        id: "d3",
        title: "Erasmus+ Yabancı Dil Sınavı Yerleri",
        content: "12 Ekim'de yapılacak olan Erasmus+ Yabancı Dil Sınavı giriş belgeleri yayımlanmıştır. Sınav Yabancı Diller Yüksekokulu'nda saat 10:00'da başlayacaktır.",
        category: "Duyuru",
        imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
        date: new Date("2024-10-01"),
        active: true
    },
    {
        id: "d4",
        title: "Merkezi Kütüphane 7/24 Hizmet Dönemi",
        content: "Vize haftası boyunca merkezi kütüphanemiz 7 gün 24 saat açık olacaktır. Gece çalışan öğrencilerimiz için saat 23:00'te ücretsiz çorba ikramı yapılacaktır.",
        category: "Duyuru",
        imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop",
        date: new Date("2024-11-01"),
        active: true
    },
    {
        id: "d5",
        title: "Kampüs Ring Sefer Saatlerinde Değişiklik",
        content: "Kış saati uygulaması nedeniyle kampüs içi ring otobüs saatleri güncellenmiştir. Yeni tarife duraklarda ve web sitemizde ilan edilmiştir.",
        category: "Duyuru",
        imageUrl: "https://images.unsplash.com/photo-1570737146522-8706fa825dd5?q=80&w=1200&auto=format&fit=crop",
        date: new Date("2024-10-25"),
        active: true
    },

    // --- HABERLER ---
    {
        id: "h1",
        title: "2025-2029 Stratejik Planı Yayımlandı",
        content: "Üniversitemizin gelecek 5 yıllık vizyonunu belirleyen stratejik plan kamuoyu ile paylaşıldı. Dijitalleşme, araştırma odaklılık ve bölgesel kalkınma başlıkları öne çıkıyor.",
        category: "Haber",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
        date: new Date("2024-12-26"),
        active: true
    },
    {
        id: "h2",
        title: "Tıp Fakültesi Hastanemize Yeni Onkoloji Merkezi",
        content: "Bölgenin en modern onkoloji merkezi hastanemiz bünyesinde hizmete girdi. Merkezde radyoterapi ve kemoterapi üniteleri son teknoloji cihazlarla yenilendi.",
        category: "Haber",
        imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop",
        date: new Date("2024-11-10"),
        active: true
    },
    {
        id: "h3",
        title: "TÜBİTAK Projelerinde Rekor Başarı",
        content: "Öğrencilerimiz ve akademisyenlerimiz tarafından hazırlanan 45 proje TÜBİTAK tarafından desteklenmeye değer görüldü. Üniversitemiz bölge üniversiteleri arasında birinci sırada yer aldı.",
        category: "Haber",
        imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200&auto=format&fit=crop",
        date: new Date("2024-12-15"),
        active: true
    },
    {
        id: "h4",
        title: "Milli Sporcularımızdan Altın Madalya",
        content: "Üniversitelerarası Boks Şampiyonası'nda öğrencilerimiz takım halinde Türkiye Şampiyonu oldu. Rektörümüz sporcuları makamında kabul ederek tebrik etti.",
        category: "Haber",
        imageUrl: "https://images.unsplash.com/photo-1599580665203-b54130d522f6?q=80&w=1200&auto=format&fit=crop",
        date: new Date("2024-05-15"),
        active: true
    },
    {
        id: "h5",
        title: "Yeşil Kampüs Sıralamasında Yükseliş",
        content: "Dünya üniversiteleri çevrecilik sıralaması GreenMetric'te üniversitemiz 50 basamak birden yükselerek ilk 200'e girdi. Sürdürülebilir kampüs çalışmalarımız hız kesmeden devam ediyor.",
        category: "Haber",
        imageUrl: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1200&auto=format&fit=crop",
        date: new Date("2024-12-01"),
        active: true
    }
];
