import { prisma } from '../../src/prisma';

async function createdAtUserNow() {
  let tenantUser = await prisma.tenantUser.findMany();
  let landlordUser = await prisma.landlordUser.findMany();
  for (let tUser of tenantUser) {
    await prisma.tenantUser.update({
      data: {
        createdAt: new Date(),
        tier: 'PROFESSIONAL',
      },
      where: {
        id: tUser.id,
      },
    });
  }
  for (let lUser of landlordUser) {
    await prisma.landlordUser.update({
      data: {
        createdAt: new Date(),
      },
      where: {
        id: lUser.id,
      },
    });
    await prisma.space.updateMany({
      where: { property: { landlordUser: { id: lUser.id } } },
      data: {
        tier: 'PROFESSIONAL',
      },
    });
  }
  // eslint-disable-next-line no-console
  console.log('finished');
}

createdAtUserNow().then(() => {
  process.exit(0);
});
