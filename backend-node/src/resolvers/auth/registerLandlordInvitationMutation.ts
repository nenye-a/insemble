import { mutationField, FieldResolver, stringArg } from 'nexus';
import bcrypt from 'bcrypt';

import { Context } from 'serverTypes';
import { createSession } from '../../helpers/auth';
import { PendingDataType } from 'dataTypes';

export let registerLandlordInvitationResolver: FieldResolver<
  'Mutation',
  'registerLandlordInvitation'
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
  if (pendingConversation.senderRole !== 'TENANT') {
    throw new Error('Invalid role');
  }

  // TODO: Auto complete user data
  let cryptPassword = bcrypt.hashSync(password, 10);
  let lowerCasedEmail = pendingConversation.receiverEmail.toLocaleLowerCase();

  let exist = await context.prisma.landlordUser.findOne({
    where: {
      email: lowerCasedEmail,
    },
  });
  if (exist) {
    throw new Error('user already exist');
  }

  let landlordUser = await context.prisma.landlordUser.create({
    data: {
      email: lowerCasedEmail,
      firstName: 'Dummy',
      lastName: 'Landlord',
      password: cryptPassword,
      tier: 'FREE',
      company: 'Dummy Property Loan',
    },
  });

  // TODO: Auto complete property Data
  let newProperty = await context.prisma.property.create({
    data: {
      name: 'Dummy property',
      propertyId: pendingConversation.propertyId,
      location: {
        create: { address: 'Dummy', lat: '1', lng: '1' },
      },
      userRelation: 'Owner',
      space: {
        create: {
          mainPhoto:
            'https://tvip-raykf.s3-ap-southeast-1.amazonaws.com/space-main-photos/zi5KcXdBt',
          available: new Date(),
          description: 'this is dummy',
          condition: 'White Space',
          sqft: 1000,
          pricePerSqft: 10,
        },
      },
      landlordUser: {
        connect: {
          id: landlordUser.id,
        },
      },
      marketingPreference: 'PUBLIC',
    },
  });
  if (!newProperty) {
    throw new Error('Property failed to be created');
  }

  let { brandId, pendingConversationData, propertyId } = pendingConversation;
  let { header, matchScore, messageInput }: PendingDataType = JSON.parse(
    pendingConversationData,
  );
  let convId;
  let existingConversation = await context.prisma.conversation.findMany({
    where: {
      AND: [{ brand: { id: brandId } }, { property: { propertyId } }],
    },
  });
  if (existingConversation.length) {
    convId = existingConversation[0].id;
  } else {
    let brand = await context.prisma.brand.findOne({
      where: { id: brandId },
      include: { tenantUser: true },
    });
    if (!brand) {
      throw new Error('Brand not found');
    }
    if (!brand.tenantUser) {
      throw new Error('Tenant not found');
    }
    let userSender = brand.tenantUser;

    let createdConversation = await context.prisma.conversation.create({
      data: {
        brand: { connect: { id: brandId } },
        property: { connect: { id: newProperty.id } },
        landlord: { connect: { id: landlordUser.id } },
        tenant: { connect: { id: userSender.id } },
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
    token: createSession(landlordUser, 'LANDLORD'),
    landlord: landlordUser,
  };
};

export let registerLandlordInvitation = mutationField(
  'registerLandlordInvitation',
  {
    type: 'LandlordAuth',
    args: {
      password: stringArg({ required: true }),
      invitationCode: stringArg({ required: true }),
    },
    resolve: registerLandlordInvitationResolver,
  },
);
