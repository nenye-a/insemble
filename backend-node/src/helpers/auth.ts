import { prisma } from '../main';
import getRandomBytes from './getRandomBytes';
import { TenantUser } from '@prisma/client';

export async function authTenantSession(authToken: string | undefined) {
  let [sessionID, sessionToken] = authToken ? authToken.split(':') : [];
  if (!sessionID || !sessionToken) {
    return null;
  }
  let session = await prisma.tenantSession.findOne({
    where: { id: sessionID },
  });
  return session && session.token === sessionToken ? session : null;
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
