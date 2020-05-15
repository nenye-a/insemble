import { prisma } from '../../src/prisma';

async function deleteOlderBrand() {
  let brands = await prisma.brand.findMany({
    where: { createdAt: { lte: new Date('2020-05-08T20:00:00+0700') } },
  });

  for (let brand of brands) {
    await prisma.location.deleteMany({
      where: { brand: { id: brand.id } },
    });
    await prisma.conversation.deleteMany({
      where: { brand: { id: brand.id } },
    });
    await prisma.brand.delete({
      where: {
        id: brand.id,
      },
    });
  }
  // eslint-disable-next-line no-console
  console.log(
    'deleted brand:',
    brands.map(({ name }) => name),
  );
  // eslint-disable-next-line no-console
  console.log('finished');
}

deleteOlderBrand().then(() => {
  process.exit(0);
});
