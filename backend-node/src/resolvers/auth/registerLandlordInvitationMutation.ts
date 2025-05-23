import { mutationField, FieldResolver, stringArg } from 'nexus';
import bcrypt from 'bcrypt';

import { Context } from 'serverTypes';
import { createSession } from '../../helpers/auth';
import { PendingDataType, ReceiverContact } from 'dataTypes';
import { trialCheck } from '../../helpers/trialCheck';

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

  let { email: receiverEmail, name, role, phone }: ReceiverContact = JSON.parse(
    pendingConversation.receiverContact,
  );
  let cryptPassword = bcrypt.hashSync(password, 10);
  let lowerCasedEmail = receiverEmail.toLocaleLowerCase();
  let firstName = name
    .split(' ')
    .slice(0, -1)
    .join(' ');
  let lastName = name
    .split(' ')
    .slice(-1)
    .join(' ');

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
      firstName,
      lastName,
      password: cryptPassword,
      company: `${name}'s Company`,
      title: role,
      phoneNumber: phone,
    },
  });

  // TODO: Auto complete property Data expecting sending spaceId return whole property
  // TODO: Handle what if 1 property have 2 space that have 2 different contact
  let newProperty = await context.prisma.property.create({
    data: {
      name: 'Dummy property',
      // propertyId: `From auto complete ${Math.random()}`, suppose to be from auto complete
      location: {
        create: {
          address: '19317 Sherman Way, Reseda, CA', // This dummy
          lat: '1',
          lng: '1',
        },
      },
      userRelation: 'Owner',
      space: {
        create: {
          spaceId: pendingConversation.spaceId,
          mainPhoto:
            'https://tvip-raykf.s3-ap-southeast-1.amazonaws.com/space-main-photos/zi5KcXdBt',
          available: new Date(),
          description: 'this is dummy',
          condition: 'White Space',
          sqft: 1000,
          pricePerSqft: 10,
          tier: 'PROFESSIONAL',
          marketingPreference: 'PUBLIC',
        },
      },
      landlordUser: {
        connect: {
          id: landlordUser.id,
        },
      },
      marketingPreference: 'PUBLIC',
    },
    include: {
      space: true,
    },
  });
  if (!newProperty) {
    throw new Error('Property failed to be created');
  }

  let { brandId, pendingConversationData, spaceId } = pendingConversation;
  let { header, matchScore, messageInput }: PendingDataType = JSON.parse(
    pendingConversationData,
  );
  let convId;
  let existingConversation = await context.prisma.conversation.findMany({
    where: {
      AND: [{ brand: { id: brandId } }, { space: { spaceId } }],
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
        space: { connect: { id: newProperty.space[0].id } },
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
  let isTrial = trialCheck(landlordUser.createdAt);
  return {
    token: createSession(landlordUser, 'LANDLORD'),
    landlord: { ...landlordUser, trial: isTrial },
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
