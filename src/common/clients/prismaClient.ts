import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

export function getPrismaClient() {
  return prismaClient;
}

export async function connectToPrisma(prismaClient: PrismaClient) {
  await prismaClient.$connect();
}

export async function disconnectFromPrisma(prismaClient: PrismaClient) {
  await prismaClient.$disconnect();
}
