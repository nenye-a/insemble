import { prisma } from '../prisma';
import getRandomBytes from './getRandomBytes';
import { TenantUser, LandlordUser } from '@prisma/client';

export async function authSession(authToken: string | undefined) {
  let [sessionID, sessionToken, base64Type] = authToken
    ? authToken.split(':')
    : [];
  let type = base64Type ? Buffer.from(base64Type, 'base64').toString() : null;
  if (
    !sessionID ||
    !sessionToken ||
    (type !== 'TENANT' && type !== 'LANDLORD')
  ) {
    return null;
  }
  let user =
    type === 'TENANT'
      ? await prisma.tenantSession
          .findOne({
            where: { id: sessionID },
          })
          .user()
      : await prisma.landlordSession
          .findOne({
            where: { id: sessionID },
          })
          .user();
  if (!user) {
    return null;
  }
  return {
    tenantUserId: type === 'TENANT' ? user.id : null,
    landlordUserId: type === 'LANDLORD' ? user.id : null,
  };
}

export async function createSession(
  user: TenantUser | LandlordUser,
  type: 'TENANT' | 'LANDLORD',
) {
  let bytes = await getRandomBytes(18);
  let sessionData = {
    data: {
      token: bytes.toString('base64'),
      user: { connect: { id: user.id } },
    },
  };
  let session =
    type === 'TENANT'
      ? await prisma.tenantSession.create(sessionData)
      : await prisma.landlordSession.create(sessionData);
  return (
    session.id +
    ':' +
    session.token +
    ':' +
    Buffer.from(type).toString('base64')
  );
}
