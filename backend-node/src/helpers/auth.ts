import { prisma } from '../prisma';
import getRandomBytes from './getRandomBytes';
import { TenantUser } from '@prisma/client';

export async function authTenantSession(authToken: string | undefined) {
  let [sessionID, sessionToken] = authToken ? authToken.split(':') : [];
  if (!sessionID || !sessionToken) {
    return null;
  }
  let user = await prisma.tenantSession
    .findOne({
      where: { id: sessionID },
    })
    .user();
  return (user && user.id) || null;
}

export async function createTenantSession(user: TenantUser) {
  let bytes = await getRandomBytes(18);
  let session = await prisma.tenantSession.create({
    data: {
      token: bytes.toString('base64'),
      user: { connect: { id: user.id } },
    },
  });
  return session.id + ':' + session.token;
}
