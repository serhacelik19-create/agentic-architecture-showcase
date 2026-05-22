
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const staff = [
    { name: "Prof. Dr. Kamuran Eronat", title: "Rektör", department: "Rektörlük", phone: "0 (412) 241 10 10", email: "ozelkalem@dicle.edu.tr", order: 1 },
    { name: "Prof. Dr. Ayhan Yılmaz", title: "Rektör Yardımcısı", department: "Rektörlük", phone: "0 (412) 241 10 11", email: "ayhan.yilmaz@dicle.edu.tr", order: 2 },
    { name: "Prof. Dr. Mehmet Aslan", title: "Rektör Yardımcısı", department: "Rektörlük", phone: "0 (412) 241 10 12", email: "mehmet.aslan@dicle.edu.tr", order: 3 },
    { name: "Ali Yılmaz", title: "Genel Sekreter V.", department: "Genel Sekreterlik", phone: "0 (412) 241 10 15", email: "gsek@dicle.edu.tr", order: 4 },
    { name: "Sıddık Teksin", title: "Daire Başkanı", department: "Bilgi İşlem Daire Başkanlığı", phone: "0 (412) 241 10 40", email: "bidb@dicle.edu.tr", order: 5 },
    { name: "Ahmet Demir", title: "Şube Müdürü", department: "Öğrenci İşleri Daire Başkanlığı", phone: "0 (412) 241 10 20", email: "oidb@dicle.edu.tr", order: 6 },
    { name: "Zeynep Kaya", title: "Kütüphane Daire Başkanı", department: "Kütüphane", phone: "0 (412) 241 10 30", email: "kutuphane@dicle.edu.tr", order: 7 },
    { name: "Mehmet Çelik", title: "Personel Daire Başkanı", department: "Personel Daire Başkanlığı", phone: "0 (412) 241 10 25", email: "pdb@dicle.edu.tr", order: 8 },
    { name: "Dr. Öğr. Üyesi Ali Vural", title: "Başhekim", department: "Hastaneler Başhekimliği", phone: "0 (412) 248 80 01", email: "bashekimlik@dicle.edu.tr", order: 9 },
    { name: "Fatma Yılmaz", title: "Hemşire", department: "Hastaneler Başhekimliği", phone: "0 (412) 248 80 05", email: "hemsire@dicle.edu.tr", order: 10 },
];

async function main() {
    console.log("Seeding Staff Directory...");

    // Clear existing
    await prisma.staffMember.deleteMany();

    for (const item of staff) {
        await prisma.staffMember.create({
            data: item
        });
    }

    console.log(`Seeded ${staff.length} staff members.`);
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
