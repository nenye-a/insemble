import { prisma } from '../../src/prisma';

async function copyPropertySpaceAdjustment() {
  let properties = await prisma.property.findMany({ include: { space: true } });
  for (let property of properties) {
    await prisma.property.update({
      data: {
        space: {
          updateMany: {
            where: { id: { not: '0' } },
            data: {
              marketingPreference: property.marketingPreference,
              spaceType: { set: property.propertyType },
            },
          },
        },
      },
      where: {
        id: property.id,
      },
    });
  }
  // eslint-disable-next-line no-console
  console.log('finished');
}

copyPropertySpaceAdjustment().then(() => {
  process.exit(0);
});
