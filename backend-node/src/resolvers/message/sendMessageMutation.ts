import { mutationField, FieldResolver, stringArg, arg } from 'nexus';

import { Context } from 'serverTypes';

export let sendMessageResolver: FieldResolver<
  'Mutation',
  'sendMessage'
> = async (_, { conversationId, messageInput }, context: Context) => {
  let existingConversation = await context.prisma.conversation.findOne({
    where: { id: conversationId },
    include: {
      tenant: true,
      landlord: true,
    },
  });

  if (!existingConversation) {
    throw new Error('Cannot send message. Conversation not found!');
  }

  let { message, senderRole } = messageInput;

  let userSender = context.tenantUserId
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

  if (!userSender) {
    throw new Error('Not Authorized');
  }

  let convUserId =
    senderRole === 'TENANT'
      ? existingConversation.tenant.id
      : existingConversation.landlord.id;

  if (userSender.id !== convUserId) {
    throw new Error('Cannot send message. User not authorized!');
  }

  let createdMessage = await context.prisma.message.create({
    data: {
      message,
      sender: senderRole,
      conversation: { connect: { id: conversationId } },
    },
  });

  return createdMessage.id;
};

export let sendMessage = mutationField('sendMessage', {
  type: 'String',
  args: {
    conversationId: stringArg({ required: true }),
    messageInput: arg({ type: 'MessageInput', required: true }),
  },
  resolve: sendMessageResolver,
});
