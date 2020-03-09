import { Context } from 'serverTypes';

export default function getUserDetails({
  tenantUserId,
  landlordUserId,
  prisma,
}: Context) {
  if (tenantUserId) {
    return prisma.tenantUser.findOne({
      where: {
        id: tenantUserId,
      },
    });
  }
  if (landlordUserId) {
    return prisma.landlordUser.findOne({
      where: {
        id: landlordUserId,
      },
    });
  }
  return null;
}
