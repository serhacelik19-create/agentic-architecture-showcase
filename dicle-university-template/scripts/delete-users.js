
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const deleted = await prisma.user.deleteMany({});
        console.log(`✅ ${deleted.count} kullanıcı başarıyla silindi.`);
    } catch (error) {
        console.error('❌ Silme işlemi başarısız:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
