import { Request } from 'express';
import { Prisma } from '../generated/prisma-client';

export type Root = object | undefined;
export type Context = {
    request: Request;
    prisma: Prisma;
};
