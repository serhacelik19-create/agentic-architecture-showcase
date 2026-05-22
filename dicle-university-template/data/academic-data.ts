
export interface AcademicUnit {
    id: string;
    name: string;
    description: string;
    departments: string[];
    type: "Faculty" | "Institute" | "School";
    website: string;
    phone: string;
    email: string;
    address: string;
    dean?: string; // Dean for faculties, Director for others
}

export const ACADEMIC_UNITS: AcademicUnit[] = [
    // --- FAKÜLTELER ---
    {
        id: "f1",
        name: "Tıp Fakültesi",
        description: "Bölgenin en köklü tıp fakültesi olarak, çağdaş tıp eğitimini, ileri teknolojiyi ve etik değerleri birleştiren hekimler yetiştiriyoruz.",
        departments: ["Temel Tıp Bilimleri", "Dahili Tıp Bilimleri", "Cerrahi Tıp Bilimleri"],
        type: "Faculty",
        website: "https://tip.dicle.edu.tr",
        phone: "0 (412) 248 80 01",
        email: "tip@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü, Sur / DİYARBAKIR",
        dean: "Prof. Dr. Cahfer GÜLOĞLU"
    },
    {
        id: "f2",
        name: "Hukuk Fakültesi",
        description: "Adaletin tesisi için gerekli hukuki donanıma sahip, eleştirel düşünebilen ve etik değerlere bağlı hukukçular yetiştirmeyi hedefliyoruz.",
        departments: ["Kamu Hukuku", "Özel Hukuk"],
        type: "Faculty",
        website: "https://hukuk.dicle.edu.tr",
        phone: "0 (412) 248 80 02",
        email: "hukuk@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü, Sur / DİYARBAKIR",
        dean: "Prof. Dr. Hasan TANRIVERDİ"
    },
    {
        id: "f3",
        name: "Mühendislik Fakültesi",
        description: "Teknoloji ve mühendislik alanında yenilikçi çözümler üreten, analitik düşünme yeteneğine sahip mühendisler yetiştiriyoruz.",
        departments: ["Bilgisayar Mühendisliği", "Elektrik-Elektronik Mühendisliği", "İnşaat Mühendisliği", "Makine Mühendisliği", "Maden Mühendisliği"],
        type: "Faculty",
        website: "https://muhendislik.dicle.edu.tr",
        phone: "0 (412) 248 80 03",
        email: "muhendislik@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü, Mühendislik Binası",
        dean: "Prof. Dr. Mehmet Siraç ÖZERDEM"
    },
    {
        id: "f4",
        name: "Ziya Gökalp Eğitim Fakültesi",
        description: "Geleceğin nesillerini yetiştirecek, pedagojik formasyona sahip, çağdaş ve donanımlı öğretmenler yetiştirme misyonunu sürdürüyoruz.",
        departments: ["Temel Eğitim", "Matematik ve Fen Bilimleri Eğitimi", "Türkçe ve Sosyal Bilimler Eğitimi", "Yabancı Diller Eğitimi"],
        type: "Faculty",
        website: "https://zgegitim.dicle.edu.tr",
        phone: "0 (412) 248 80 04",
        email: "ygegitim@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü, Sur / DİYARBAKIR",
        dean: "Prof. Dr. Giray TOPAL"
    },
    {
        id: "f5",
        name: "Fen Fakültesi",
        description: "Temel bilimlerde evrensel standartlarda eğitim ve araştırma faaliyetleri yürüterek bilime katkı sunuyoruz.",
        departments: ["Matematik", "Fizik", "Kimya", "Biyoloji", "Moleküler Biyoloji ve Genetik"],
        type: "Faculty",
        website: "https://fen.dicle.edu.tr",
        phone: "0 (412) 248 80 05",
        email: "fen@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü, Sur / DİYARBAKIR",
        dean: "Prof. Dr. Ahmet KILIÇ"
    },
    {
        id: "f6",
        name: "Edebiyat Fakültesi",
        description: "Dil, tarih, coğrafya ve kültür alanlarında akademik birikimi artıran ve kültürel mirası koruyan çalışmalar yapıyoruz.",
        departments: ["Türk Dili ve Edebiyatı", "Tarih", "Coğrafya", "Psikoloji", "Sosyoloji", "Arkeoloji"],
        type: "Faculty",
        website: "https://edebiyat.dicle.edu.tr",
        phone: "0 (412) 248 80 06",
        email: "edebiyat@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü, Sur / DİYARBAKIR",
        dean: "Prof. Dr. M. Nesim DORU"
    },
    {
        id: "f7",
        name: "İktisadi ve İdari Bilimler Fakültesi",
        description: "Ekonomi, yönetim ve siyaset bilimi alanlarında yetkin, küresel gelişmeleri takip edebilen liderler yetiştiriyoruz.",
        departments: ["İktisat", "İşletme", "Siyaset Bilimi ve Kamu Yönetimi", "Maliye"],
        type: "Faculty",
        website: "https://iibf.dicle.edu.tr",
        phone: "0 (412) 248 80 07",
        email: "iibf@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü, Sur / DİYARBAKIR",
        dean: "Prof. Dr. Seyfettin ASLAN"
    },
    {
        id: "f8",
        name: "İlahiyat Fakültesi",
        description: "Dini ilimlerde yetkin, kültürel mirası özümsemiş ve toplumsal değerlere saygılı din görevlileri ve akademisyenler yetiştiriyoruz.",
        departments: ["Temel İslam Bilimleri", "Felsefe ve Din Bilimleri", "İslam Tarihi ve Sanatları"],
        type: "Faculty",
        website: "https://ilahiyat.dicle.edu.tr",
        phone: "0 (412) 248 80 08",
        email: "ilahiyat@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü, Sur / DİYARBAKIR",
        dean: "Prof. Dr. Ali AKAY"
    },
    {
        id: "f9",
        name: "Mimarlık Fakültesi",
        description: "Estetik, işlevsellik ve sürdürülebilirlik ilkeleriyle çevreye duyarlı yaşam alanları tasarlayan mimarlar mezun ediyoruz.",
        departments: ["Mimarlık", "Şehir ve Bölge Planlama", "İç Mimarlık"],
        type: "Faculty",
        website: "https://mimarlik.dicle.edu.tr",
        phone: "0 (412) 248 80 09",
        email: "mimarlik@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü, Sur / DİYARBAKIR",
        dean: "Prof. Dr. Mine BARAN"
    },
    {
        id: "f10",
        name: "Diş Hekimliği Fakültesi",
        description: "Ağız ve diş sağlığı alanında yetkin, modern tedavi yöntemlerini uygulayabilen diş hekimleri yetiştirmekteyiz.",
        departments: ["Klinik Bilimler", "Temel Bilimler"],
        type: "Faculty",
        website: "https://dis.dicle.edu.tr",
        phone: "0 (412) 248 80 10",
        email: "dis@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü, Sur / DİYARBAKIR",
        dean: "Prof. Dr. Veysel Ercan ÖZDEMİR"
    },
    {
        id: "f11",
        name: "Eczacılık Fakültesi",
        description: "İlaç bilimi ve teknolojisi alanında uzman, toplum sağlığını önceleyen eczacılar yetiştiriyoruz.",
        departments: ["Eczacılık Teknolojisi", "Eczacılık Meslek Bilimleri"],
        type: "Faculty",
        website: "https://eczacilik.dicle.edu.tr",
        phone: "0 (412) 248 80 11",
        email: "eczacilik@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü, Sur / DİYARBAKIR",
        dean: "Prof. Dr. Meral ERDİNÇ"
    },
    {
        id: "f12",
        name: "Veteriner Fakültesi",
        description: "Hayvan sağlığı, refahı ve gıda güvenliği konularında uzman veteriner hekimler yetiştirmekteyiz.",
        departments: ["Temel Bilimler", "Klinik Öncesi Bilimler", "Klinik Bilimler", "Hayvan Besleme ve Zootekni"],
        type: "Faculty",
        website: "https://veteriner.dicle.edu.tr",
        phone: "0 (412) 248 80 12",
        email: "veteriner@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü, Sur / DİYARBAKIR",
        dean: "Prof. Dr. Aydın VURAL"
    },
    {
        id: "f13",
        name: "Ziraat Fakültesi",
        description: "Sürdürülebilir tarım teknikleri ve gıda güvenliği alanında bilimsel çalışmalar yürüten ziraat mühendisleri yetiştiriyoruz.",
        departments: ["Bahçe Bitkileri", "Tarla Bitkileri", "Bitki Koruma", "Zootekni"],
        type: "Faculty",
        website: "https://ziraat.dicle.edu.tr",
        phone: "0 (412) 248 80 13",
        email: "ziraat@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü, Sur / DİYARBAKIR",
        dean: "Prof. Dr. Muzaffer DENLİ"
    },
    {
        id: "f14",
        name: "İletişim Fakültesi",
        description: "Medya ve iletişim sektörünün ihtiyaç duyduğu, etik değerlere sahip, yaratıcı iletişimciler yetiştirmekteyiz.",
        departments: ["Gazetecilik", "Halkla İlişkiler ve Tanıtım", "Radyo, Televizyon ve Sinema"],
        type: "Faculty",
        website: "https://iletisim.dicle.edu.tr",
        phone: "0 (412) 248 80 14",
        email: "iletisim@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü, Sur / DİYARBAKIR",
        dean: "Prof. Dr. Zeynel Abidin YILMAZ"
    },
    {
        id: "f15",
        name: "Sanat ve Tasarım Fakültesi",
        description: "Sanatın evrensel dilini kullanarak estetik değeri yüksek eserler üreten sanatçılar ve tasarımcılar yetiştiriyoruz.",
        departments: ["Resim", "Grafik Tasarım", "Müzik"],
        type: "Faculty",
        website: "https://sanattasarim.dicle.edu.tr",
        phone: "0 (412) 248 80 15",
        email: "sanat@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü, Sur / DİYARBAKIR",
        dean: "Prof. Dr. İrfan YILDIZ"
    },
    {
        id: "f16",
        name: "Uygulamalı Bilimler Fakültesi",
        description: "Teorik bilgiyi pratiğe dönüştüren, sektörün ihtiyaçlarına yönelik nitelikli uzmanlar yetiştiriyoruz.",
        departments: ["Havacılık Yönetimi", "Lojistik Yönetimi"],
        type: "Faculty",
        website: "https://ubyo.dicle.edu.tr",
        phone: "0 (412) 248 80 16",
        email: "ubyo@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü, Sur / DİYARBAKIR",
        dean: "Prof. Dr. Bahar BURTAN DOĞAN"
    }
];

