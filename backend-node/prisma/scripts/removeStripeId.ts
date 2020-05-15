import { prisma } from '../../src/prisma';

async function removeStripeId() {
  let tenantUser = await prisma.tenantUser.findMany();
  let landlordUser = await prisma.landlordUser.findMany();
  for (let tUser of tenantUser) {
    await prisma.tenantUser.update({
      data: {
        stripeCustomerId: null,
        stripeSubscriptionId: null,
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
        stripeCustomerId: null,
      },
      where: {
        id: lUser.id,
      },
    });
    await prisma.space.updateMany({
      where: { property: { landlordUser: { id: lUser.id } } },
      data: {
        stripeSubscriptionId: null,
        tier: 'PROFESSIONAL',
      },
    });
  }
  // eslint-disable-next-line no-console
  console.log('finished');
}

removeStripeId().then(() => {
  process.exit(0);
});
