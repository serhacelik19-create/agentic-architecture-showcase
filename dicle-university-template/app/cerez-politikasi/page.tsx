import { PageHeader } from "@/components/layout/PageLayout";

export default function CookiePolicyPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <PageHeader
                title="Çerez Politikası"
                description="Web sitemizde kullanılan çerezler hakkında bilgilendirme."
            />

            <div className="container-custom py-12">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 prose dark:prose-invert max-w-none">
                    <h3>Çerez Nedir?</h3>
                    <p>
                        Çerezler (cookies), web sitemizi ziyaret ettiğinizde tarayıcınız tarafından cihazınıza kaydedilen küçük metin dosyalarıdır.
                    </p>

                    <h3>Kullanılan Çerez Türleri</h3>
                    <ul>
                        <li>
                            <strong>Zorunlu Çerezler:</strong> Web sitesinin düzgün çalışması için gereklidir.
                        </li>
                        <li>
                            <strong>Analitik Çerezler:</strong> Ziyaretçi sayısını ve trafiğini analiz etmemize yardımcı olur.
                        </li>
                        <li>
                            <strong>İşlevsel Çerezler:</strong> Tercihlerinizi hatırlayarak kullanım kolaylığı sağlar.
                        </li>
                    </ul>

                    <h3>Çerez Yönetimi</h3>
                    <p>
                        Tarayıcı ayarlarınızı değiştirerek çerezleri reddedebilir veya silebilirsiniz. Ancak, bu durumda web sitemizin bazı özellikleri düzgün çalışmayabilir.
                    </p>
                </div>
            </div>
        </main>
    );
}
