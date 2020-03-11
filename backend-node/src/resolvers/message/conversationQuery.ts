import { queryField, FieldResolver, stringArg } from 'nexus';

import { Root, Context } from 'serverTypes';

let conversationResolver: FieldResolver<'Query', 'conversation'> = async (
  _: Root,
  { conversationId },
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

  let conversation = await context.prisma.conversation.findOne({
    where: { id: conversationId },
    include: {
      brand: true,
      landlord: true,
      messages: true,
      property: true,
      tenant: true,
    },
  });
  if (!conversation) {
    throw Error("Conversation doesn't exist");
  }

  let userConversation = context.tenantUserId
    ? conversation.tenant
    : conversation.landlord;

  if (user.id !== userConversation.id) {
    throw Error('Cannot get conversation from other user!');
  }

  return conversation;
};

let conversation = queryField('conversation', {
  type: 'Conversation',
  resolve: conversationResolver,
  args: {
    conversationId: stringArg({ required: true }),
  },
});

export { conversation };
