
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
    const username = process.argv[2];
    const password = process.argv[3];

    if (!username || !password) {
        console.error('Kullanım: node scripts/create-admin.js <kullanici_adi> <sifre>');
        process.exit(1);
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role: 'ADMIN',
                name: 'Süper Admin'
            },
        });

        console.log(`✅ Admin oluşturuldu: ${user.username}`);
    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
