import { queryField, FieldResolver } from 'nexus';

import { Root, Context } from 'serverTypes';

let conversationsResolver: FieldResolver<'Query', 'conversations'> = async (
  _: Root,
  _args,
  context: Context,
) => {
  let user = context.tenantUserId
    ? await context.prisma.tenantUser.findOne({
        where: {
          id: context.tenantUserId,
        },
      })
    : context.landlordUserId
    ? await context.prisma.landlordUser.findOne({
        where: {
          id: context.landlordUserId,
        },
      })
    : null;

  if (!user) {
    throw new Error('Not Authorized');
  }

  let conversations = context.tenantUserId
    ? await context.prisma.conversation.findMany({
        where: { tenant: { id: user.id } },
        include: {
          brand: true,
          landlord: true,
          messages: true,
          property: true,
          tenant: true,
        },
      })
    : context.landlordUserId
    ? await context.prisma.conversation.findMany({
        where: { landlord: { id: user.id } },
        include: {
          brand: true,
          landlord: true,
          messages: true,
          property: true,
          tenant: true,
        },
      })
    : [];

  return conversations;
};

let conversations = queryField('conversations', {
  type: 'Conversation',
  resolve: conversationsResolver,
  list: true,
});

export { conversations };
