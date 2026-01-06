import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@school.com' },
        update: {},
        create: {
            email: 'admin@school.com',
            firstname: 'Admin',
            lastname: 'User',
            password: hashedPassword,
            role: Role.ADMIN,
        },
    });

    const teacher = await prisma.user.upsert({
        where: { email: 'teacher@school.com' },
        update: {},
        create: {
            email: 'teacher@school.com',
            firstname: 'Teacher',
            lastname: 'User',
            password: hashedPassword,
            role: Role.TEACHER,
        },
    });

    const student = await prisma.user.upsert({
        where: { email: 'student@school.com' },
        update: {},
        create: {
            email: 'student@school.com',
            firstname: 'Student',
            lastname: 'User',
            password: hashedPassword,
            role: Role.STUDENT,
        },
    });

    const parent = await prisma.user.upsert({
        where: { email: 'parent@school.com' },
        update: {},
        create: {
            email: 'parent@school.com',
            firstname: 'Parent',
            lastname: 'User',
            password: hashedPassword,
            role: Role.PARENT,
        },
    });

    console.log({ admin, teacher, student, parent });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
