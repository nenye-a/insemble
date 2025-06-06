import { PrismaClient } from '@prisma/client';

export type Root = object | undefined;

export type Context = {
  prisma: PrismaClient;
  tenantUserId: string;
  landlordUserId: string;
};
