
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const pages = await prisma.pageContent.findMany()
    console.log('--- DATABASE PAGE CONTENT ---')
    console.log('Total Pages:', pages.length)
    pages.forEach(p => {
        console.log(`- [${p.category}] ${p.title} (${p.slug})`)
    })
    console.log('----------------------------')
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect())