export const INSTITUTES: AcademicUnit[] = [
    {
        id: "i1",
        name: "Fen Bilimleri Enstitüsü",
        description: "Fen ve mühendislik alanlarında lisansüstü eğitim.",
        departments: [],
        type: "Institute",
        website: "https://fbe.dicle.edu.tr",
        phone: "0 (412) 248 80 20",
        email: "fbe@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü",
        dean: "Prof. Dr. Sezai ASLAN"
    },
    {
        id: "i2",
        name: "Sağlık Bilimleri Enstitüsü",
        description: "Sağlık alanında uzmanlık ve doktora eğitimi.",
        departments: [],
        type: "Institute",
        website: "https://saglik.dicle.edu.tr",
        phone: "0 (412) 248 80 21",
        email: "saglikbil@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü",
        dean: "Prof. Dr. Vahap ASLAN"
    },
    {
        id: "i3",
        name: "Sosyal Bilimler Enstitüsü",
        description: "Sosyal ve beşeri bilimlerde ileri düzey araştırmalar.",
        departments: [],
        type: "Institute",
        website: "https://sbe.dicle.edu.tr",
        phone: "0 (412) 248 80 22",
        email: "sbe@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü",
        dean: "Prof. Dr. Bahar BURTAN DOĞAN"
    },
    {
        id: "i4",
        name: "Eğitim Bilimleri Enstitüsü",
        description: "Eğitim alanında uzmanlaşmak isteyenler için lisansüstü programlar.",
        departments: [],
        type: "Institute",
        website: "https://ebe.dicle.edu.tr",
        phone: "0 (412) 248 80 23",
        email: "ebe@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü",
        dean: "Prof. Dr. İlhan KAYA"
    }
];

