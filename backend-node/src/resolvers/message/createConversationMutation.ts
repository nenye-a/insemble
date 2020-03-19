import { mutationField, FieldResolver, stringArg, floatArg, arg } from 'nexus';

import { Context } from 'serverTypes';
import { sendMessageResolver } from './sendMessageMutation';

export let createConversationResolver: FieldResolver<
  'Mutation',
  'createConversation'
> = async (
  _,
  { brandId, spaceId, matchScore, messageInput, header },
  context: Context,
  info,
) => {
  let convId;
  let existingConversation = await context.prisma.conversation.findMany({
    where: {
      OR: [
        { AND: [{ brand: { id: brandId } }, { space: { spaceId } }] },
        {
          AND: [{ brand: { tenantId: brandId } }, { space: { id: spaceId } }],
        },
      ], // Q: brandId is tenantId right?
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

    let spaceOrBrand = context.tenantUserId
      ? await context.prisma.space.findOne({
          where: { spaceId },
          include: { property: { include: { landlordUser: true } } },
        })
      : await context.prisma.brand.findOne({
          where: { tenantId: brandId },
          include: { tenantUser: true },
        });
    if (!spaceOrBrand) {
      throw new Error('Receiver not found');
    }
    let userReceiver;
    let linkedPropertyId;
    if ('tenantUser' in spaceOrBrand) {
      if (!spaceOrBrand.tenantUser) {
        throw new Error('Tenant not found'); // Note: Brand can have tenant undefinded
      }
      let spaceSender = await context.prisma.space.findOne({
        where: { id: spaceId },
        include: { property: { include: { landlordUser: true } } },
      });
      if (!spaceSender) {
        throw new Error('Space not found or deleted');
      }
      if (!spaceSender.property) {
        throw new Error('Property not found or deleted');
      }
      if (spaceSender.property.landlordUser.id !== context.landlordUserId) {
        throw new Error('This is not your property');
      }
      userReceiver = spaceOrBrand.tenantUser;
      let linkedProperty = await context.prisma.space
        .findOne({
          where: { id: spaceId },
        })
        .property();
      if (!linkedProperty) {
        throw new Error('Property not found or deleted');
      }
      linkedPropertyId = linkedProperty.id;
    } else {
      let brandSender = await context.prisma.brand.findOne({
        where: { id: brandId },
        include: { tenantUser: true },
      });

      if (!brandSender) {
        throw new Error('Brand not found or deleted');
      }
      if (!brandSender.tenantUser) {
        throw new Error('Tenant not found'); // Note: Brand can have tenant undefinded
      }
      if (brandSender.tenantUser.id !== context.tenantUserId) {
        throw new Error('This is not your property');
      }
      if (!spaceOrBrand.property) {
        throw new Error('Property not found or deleted');
      }
      userReceiver = spaceOrBrand.property.landlordUser;
      linkedPropertyId = spaceOrBrand.property.id;
    }

    let createdConversation = context.tenantUserId
      ? await context.prisma.conversation.create({
          data: {
            brand: { connect: { id: brandId } },
            property: { connect: { id: linkedPropertyId } },
            landlord: { connect: { id: userReceiver.id } },
            tenant: { connect: { id: userSender.id } },
            space: { connect: { id: spaceOrBrand.id } },
            matchScore,
            header,
          },
        })
      : await context.prisma.conversation.create({
          data: {
            brand: { connect: { id: spaceOrBrand.id } },
            property: { connect: { id: linkedPropertyId } },
            landlord: { connect: { id: userSender.id } },
            tenant: { connect: { id: userReceiver.id } },
            space: { connect: { id: spaceId } },
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
    spaceId: stringArg({ required: true }),
    matchScore: floatArg({ required: true }),
    messageInput: arg({ type: 'MessageInput', required: true }),
    header: stringArg({ required: true }),
  },
  resolve: createConversationResolver,
});
