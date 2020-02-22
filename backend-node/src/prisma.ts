import { PrismaClient } from '@prisma/client';


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

export let prisma = new PrismaClient();
