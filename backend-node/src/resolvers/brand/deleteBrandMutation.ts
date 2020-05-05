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
    include: {
      tenantUser: true,
    },
  });
  if (!brand) {
    throw new Error('Brand not found!');
  }
  if (brand.tenantUser?.id !== context.tenantUserId) {
    throw new Error('User not authorized to delete');
  }
  await context.prisma.location.deleteMany({
    where: { brand: { id: brandId } },
  });
  await context.prisma.conversation.deleteMany({
    where: { brand: { id: brandId } },
  });
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
