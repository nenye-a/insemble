import { mutationField, FieldResolver, stringArg, intArg, arg } from 'nexus';

import { Context } from 'serverTypes';
import { sendMessageResolver } from './sendMessageMutation';

export let createConversationResolver: FieldResolver<
  'Mutation',
  'createConversation'
> = async (
  _,
  { brandId, propertyId, matchScore, messageInput, header },
  context: Context,
  info,
) => {
  let convId;
  let existingConversation = await context.prisma.conversation.findMany({
    where: {
      AND: [{ brand: { id: brandId } }, { property: { id: propertyId } }],
    },
  });
  if (existingConversation.length) {
    convId = existingConversation[0].id;
  } else {
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

    let userReceiver = context.tenantUserId
      ? await context.prisma.property
          .findOne({ where: { id: propertyId } })
          .landlordUser()
      : await context.prisma.brand
          .findOne({ where: { id: brandId } })
          .tenantUser();

    if (!userReceiver) {
      throw new Error('Receiver not found');
    }

    let createdConversation = context.tenantUserId
      ? await context.prisma.conversation.create({
          data: {
            brand: { connect: { id: brandId } },
            property: { connect: { id: propertyId } },
            landlord: { connect: { id: userReceiver.id } },
            tenant: { connect: { id: userSender.id } },
            matchScore,
            header,
          },
        })
      : await context.prisma.conversation.create({
          data: {
            brand: { connect: { id: brandId } },
            property: { connect: { id: propertyId } },
            landlord: { connect: { id: userSender.id } },
            tenant: { connect: { id: userReceiver.id } },
            matchScore,
            header,
          },
        });
    convId = createdConversation.id;
  }
  let messageCreated = await sendMessageResolver(
    _,
    { conversationId: convId, messageInput },
    context,
    info,
  );
  if (!messageCreated) {
    throw new Error('Cannot send message. User not authorized!');
  }
  return convId;
};

export let createConversation = mutationField('createConversation', {
  type: 'String',
  args: {
    brandId: stringArg({ required: true }),
    propertyId: stringArg({ required: true }),
    matchScore: intArg({ required: true }),
    messageInput: arg({ type: 'MessageInput', required: true }),
    header: stringArg({ required: true }),
  },
  resolve: createConversationResolver,
});
