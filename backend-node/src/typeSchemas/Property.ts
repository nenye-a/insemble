import { objectType } from 'nexus';
import { prisma } from '../prisma';

export let Property = objectType({
  name: 'Property',
  definition(t) {
    t.model.id();
    t.model.businessType();
    t.model.propertyId();
    t.model.exclusive();
    t.model.location();
    t.model.name();
    t.model.userRelations();
    t.field('space', {
      type: 'Space',
      resolve: async (property) => {
        let space = await prisma.space.findMany({
          where: { property: { id: property.id } },
          orderBy: { createdAt: 'asc' },
        });
        return space;
      },
      list: true,
    });
  },
});
