import { mutationField, FieldResolver, stringArg } from 'nexus';
import bcrypt from 'bcrypt';

import { Context } from 'serverTypes';
import { createSession } from '../../helpers/auth';
import { PendingDataType } from 'dataTypes';

export let registerTenantInvitationResolver: FieldResolver<
  'Mutation',
  'registerTenantInvitation'
> = async (_, { password, invitationCode }, context: Context) => {
  let pendConvId = Base64.decode(invitationCode);
  let pendingConversation = await context.prisma.pendingConversation.findOne({
    where: {
      id: pendConvId,
    },
  });
  if (!pendingConversation) {
    throw new Error('Invalid verification code');
  }
  if (pendingConversation.senderRole !== 'LANDLORD') {
    throw new Error('Invalid role');
  }

  // TODO: Auto complete user data
  let cryptPassword = bcrypt.hashSync(password, 10);
  let lowerCasedEmail = pendingConversation.receiverEmail.toLocaleLowerCase();

  let exist = await context.prisma.tenantUser.findOne({
    where: {
      email: lowerCasedEmail,
    },
  });
  if (exist) {
    throw new Error('user already exist');
  }

  let tenantUser = await context.prisma.tenantUser.create({
    data: {
      email: lowerCasedEmail,
      firstName: 'Dummy',
      lastName: 'Tenant',
      password: cryptPassword,
      tier: 'FREE',
      company: 'Dummy Fried Chicken',
    },
  });

  // TODO: Auto complete brand Data
  let newBrand = await context.prisma.brand.create({
    data: {
      name: 'Dummy brand',
      tenantId: pendingConversation.brandId,
      location: {
        create: { address: 'Dummy', lat: '1', lng: '1' },
      },
      userRelation: 'Owner',
      tenantUser: {
        connect: {
          id: tenantUser.id,
        },
      },
    },
  });
  if (!newBrand) {
    throw new Error('Brand failed to be created');
  }

  let { brandId, pendingConversationData, propertyId } = pendingConversation;
  let { header, matchScore, messageInput }: PendingDataType = JSON.parse(
    pendingConversationData,
  );

  let convId;
  let existingConversation = await context.prisma.conversation.findMany({
    where: {
      AND: [{ brand: { tenantId: brandId } }, { property: { id: propertyId } }],
    },
  });
  if (existingConversation.length) {
    convId = existingConversation[0].id;
  } else {
    let property = await context.prisma.property.findOne({
      where: { id: propertyId },
      include: { landlordUser: true },
    });
    if (!property) {
      throw new Error('Brand not found');
    }
    let userSender = property.landlordUser;

    let createdConversation = await context.prisma.conversation.create({
      data: {
        brand: { connect: { id: newBrand.id } },
        property: { connect: { id: propertyId } },
        landlord: { connect: { id: userSender.id } },
        tenant: { connect: { id: tenantUser.id } },
        matchScore,
        header,
      },
    });
    convId = createdConversation.id;
  }
  await context.prisma.message.create({
    data: {
      message: messageInput.message,
      sender: messageInput.senderRole,
      conversation: { connect: { id: convId } },
    },
  });

  return {
    token: createSession(tenantUser, 'TENANT'),
    tenant: tenantUser,
    brandId: newBrand.id,
  };
};

export let registerTenantInvitation = mutationField(
  'registerTenantInvitation',
  {
    type: 'TenantAuth',
    args: {
      password: stringArg({ required: true }),
      invitationCode: stringArg({ required: true }),
    },
    resolve: registerTenantInvitationResolver,
  },
);
