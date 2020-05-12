import { queryField, FieldResolver, stringArg } from 'nexus';

import { Root, Context } from 'serverTypes';

let propertyResolver: FieldResolver<'Query', 'property'> = async (
  _: Root,
  { propertyId },
  context: Context,
) => {
  let property = await context.prisma.property.findOne({
    where: {
      id: propertyId,
    },
    include: { location: true },
  });
  if (!property) {
    throw new Error('Property not found!');
  }

  return property;
};

let property = queryField('property', {
  type: 'Property',
  resolve: propertyResolver,
  args: { propertyId: stringArg({ required: true }) },
});

export { property };