export const SCHOOLS: AcademicUnit[] = [
    {
        id: "s1",
        name: "Beden Eğitimi ve Spor Yüksekokulu",
        description: "Spor bilimleri alanında nitelikli sporcular, antrenörler ve eğitimciler yetiştiriyoruz.",
        departments: ["Beden Eğitimi ve Spor Öğretmenliği", "Antrenörlük Eğitimi", "Spor Yöneticiliği"],
        type: "School",
        website: "https://besyo.dicle.edu.tr",
        phone: "0 (412) 248 80 30",
        email: "besyo@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü, Spor Kompleksi",
        dean: "Doç. Dr. Savaş AYHAN"
    },
    {
        id: "s2",
        name: "Sivil Havacılık Yüksekokulu",
        description: "Havacılık sektörüne nitelikli personel yetiştiren, uluslararası standartlarda eğitim veren bir okuldur.",
        departments: ["Havacılık Yönetimi", "Uçak Gövde ve Motor Bakımı"],
        type: "School",
        website: "https://shyo.dicle.edu.tr",
        phone: "0 (412) 248 80 31",
        email: "shyo@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü",
        dean: "Dr. Öğr. Üyesi Mehmet Ali AKALIN"
    },
    {
        id: "s3",
        name: "Devlet Konservatuvarı",
        description: "Müzik ve sahne sanatları alanında yetenekli sanatçılar yetiştiren sanat kurumumuz.",
        departments: ["Müzik", "Türk Musikisi", "Sahne Sanatları"],
        type: "School",
        website: "https://konservatuvar.dicle.edu.tr",
        phone: "0 (412) 248 80 32",
        email: "konservatuvar@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü, Kültür Merkezi",
        dean: "Doç. Dr. Mustafa Uğurlu ARSLAN"
    },
    {
        id: "s4",
        name: "Yabancı Diller Yüksekokulu",
        description: "Üniversitemiz öğrencilerinin yabancı dil yeterliliklerini geliştiren, modern dil eğitimi merkezi.",
        departments: ["Yabancı Diller", "Hazırlık Sınıfları"],
        type: "School",
        website: "https://ydyo.dicle.edu.tr",
        phone: "0 (412) 248 80 33",
        email: "ydyo@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü, Yabancı Diller Binası",
        dean: "Dr. Öğr. Üyesi Mustafa GÜLEÇ"
    }
];

