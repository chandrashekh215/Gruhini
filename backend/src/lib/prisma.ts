import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export function serializeData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}
