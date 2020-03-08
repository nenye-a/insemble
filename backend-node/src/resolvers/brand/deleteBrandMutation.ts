import { FieldResolver, stringArg, mutationField } from 'nexus';

import { Root, Context } from 'serverTypes';

let deleteBrandResolver: FieldResolver<'Mutation', 'deleteBrand'> = async (
  _: Root,
  { brandId },
  context: Context,
) => {
  let brand = await context.prisma.brand.findOne({
    where: {
      id: brandId,
    },
  });
  if (!brand) {
    throw new Error('Brand not found!');
  }
  await context.prisma.brand.delete({
    where: {
      id: brandId,
    },
  });
  return 'success';
};

let deleteBrand = mutationField('deleteBrand', {
  type: 'String',
  resolve: deleteBrandResolver,
  args: { brandId: stringArg({ required: true }) },
});

export { deleteBrand };
