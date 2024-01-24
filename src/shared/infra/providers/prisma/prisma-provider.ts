import { PrismaClient } from '@prisma/client';

const PrismaProvider = new PrismaClient();

async () => {
  try {
    await PrismaProvider.$connect();
  } catch {
    throw new Error(`Não foi possível conectar 
    ao client do Prisma ORM`);
  }
};

export { PrismaProvider };
