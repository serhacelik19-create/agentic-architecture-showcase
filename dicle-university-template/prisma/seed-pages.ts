
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding corporate pages...')

    const pages = [
        // KURUMSAL
        {
            slug: 'hakkimizda',
            title: 'Hakkımızda',
            category: 'KURUMSAL',
            content: `
            <h2>Üniversitemiz Hakkında</h2>
            <p>Dicle Üniversitesi, Diyarbakır'ın köklü eğitim kurumlarından biri olarak 1974 yılından bu yana hizmet vermektedir.</p>
            <p>Geniş kampüs alanı ve nitelikli akademik kadrosuyla bölgenin parlayan yıldızıdır.</p>
        `
        },
        {
            slug: 'misyon-vizyon',
            title: 'Misyon & Vizyon',
            category: 'KURUMSAL',
            content: `
            <h2>Misyonumuz</h2>
            <p>Bilgi üreten, topluma hizmet eden ve dünya standartlarında eğitim veren bir kurum olmak.</p>
            <h2>Vizyonumuz</h2>
            <p>Geleceği aydınlatan, yenilikçi ve öncü bir üniversite olmak.</p>
        `
        },
        {
            slug: 'tarihce',
            title: 'Tarihçe',
            category: 'KURUMSAL',
            content: `
            <div class="space-y-6">
                <p class="text-lg leading-relaxed">
                    Dicle Üniversitesi'nin temelleri, 1966 yılında Ankara Üniversitesi'ne bağlı olarak açılan Diyarbakır Tıp Fakültesi ile atılmıştır. 1973 yılında Fen Bilimleri Fakültesi'nin de kurulmasıyla birlikte, 1974 yılında iki fakülte "Diyarbakır Üniversitesi" adı altında birleşerek bağımsız bir üniversite haline gelmiştir.
                </p>
                <div class="relative border-l-4 border-blue-200 pl-8 space-y-8 py-4">
                    <div>
                        <h3 class="text-xl font-bold mb-1">1966</h3>
                        <p>Ankara Üniversitesi'ne bağlı Diyarbakır Tıp Fakültesi kuruldu.</p>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold mb-1">1973</h3>
                        <p>Fen Bilimleri Fakültesi kuruldu ve kuruluş tamamlandı.</p>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold mb-1">1974</h3>
                        <p>"Diyarbakır Üniversitesi" adıyla resmen faaliyete geçti.</p>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold mb-1">1982</h3>
                        <p>Üniversitenin adı "Dicle Üniversitesi" olarak değiştirildi.</p>
                    </div>
                </div>
            </div>
        `
        },
        {
            slug: 'yonetim',
            title: 'Yönetim',
            category: 'KURUMSAL',
            content: `
            <div class="text-center space-y-12">
                <div class="max-w-2xl mx-auto p-8 border rounded-2xl shadow-sm bg-slate-50">
                    <h3 class="text-3xl font-bold mb-2">Prof. Dr. Kamuran Eronat</h3>
                    <p class="text-blue-600 font-medium text-lg">Dicle Üniversitesi Rektörü</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="p-6 border rounded-xl bg-white shadow-sm">
                        <h4 class="font-bold text-xl mb-2">Prof. Dr. Aytaç Coşkun</h4>
                        <p class="text-slate-500">Rektör Yardımcısı</p>
                    </div>
                    <div class="p-6 border rounded-xl bg-white shadow-sm">
                        <h4 class="font-bold text-xl mb-2">Prof. Dr. Mehmet Siraç Özerdem</h4>
                        <p class="text-slate-500">Rektör Yardımcısı</p>
                    </div>
                    <div class="p-6 border rounded-xl bg-white shadow-sm">
                        <h4 class="font-bold text-xl mb-2">Prof. Dr. Velat Şen</h4>
                        <p class="text-slate-500">Rektör Yardımcısı</p>
                    </div>
                </div>
            </div>
        `
        },
        // BILGI MERKEZI
        {
            slug: 'mevzuat',
            title: 'Yönetmelik ve Mevzuat',
            category: 'BILGI',
            content: `
            <h2>Yönetmelikler</h2>
            <p>Üniversitemizin bağlı olduğu yasal mevzuat ve iç yönetmeliklere buradan ulaşabilirsiniz.</p>
        `
        },
        {
            slug: 'basin-merkezi',
            title: 'Basın Merkezi',
            category: 'BILGI',
            content: `
            <h2>Basın Bültenleri</h2>
            <p>En güncel haberlerimiz ve basın açıklamalarımız için bu sayfayı takip edebilirsiniz.</p>
        `
        },
        // HIZMETLER
        {
            slug: 'itfaiye',
            title: 'İtfaiye Hizmetleri',
            category: 'HIZMET',
            content: `
            <h2>Güvenliğiniz İçin Görevdeyiz</h2>
            <p>Üniversite içi itfaiye ve acil durum hizmetleri hakkında bilgiler.</p>
        `
        },
    ]

    for (const page of pages) {
        await prisma.pageContent.upsert({
            where: { slug: page.slug },
            update: {
                title: page.title,
                category: page.category,
                content: page.content,
            },
            create: {
                slug: page.slug,
                title: page.title,
                category: page.category,
                content: page.content,
            },
        })
        console.log(`- Seeded page: ${page.title}`)
    }

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
