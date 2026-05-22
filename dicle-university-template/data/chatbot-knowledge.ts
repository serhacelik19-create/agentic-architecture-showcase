
export type Intent = {
    id: string;
    keywords: string[]; // Keywords to match (roots)
    requiredWords?: string[]; // Optional specific requirements
    responses: string[]; // Random responses
    actions?: { label: string; url: string }[];
    payload?: any; // Rich data
    scoreThreshold?: number;
};

export const KNOWLEDGE_BASE: Intent[] = [
    {
        id: 'greeting',
        keywords: ['merhaba', 'selam', 'hey', 'günaydın', 'naber'],
        responses: [
            "Merhaba! 👋 Size nasıl yardımcı olabilirim?",
            "Selamlar! 🎓 Dicle Üniversitesi Asistanı hizmetinizde.",
            "Merhaba! Kampüs, ulaşım veya yemekhane hakkında sorularınızı bekliyorum."
        ],
        scoreThreshold: 2
    },
    {
        id: 'farewell',
        keywords: ['görüşürüz', 'baybay', 'hoşçakal', 'bye', 'sağol', 'teşekkür'],
        responses: [
            "Görüşmek üzere! 👋",
            "Rica ederim, iyi günler! 🎓",
            "Yardımcı olabildiysem ne mutlu bana. İyi çalışmalar!"
        ],
        scoreThreshold: 2
    },
    {
        id: 'food_menu',
        keywords: ['yemek', 'menü', 'açım', 'çorba', 'karnım', 'öğle', 'yemekhane'],
        responses: [
            "Afiyet olsun! 🍽️ İşte bugünün menüsü:",
            "Yemekhanemizde bugün şu lezzetler var:"
        ],
        payload: {
            type: 'food_menu',
            date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }),
            items: [
                { name: "Mercimek Çorbası", cal: 130 },
                { name: "İzmir Köfte", cal: 380 },
                { name: "Bulgur Pilavı", cal: 240 },
                { name: "Cacık", cal: 90 },
                { name: "Kemalpaşa Tatlısı", cal: 320 }
            ]
        },
        actions: [
            { label: "🍽️ Tüm Menü", url: "/saglik-kultur-spor/yemekhane" }
        ]
    },
    // --- SPECIAL TRANSPORT LOCATIONS ---
    {
        id: 'transport_dagkapi',
        keywords: ['dağkapı', 'dagkapı', 'çarşı', 'merkez', 'sur'],
        responses: [
            "Dağkapı'ya gitmek için kampüs içinden kalkan minibüsleri veya belediye otobüslerini kullanabilirsiniz.",
            "Dağkapı (Merkez) yönüne giden araçlar:"
        ],
        payload: {
            type: 'info_card',
            title: "Ulaşım: Kampüs ➝ Dağkapı (Merkez)",
            content: "🚌 **Otobüs:** CE2, AZ\n🚐 **Minibüs:** Fakülte-Dağkapı Hattı\n⏱️ **Süre:** Yaklaşık 20-25 dk\n📍 **Durak:** Kampüs ana duraklarından binebilirsiniz."
        },
        actions: [{ label: "📍 Harita", url: "/kampus-haritasi" }]
    },
    {
        id: 'transport_ofis',
        keywords: ['ofis', 'kasaplar', 'sanat', 'sokağı'],
        responses: [
            "Ofis semtine ulaşım bilgileri şöyledir:",
        ],
        payload: {
            type: 'info_card',
            title: "Ulaşım: Kampüs ➝ Ofis",
            content: "🚌 **Otobüs:** Z2 Hattı (Ziraat Fakültesi önünden geçer)\n🚐 **Minibüs:** Seyrantepe veya Ofis hattı\n💡 **İpucu:** Dağkapı'ya gidip oradan yürüyerek de geçebilirsiniz."
        },
        actions: [{ label: "📍 Harita", url: "/kampus-haritasi" }]
    },
    {
        id: 'transport_otogar',
        keywords: ['otogar', 'terminal', 'otobüs terminali'],
        responses: [
            "Şehirlerarası Otobüs Terminali'ne (Otogar) gitmek için:",
        ],
        payload: {
            type: 'info_card',
            title: "Ulaşım: Kampüs ➝ Otogar",
            content: "🚌 **Otobüs:** Z3 (Üniversite - Otogar Hattı)\n⏱️ **Kalkış:** Ana duraktan saat başı hareket eder.\n⚠️ **Not:** Bavulunuz büyükse taksi kullanmak daha rahat olabilir."
        },
        actions: [{ label: "📍 Harita", url: "/kampus-haritasi" }]
    },
    // --- GENERAL INTENTS ---
    {
        id: 'transport_general',
        keywords: ['ulaşım', 'otobüs', 'minibüs', 'nasıl gidilir', 'adres', 'konum', 'nerede', 'durak'],
        responses: [
            "Kampüsümüze şehrin birçok noktasından kolayca ulaşabilirsiniz. 🚌",
        ],
        payload: {
            type: 'info_card',
            title: "Genel Ulaşım Bilgileri",
            content: "Kampüse ulaşım için CE2, CE3, CE4 ve Z2 numaralı belediye otobüslerini kullanabilirsiniz. Ayrıca şehrin birçok noktasından minibüs seferleri mevcuttur."
        },
        actions: [
            { label: "📍 Kampüs Haritası", url: "/kampus-haritasi" }
        ],
        scoreThreshold: 1 // Lower threshold for general inquiries
    },
    {
        id: 'calendar',
        keywords: ['takvim', 'akademik', 'sınav', 'vize', 'final', 'büt', 'ne zaman', 'yaz okulu', 'tatil'],
        responses: [
            "Akademik takvime göre önemli tarihler şunlardır: 📅",
        ],
        payload: {
            type: 'list',
            title: "🎓 Önemli Akademik Tarihler",
            items: [
                "📅 18 Eylül: Güz Dönemi Başlangıcı",
                "📝 20-28 Kasım: Ara Sınavlar (Vizeler)",
                "🎄 1 Ocak: Yılbaşı Tatili",
                "🏁 15 Ocak: Final Sınavları Başlangıcı"
            ]
        },
        actions: [
            { label: "📅 Tam Takvim", url: "/ogrenci/akademik-takvim" }
        ]
    },
    {
        id: 'contact',
        keywords: ['iletişim', 'telefon', 'mail', 'eposta', 'adres', 'yer'],
        responses: ["İletişim bilgilerimiz: ☎️"],
        payload: {
            type: 'info_card',
            title: "Dicle Üniversitesi İletişim",
            content: "📞 **Santral:** +90 (412) 241 10 00\n📧 **E-posta:** rektorluk@dicle.edu.tr\n📍 **Adres:** Dicle Üniversitesi Kampüsü, 21280 Sur/Diyarbakır"
        },
        actions: [{ label: "📞 İletişim Sayfası", url: "/iletisim" }]
    },
    {
        id: 'library',
        keywords: ['kütüphane', 'kitap', 'ders', 'çalışma', 'salon'],
        responses: ["Kütüphanemiz hakkında bilgiler: 📚"],
        actions: [{ label: "📚 Kütüphane Web", url: "http://www.dicle.edu.tr/kutuphane" }]
    }
];
