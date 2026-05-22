export type ChatAction = {
    label: string;
    url?: string;
    type: 'link' | 'copy' | 'action'; // 'action' could be used to trigger app events
};

export type ChatIntent = {
    id: string;
    patterns: string[];
    response: string;
    action?: ChatAction[];
};

export const INTENTS: ChatIntent[] = [
    {
        id: 'greeting',
        patterns: ['merhaba', 'selam', 'hey', 'günaydın', 'iyi günler', 'slm', 'mrb', 'naber'],
        response: "Merhaba! 👋 Ben Dicle Üniversitesi Asistanı. Size nasıl yardımcı olabilirim? Aşağıdaki konularda bilgi verebilirim:\n\n• Kampüs ve Ulaşım\n• Yemekhane Menüsü\n• Akademik Takvim\n• İletişim Bilgileri",
    },
    {
        id: 'food_menu',
        patterns: [
            'yemek', 'yemekte ne var', 'bugün ne yiyeceğiz', 'yemek listesi', 'menü',
            'karnım aç', 'yemekhane', 'öğle yemeği', 'akşam yemeği', 'tabldot'
        ],
        response: "Bugünün yemek menüsü şu şekilde:\n\n🥣 Mercimek Çorbası\n🍖 Orman Kebabı\n🍚 Pirinç Pilavı\n🥗 Mevsim Salata\n\nAfiyet olsun! 😋",
        action: [{ label: "Detaylı Menü", url: "/saglik-kultur-spor/yemekhane", type: 'link' }]
    },
    {
        id: 'transport',
        patterns: [
            'ulaşım', 'otobüs', 'minibüs', 'nasıl giderim', 'durak', 'kampüse gidiş',
            'ring', 'sefer saatleri', 'dağkapı', 'otogar'
        ],
        response: "Kampüse ulaşım için aşağıdaki seçenekleri kullanabilirsiniz:\n\n🚌 **Belediye Otobüsleri:** CE2, CE3, Z5, Z7 hatları kampüs içine kadar gelmektedir.\n🚐 **Minibüsler:** Dağkapı - Fakülte minibüsleri 5 dakikada bir çalışmaktadır.\n\nRing seferleri sabah 08:00 - 17:00 arası kampüs içinde hizmet vermektedir.",
        action: [{ label: "Ulaşım Haritası", url: "/kampus/ulasim", type: 'link' }]
    },
    {
        id: 'academic_calendar',
        patterns: [
            'ne zaman', 'sınavlar', 'tatil', 'vize', 'final', 'bütünleme', 'takvim',
            'akademik takvim', 'okul ne zaman kapanıyor', 'yaz okulu'
        ],
        response: "2025-2026 Akademik Takvimi'ne göre önemli tarihler:\n\n📅 **Güz Yarıyılı Finalleri:** 2-15 Ocak 2026\n📅 **Bütünleme Sınavları:** 20-28 Ocak 2026\n📅 **Bahar Yarıyılı Başlangıcı:** 15 Şubat 2026",
        action: [{ label: "Takvimi Görüntüle", url: "/ogrenci/akademik-takvim", type: 'link' }]
    },
    {
        id: 'contact',
        patterns: [
            'iletişim', 'telefon', 'adres', 'email', 'e-posta', 'nerede', 'konum',
            'rektörlük', 'öğrenci işleri'
        ],
        response: "Dicle Üniversitesi İletişim Bilgileri:\n\n📍 **Adres:** Dicle Üniversitesi Kampüsü, 21280 Sur/Diyarbakır\n📞 **Telefon:** +90 (412) 241 10 00\n📧 **E-posta:** iletisim@dicle.edu.tr",
        action: [{ label: "İletişim Sayfası", url: "/iletisim", type: 'link' }]
    },
    {
        id: 'library',
        patterns: ['kütüphane', 'kitap', 'çalışma saatleri', 'kütüphane nerede', 'ders çalışma'],
        response: "Merkez Kütüphanemiz 7/24 hizmet vermektedir. Öğrenci kimlik kartınızla giriş yapabilir, ödünç kitap alabilir ve çalışma salonlarını kullanabilirsiniz.",
        action: [{ label: "Kütüphane Web", url: "http://www.dicle.edu.tr/kutuphane", type: 'link' }]
    },
    {
        id: 'obs',
        patterns: ['obs', 'öğrenci bilgi sistemi', 'notlar', 'transkript', 'ders kaydı'],
        response: "Öğrenci Bilgi Sistemi (OBS) üzerinden ders kaydı, not görüntüleme ve belge talebi işlemlerinizi yapabilirsiniz.",
        action: [{ label: "OBS Giriş", url: "https://obs.dicle.edu.tr", type: 'link' }]
    },
    {
        id: 'wifi',
        patterns: ['internet', 'wifi', 'eduroam', 'şifre', 'bağlantı'],
        response: "Kampüs genelinde **eduroam** ağı yayını vardır. Kullanıcı adınız `ogrencino@dicle.edu.tr`, şifreniz ise OBS şifrenizdir.",
    },
    {
        id: 'thanks',
        patterns: ['teşekkür', 'sağol', 'teşekkürler', 'tamam', 'ok', 'anladım', 'eyvallah'],
        response: "Rica ederim! Başka bir sorunuz olursa buradayım. 😊",
    }
];

export const FALLBACK_MESSAGE = {
    text: "Bunu henüz öğrenmedim 🤔 Ama aşağıdakileri deneyebilirsin:",
    suggestions: ["Yemek menüsü", "Kampüse ulaşım", "Akademik takvim", "İletişim"]
};
