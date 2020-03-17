import { queryField, FieldResolver } from 'nexus';

import { Root, Context } from 'serverTypes';

let propertiesResolver: FieldResolver<'Query', 'properties'> = async (
  _: Root,
  _args,
  context: Context,
) => {
  let properties = await context.prisma.property.findMany({
    orderBy: { id: 'desc' },
    include: {
      space: true,
    },
    where: {
      landlordUser: {
        id: context.landlordUserId,
      },
    },
  });

  return properties.map((property) => {
    let { space, ...restProperty } = property;
    let stringDateSpace = space.map((sp) => {
      let { available, ...restSpace } = sp;
      return { ...restSpace, available: available.toString() };
    });
    return { ...restProperty, space: stringDateSpace };
  });
};

let properties = queryField('properties', {
  type: 'PropertyThumbnail',
  resolve: propertiesResolver,
  list: true,
});

export { properties };
