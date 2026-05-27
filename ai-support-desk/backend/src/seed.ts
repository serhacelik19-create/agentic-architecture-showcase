import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("[Seed] Cleaning up old customers and conversations from DB...");
  await prisma.customer.deleteMany({});

  console.log("[Seed] Inserting exactly 3 customers into the database...");
  
  await prisma.customer.create({
    data: {
      name: "Mehmet Yılmaz",
      channel: "web",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Mehmet",
    }
  });

  await prisma.customer.create({
    data: {
      name: "Jane Smith",
      channel: "whatsapp",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Jane",
    }
  });

  await prisma.customer.create({
    data: {
      name: "Can Demir",
      channel: "whatsapp",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Can",
    }
  });

  console.log("[Seed] Database seeding successful!");
}

main()
  .catch((e) => {
    console.error("[Seed] Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
