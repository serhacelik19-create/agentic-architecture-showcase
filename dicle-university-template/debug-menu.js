
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const menus = await prisma.foodMenu.findMany();
    console.log("All Food Menus:");
    menus.forEach(menu => {
        console.log(`ID: ${menu.id}, Date: ${menu.date.toISOString()}, Local: ${menu.date.toLocaleString()}`);
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    console.log("\nQuery Range (Server Local Time):");
    console.log(`Start: ${todayStart.toISOString()} (${todayStart.toLocaleString()})`);
    console.log(`End:   ${todayEnd.toISOString()} (${todayEnd.toLocaleString()})`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
