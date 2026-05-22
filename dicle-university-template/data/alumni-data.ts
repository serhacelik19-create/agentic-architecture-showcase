export interface AlumniStory {
    id: string;
    name: string;
    role: string;
    gradYear: string;
    faculty: string;
    quote: string;
    image: string;
    longStory?: string;
    location?: string;
}

export const ALUMNI_STORIES: AlumniStory[] = [
    {
        id: "a1",
        name: "Dr. Ayşe Yılmaz",
        role: "Başhekim Yardımcısı",
        location: "İstanbul Memorial Hastanesi",
        gradYear: "2010",
        faculty: "Tıp Fakültesi",
        quote: "Dicle Üniversitesi'nde aldığım eğitim, meslek hayatımdaki başarının temel taşıdır. Kampüsteki uygulama imkanları beni gerçek dünyaya hazırladı.",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "a2",
        name: "Mehmet Demir",
        role: "Kıdemli Yazılım Mühendisi",
        location: "Google - Mountain View",
        gradYear: "2015",
        faculty: "Mühendislik Fakültesi",
        quote: "Bilgisayar Mühendisliği bölümündeki hocalarımın vizyonu, bugün dünya devlerinde çalışmamın kapılarını araladı.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "a3",
        name: "Av. Zeynep Kaya",
        role: "Kurucu Ortak",
        location: "Kaya Legal Hukuk Bürosu",
        gradYear: "2012",
        faculty: "Hukuk Fakültesi",
        quote: "Burada sadece yasaları değil, adaletin ve savunma hakkının kutsallığını öğrendim. Dicle'den mezun olmak bir ayrıcalıktır.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "a4",
        name: "Prof. Dr. Selim Aksu",
        role: "Radyoloji Uzmanı / Araştırmacı",
        location: "Harvard Medical School",
        gradYear: "2005",
        faculty: "Tıp Fakültesi",
        quote: "Bilimin evrenselliğini Dicle'nin laboratuvarlarında keşfettim. Şimdi dünyanın en prestijli kurumlarında bu mirası sürdürüyorum.",
        image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "a5",
        name: "Ece Erdem",
        role: "Kreatif Direktör",
        location: "Vogue Türkiye",
        gradYear: "2018",
        faculty: "Sanat ve Tasarım Fakültesi",
        quote: "Grafik Tasarım bölümü bana estetiği ve iletişimi dijital dünyayla birleştirmeyi öğretti.",
        image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "a6",
        name: "Hakan Yıldız",
        role: "Diplomat / Konsolosluk Görevlisi",
        location: "T.C. Dışişleri Bakanlığı",
        gradYear: "2014",
        faculty: "İktisadi ve İdari Bilimler Fakültesi",
        quote: "Siyaset Bilimi bölümü bana dünyayı analiz etme ve çözüm üretme yetisi kazandırdı.",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop"
    }
];
