
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Starting Super Seed...");

        // Polyclinics
        console.log("Checking Polyclinics...");
        if (!prisma.hospitalPolyclinic) {
            throw new Error("prisma.hospitalPolyclinic is UNDEFINED. Prisma Client not updated?");
        }

        console.log('Seeding hospital data...');

        const polyclinics = [
            { name: "Acil Tıp", icon: "Siren" },
            { name: "Algoloji", icon: "Activity" },
            { name: "Anesteziyoloji ve Reanimasyon", icon: "Syringe" },
            { name: "Beyin ve Sinir Cerrahisi", icon: "Brain" },
            { name: "Çocuk Cerrahisi", icon: "Baby" },
            { name: "Çocuk Endokrinolojisi", icon: "Baby" },
            { name: "Çocuk Enfeksiyon Hastalıkları", icon: "Bug" },
            { name: "Çocuk Gastroenteroloji", icon: "Baby" },
            { name: "Çocuk Hematolojisi ve Onkolojisi", icon: "Baby" },
            { name: "Çocuk İmmünolojisi ve Alerji", icon: "Baby" },
            { name: "Çocuk Kardiyolojisi", icon: "HeartPulse" },
            { name: "Çocuk Nefrolojisi", icon: "Baby" },
            { name: "Çocuk Nörolojisi", icon: "Brain" },
            { name: "Çocuk Romatolojisi", icon: "Baby" },
            { name: "Çocuk Sağlığı ve Hastalıkları", icon: "Baby" },
            { name: "Çocuk ve Ergen Ruh Sağlığı", icon: "Brain" },
            { name: "Dermatoloji", icon: "Sun" },
            { name: "Diş Hekimliği", icon: "Smile" },
            { name: "Endokrinoloji ve Metabolizma", icon: "Activity" },
            { name: "Enfeksiyon Hastalıkları", icon: "Bug" },
            { name: "Fiziksel Tıp ve Rehabilitasyon", icon: "Activity" },
            { name: "Gastroenteroloji", icon: "Activity" },
            { name: "Genel Cerrahi", icon: "Scalpel" },
            { name: "Geriatri", icon: "User" },
            { name: "Göğüs Cerrahisi", icon: "Wind" },
            { name: "Göğüs Hastalıkları", icon: "Wind" },
            { name: "Göz Hastalıkları", icon: "Eye" },
            { name: "Hematoloji", icon: "Droplets" },
            { name: "İç Hastalıkları (Dahiliye)", icon: "Stethoscope" },
            { name: "İmmünoloji ve Alerji", icon: "Activity" },
            { name: "Kadın Hastalıkları ve Doğum", icon: "Baby" },
            { name: "Kalp ve Damar Cerrahisi", icon: "HeartPulse" },
            { name: "Kardiyoloji", icon: "HeartPulse" },
            { name: "Kulak Burun Boğaz", icon: "Ear" },
            { name: "Nefroloji", icon: "Activity" },
            { name: "Neonatoloji", icon: "Baby" },
            { name: "Nöroloji", icon: "Brain" },
            { name: "Nükleer Tıp", icon: "Atom" },
            { name: "Ortopedi ve Travmatoloji", icon: "Bone" },
            { name: "Perinatoloji", icon: "Baby" },
            { name: "Plastik, Rekonstrüktif ve Estetik Cerrahi", icon: "Scissors" },
            { name: "Radyasyon Onkolojisi", icon: "Zap" },
            { name: "Radyoloji", icon: "Scan" },
            { name: "Romatoloji", icon: "Activity" },
            { name: "Ruh Sağlığı ve Hastalıkları (Psikiyatri)", icon: "BrainCircuit" },
            { name: "Spor Hekimliği", icon: "Activity" },
            { name: "Sualtı Hekimliği ve Hiperbarik Tıp", icon: "Waves" },
            { name: "Tıbbi Genetik", icon: "Dna" },
            { name: "Tıbbi Onkoloji", icon: "Activity" },
            { name: "Tıbbi Patoloji", icon: "Microscope" },
            { name: "Üroloji", icon: "Activity" }
        ];


        for (const poly of polyclinics) {
            const exists = await prisma.hospitalPolyclinic.findFirst({
                where: { name: poly.name }
            });

            if (exists) {
                await prisma.hospitalPolyclinic.update({
                    where: { id: exists.id },
                    data: { icon: poly.icon }
                });
                console.log(`Updated icon for: ${poly.name}`);
            } else {
                await prisma.hospitalPolyclinic.create({
                    data: {
                        name: poly.name,
                        icon: poly.icon,
                        active: true
                    }
                });
                console.log(`Created: ${poly.name}`);
            }
        }

        // Announcements
        console.log("Checking Announcements...");
        const annCount = await prisma.hospitalAnnouncement.count();
        console.log(`Current Announcements: ${annCount}`);

        if (annCount < 2) {
            await prisma.hospitalAnnouncement.createMany({
                data: [
                    { title: "Ziyaret Saatleri Düzenlemesi", content: "Hastanemiz ziyaret saatleri 12:30-13:30 ve 18:30-19:30 olarak güncellenmiştir.", active: true, date: new Date() },
                    { title: "MHRS Randevu Sistemi", content: "Muayene randevularınızı MHRS üzerinden veya 182 numaralı hattan alabilirsiniz.", active: true, date: new Date() },
                ]
            });
            console.log("Added announcements.");
        }

        fs.writeFileSync('seed-result.txt', 'SUCCESS: Data populated.');
        console.log("Super Seed Complete.");

    } catch (e) {
        console.error(e);
        const keys = Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$'));
        fs.writeFileSync('seed-result.txt', `ERROR: ${e.message} \nAvailable Models: ${keys.join(', ')}`);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
