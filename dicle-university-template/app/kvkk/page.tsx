import { PageHeader } from "@/components/layout/PageLayout";

export default function KVKKPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <PageHeader
                title="KVKK Aydınlatma Metni"
                description="Kişisel Verilerin Korunması Kanunu kapsamında bilgilendirme."
            />

            <div className="container-custom py-12">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 prose dark:prose-invert max-w-none">
                    <h3>Veri Sorumlusu</h3>
                    <p>
                        6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, Dicle Üniversitesi olarak, veri sorumlusu sıfatıyla kişisel verilerinizi işlemekteyiz.
                    </p>

                    <h3>Kişisel Verilerin İşlenme Amacı</h3>
                    <p>
                        Kişisel verileriniz, üniversitemiz tarafından sunulan eğitim, öğretim ve kamu hizmetlerinin yerine getirilmesi amacıyla işlenmektedir.
                    </p>

                    <h3>Veri Sahibinin Hakları</h3>
                    <p>
                        KVKK'nın 11. maddesi uyarınca, veri sahibi olarak aşağıdaki haklara sahipsiniz:
                    </p>
                    <ul>
                        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                        <li>İşlenmişse buna ilişkin bilgi talep etme</li>
                        <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                        <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
                        <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
