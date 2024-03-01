import { hash } from 'argon2';
import { PrismaClient, Role } from './generated/client';
const prisma = new PrismaClient();
async function main() {
  const passwd = await hash('qwerty123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dbuser.seed' },
    update: {},
    create: {
      email: 'admin@dbuser.seed',
      hashPassword: passwd,
    },
  });

  await prisma.userRole.create({
    data: {
      userId: admin.id,
      role: Role.ADMIN,
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    process.exit(1);
  });
