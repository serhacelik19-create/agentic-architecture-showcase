
import { PrismaClient } from '@prisma/client'
import { ACADEMIC_UNITS, INSTITUTES, SCHOOLS, VOCATIONAL_SCHOOLS } from '../data/academic-data'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding academic units...')

    try {
        // 1. Faculties
        console.log(`Seeding ${ACADEMIC_UNITS.length} faculties...`)
        for (const unit of ACADEMIC_UNITS) {
            console.log(`- Seeding Faculty: ${unit.name} (${unit.id})`)
            await prisma.academicUnit.upsert({
                where: { slug: unit.id },
                update: {},
                create: {
                    name: unit.name,
                    type: 'FACULTY',
                    slug: unit.id,
                    description: unit.description,
                    leader: unit.dean,
                    phone: unit.phone,
                    email: unit.email,
                    address: unit.address,
                    website: unit.website,
                    departments: unit.departments.join(', '),
                },
            })
        }

        // 2. Institutes
        console.log(`Seeding ${INSTITUTES.length} institutes...`)
        for (const unit of INSTITUTES) {
            console.log(`- Seeding Institute: ${unit.name} (${unit.id})`)
            await prisma.academicUnit.upsert({
                where: { slug: unit.id },
                update: {},
                create: {
                    name: unit.name,
                    type: 'INSTITUTE',
                    slug: unit.id,
                    description: unit.description,
                    leader: unit.dean,
                    phone: unit.phone,
                    email: unit.email,
                    address: unit.address,
                    website: unit.website,
                    departments: unit.departments.join(', '),
                },
            })
        }

        // 3. Schools
        console.log(`Seeding ${SCHOOLS.length} schools...`)
        for (const unit of SCHOOLS) {
            console.log(`- Seeding School: ${unit.name} (${unit.id})`)
            await prisma.academicUnit.upsert({
                where: { slug: unit.id },
                update: {},
                create: {
                    name: unit.name,
                    type: 'SCHOOL',
                    slug: unit.id,
                    description: unit.description,
                    leader: unit.dean,
                    phone: unit.phone,
                    email: unit.email,
                    address: unit.address,
                    website: unit.website,
                    departments: unit.departments.join(', '),
                },
            })
        }

        // 4. Vocational Schools
        console.log(`Seeding ${VOCATIONAL_SCHOOLS.length} vocational schools...`)
        for (const unit of VOCATIONAL_SCHOOLS) {
            console.log(`- Seeding Vocational: ${unit.name} (${unit.id})`)
            await prisma.academicUnit.upsert({
                where: { slug: unit.id },
                update: {},
                create: {
                    name: unit.name,
                    type: 'VOCATIONAL',
                    slug: unit.id,
                    description: unit.description,
                    leader: unit.dean,
                    phone: unit.phone,
                    email: unit.email,
                    address: unit.address,
                    website: unit.website,
                    departments: unit.departments.join(', '),
                },
            })
        }
        console.log('Seeding finished successfully.')
    } catch (err) {
        console.error('ERROR DURING SEED:', err)
    }
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
