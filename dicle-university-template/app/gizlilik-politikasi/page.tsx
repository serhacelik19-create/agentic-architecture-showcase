import { PageHeader } from "@/components/layout/PageLayout";

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <PageHeader
                title="Gizlilik Politikası"
                description="Kişisel verilerinizin güvenliği bizim için önemlidir."
            />

            <div className="container-custom py-12">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 prose dark:prose-invert max-w-none">
                    <h3>Giriş</h3>
                    <p>
                        Dicle Üniversitesi olarak, web sitemizi ziyaret eden kullanıcılarımızın gizliliğini korumayı taahhüt ediyoruz.
                        Bu Gizlilik Politikası, hangi verilerin toplandığını, nasıl kullanıldığını ve korunduğunu açıklar.
                    </p>

                    <h3>Toplanan Bilgiler</h3>
                    <p>
                        Web sitemizi ziyaret ettiğinizde, deneyiminizi iyileştirmek amacıyla aşağıdaki bilgiler otomatik olarak toplanabilir:
                    </p>
                    <ul>
                        <li>IP adresi ve tarayıcı bilgileri</li>
                        <li>Ziyaret edilen sayfalar ve süreleri</li>
                        <li>Cihaz bilgileri</li>
                    </ul>

                    <h3>Bilgilerin Kullanımı</h3>
                    <p>
                        Toplanan bilgiler, aşağıdaki amaçlarla kullanılabilir:
                    </p>
                    <ul>
                        <li>Web sitesi performansını analiz etmek ve iyileştirmek</li>
                        <li>Kullanıcı deneyimini kişiselleştirmek</li>
                        <li>Yasal yükümlülükleri yerine getirmek</li>
                    </ul>

                    <h3>Üçüncü Taraf Bağlantıları</h3>
                    <p>
                        Web sitemiz, diğer web sitelerine bağlantılar içerebilir. Bu sitelerin gizlilik uygulamalarından sorumlu değiliz.
                    </p>

                    <h3>İletişim</h3>
                    <p>
                        Gizlilik politikamızla ilgili sorularınız için bizimle iletişime geçebilirsiniz.
                    </p>
                </div>
            </div>
        </main>
    );
}
