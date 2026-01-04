


import { PrismaClient } from '@prisma/client';



let prismaInstance: PrismaClient | null = null;

export  function getPrismaInstance(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient();
    console.log(' Connexion Prisma créée');
  }

  return prismaInstance;
}

// async function disconnectPrisma() {
//   if (prismaInstance) {
//     await prismaInstance.$disconnect();
//     console.log('🔌 Prisma déconnecté');
//   }
// }

// process.on('beforeExit', async () => {
//   await disconnectPrisma();
// });


