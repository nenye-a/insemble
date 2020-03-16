import { prisma } from '../../src/prisma';

async function copyUserRelationToUserRelations() {
  let properties = await prisma.property.findMany();
  for (let property of properties) {
    await prisma.property.update({
      data: {
        userRelations: {
          set: property.userRelation,
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

copyUserRelationToUserRelations().then(() => {
  process.exit(0);
});