export const VOCATIONAL_SCHOOLS: AcademicUnit[] = [
    {
        id: "v1",
        name: "Adalet Meslek Yüksekokulu",
        description: "Adalet hizmetlerinde görev alacak nitelikli ara elemanlar yetiştiriyoruz.",
        departments: ["Adalet", "Ceza İnfaz ve Güvenlik Hizmetleri"],
        type: "School",
        website: "https://adaletmyo.dicle.edu.tr",
        phone: "0 (412) 248 80 40",
        email: "adaletmyo@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü"
    },
    {
        id: "v2",
        name: "Atatürk Sağlık Hizmetleri MYO",
        description: "Sağlık sektörünün ihtiyaç duyduğu teknikerleri yetiştiren köklü okulumuz.",
        departments: ["Tıbbi Hizmetler", "Dişçilik Hizmetleri", "Terapi ve Rehabilitasyon"],
        type: "School",
        website: "https://ashmyo.dicle.edu.tr",
        phone: "0 (412) 248 80 41",
        email: "ashmyo@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü"
    },
    {
        id: "v3",
        name: "Diyarbakır Teknik Bilimler MYO",
        description: "Teknik ve endüstriyel alanlarda uygulama ağırlıklı eğitim veren meslek yüksekokulu.",
        departments: ["Bilgisayar Teknolojileri", "Elektrik ve Enerji", "Makine ve Metal Teknolojileri"],
        type: "School",
        website: "https://tbm.dicle.edu.tr",
        phone: "0 (412) 248 80 42",
        email: "dtbmyo@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü"
    },
    {
        id: "v4",
        name: "Diyarbakır Sosyal Bilimler MYO",
        description: "İş dünyası ve hizmet sektörüne yönelik nitelikli meslek elemanları yetiştiriyoruz.",
        departments: ["Muhasebe ve Vergi", "Büro Hizmetleri", "Pazarlama ve Reklamcılık"],
        type: "School",
        website: "https://dsbmyo.dicle.edu.tr",
        phone: "0 (412) 248 80 43",
        email: "dsbmyo@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü"
    },
    {
        id: "v5",
        name: "Diyarbakır Tarım MYO",
        description: "Bölge tarımına katkı sunacak tekniker ve ziraat teknisyenleri yetiştiriyoruz.",
        departments: ["Bitkisel ve Hayvansal Üretim", "Gıda İşleme"],
        type: "School",
        website: "https://ziraatmyo.dicle.edu.tr",
        phone: "0 (412) 248 80 44",
        email: "tarimmyo@dicle.edu.tr",
        address: "Dicle Üniversitesi Kampüsü"
    },
    {
        id: "v6",
        name: "Bismil Meslek Yüksekokulu",
        description: "Bismil ilçesinde eğitim veren, yerel kalkınmaya destek olan meslek yüksekokulu.",
        departments: ["Organik Tarım", "Alternatif Enerji Kaynakları"],
        type: "School",
        website: "https://bismilmyo.dicle.edu.tr",
        phone: "0 (412) 248 84 00",
        email: "bismilmyo@dicle.edu.tr",
        address: "Bismil, Diyarbakır"
    },
    {
        id: "v7",
        name: "Çermik Meslek Yüksekokulu",
        description: "Çermik ilçesinde, turizm ve sağlık alanlarına odaklı eğitim.",
        departments: ["Turizm ve Otel İşletmeciliği", "Halkla İlişkiler"],
        type: "School",
        website: "https://cermikmyo.dicle.edu.tr",
        phone: "0 (412) 461 20 00",
        email: "cermikmyo@dicle.edu.tr",
        address: "Çermik, Diyarbakır"
    },
    {
        id: "v8",
        name: "Çüngüş Meslek Yüksekokulu",
        description: "Çüngüş ilçesinde eğitim faaliyetlerini sürdüren meslek yüksekokulumuz.",
        departments: ["Elektrik", "Çocuk Gelişimi"],
        type: "School",
        website: "https://cungusmyo.dicle.edu.tr",
        phone: "0 (412) 461 20 01",
        email: "cungusmyo@dicle.edu.tr",
        address: "Çüngüş, Diyarbakır"
    },
    {
        id: "v9",
        name: "Ergani Meslek Yüksekokulu",
        description: "Ergani ilçesinde bilgisayar ve muhasebe alanlarında eğitim veren okulumuz.",
        departments: ["Bilgisayar Programcılığı", "Muhasebe"],
        type: "School",
        website: "https://erganimyo.dicle.edu.tr",
        phone: "0 (412) 611 50 00",
        email: "erganimyo@dicle.edu.tr",
        address: "Ergani, Diyarbakır"
    },
    {
        id: "v10",
        name: "Kulp Meslek Yüksekokulu",
        description: "Kulp ilçesinde, yerel potansiyele uygun bölümlerle eğitim vermektedir.",
        departments: ["Mimari Restorasyon", "Çocuk Gelişimi"],
        type: "School",
        website: "https://kulpmyo.dicle.edu.tr",
        phone: "0 (412) 831 20 00",
        email: "kulpmyo@dicle.edu.tr",
        address: "Kulp, Diyarbakır"
    },
    {
        id: "v11",
        name: "Lice Meslek Yüksekokulu",
        description: "Lice ilçesinde eğitim veren meslek yüksekokulumuz.",
        departments: ["Elektronik Haberleşme", "Bankacılık"],
        type: "School",
        website: "https://licemyo.dicle.edu.tr",
        phone: "0 (412) 861 20 00",
        email: "licemyo@dicle.edu.tr",
        address: "Lice, Diyarbakır"
    },
    {
        id: "v12",
        name: "Silvan Meslek Yüksekokulu",
        description: "Silvan ilçesinde, çocuk gelişimi ve bilgisayar teknolojileri üzerine eğitim.",
        departments: ["Çocuk Gelişimi", "Bilgisayar Programcılığı"],
        type: "School",
        website: "https://silvanmyo.dicle.edu.tr",
        phone: "0 (412) 711 50 00",
        email: "silvanmyo@dicle.edu.tr",
        address: "Silvan, Diyarbakır"
    }
];
