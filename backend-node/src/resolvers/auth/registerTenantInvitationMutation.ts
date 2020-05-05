/* eslint-disable @typescript-eslint/camelcase */
import { mutationField, FieldResolver, stringArg } from 'nexus';
import bcrypt from 'bcrypt';

import { Context } from 'serverTypes';
import { createSession } from '../../helpers/auth';
import {
  PendingDataType,
  ReceiverContact,
  BrandInfo,
  TenantMatchesType,
} from 'dataTypes';
import { trialCheck } from '../../helpers/trialCheck';
import axios from 'axios';
import { LEGACY_API_URI } from '../../constants/host';
import { axiosParamsSerializer } from '../../helpers/axiosParamsCustomSerializer';

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
      firstName,
      lastName,
      password: cryptPassword,
      tier: 'PROFESSIONAL',
      company: `${name}'s Company`,
      title: role,
      phoneNumber: phone,
    },
  });

  // TODO: Auto complete brand Data
  let { pendingConversationData, spaceId } = pendingConversation;
  let {
    header,
    matchScore,
    messageInput,
    brandInfo,
  }: PendingDataType & { brandInfo?: BrandInfo } = JSON.parse(
    pendingConversationData,
  );

  let newBrandName = brandInfo ? brandInfo.brandName : 'No name';
  let newBrandCategories = brandInfo ? [brandInfo.category] : [];
  let newBrandTenantId = brandInfo ? brandInfo.brandId : undefined;
  let newBrandMatchId = '';
  let newBrandMatchingProperties = [];
  let newBrandMatchingLoaction = [];
  try {
    let {
      match_id: newMatchId,
      matching_locations: newMatchingLocations,
      matching_properties: rawMatchingProperties = [],
    }: TenantMatchesType = (
      await axios.get(`${LEGACY_API_URI}/api/tenantMatches/`, {
        params: {
          brand_name: newBrandName,
          categories: newBrandCategories.length
            ? JSON.stringify([newBrandCategories])
            : undefined,
          brand_id: newBrandTenantId,
        },
        paramsSerializer: axiosParamsSerializer,
      })
    ).data;
    newBrandMatchId = newMatchId;

    let rawMatchingPropertiesIds = rawMatchingProperties?.map(
      ({ space_id }) => space_id,
    );
    let spaces = await context.prisma.space.findMany({
      where: {
        spaceId: {
          in: rawMatchingPropertiesIds,
        },
      },
    });

    let spacesMap = new Map(
      spaces.map(({ spaceId, ...rest }) => [spaceId, rest]),
    );
    let prismaSpaceIds = [...spacesMap.keys()];
    let filteredMatchingProperties = rawMatchingProperties?.filter(
      ({ space_id }) => prismaSpaceIds.includes(space_id),
    );

    let savedPropertySpaceIds = (
      await context.prisma.savedProperty.findMany({
        where: {
          tenantUser: {
            id: tenantUser.id,
          },
        },
      })
    ).map(({ spaceId }) => {
      return spaceId;
    });
    newBrandMatchingLoaction = newMatchingLocations ? newMatchingLocations : [];
    newBrandMatchingProperties = filteredMatchingProperties?.map(
      ({
        space_id: spaceId,
        property_id: propertyId,
        space_condition: spaceCondition,
        tenant_type: tenantType,
        match_value: matchValue,
        lng: numberLng,
        lat: numberLat,
        type,
        ...other
      }) => {
        return {
          spaceId,
          propertyId,
          spaceCondition,
          tenantType,
          type,
          matchValue,
          thumbnail: spacesMap.get(spaceId)?.mainPhoto || '',
          lng: numberLng.toString(),
          lat: numberLat.toString(),
          ...other,
          liked: savedPropertySpaceIds.includes(spaceId),
        };
      },
    );
  } catch {
    throw new Error('Cannot create new brand, please try again!');
  }
  let newBrand = await context.prisma.brand.create({
    data: {
      name: newBrandName,
      categories: {
        set: newBrandCategories,
      },
      matchingLocations: JSON.stringify(newBrandMatchingLoaction),
      matchingProperties: JSON.stringify(newBrandMatchingProperties),
      tenantId: newBrandTenantId,
      matchId: newBrandMatchId,
    },
  });
  if (!newBrand) {
    throw new Error('Brand failed to be created');
  }

  let convId;
  let existingConversation = await context.prisma.conversation.findMany({
    where: {
      AND: [
        { brand: { matchId: newBrand.matchId } },
        { space: { id: spaceId } },
      ],
    },
  });
  if (existingConversation.length) {
    convId = existingConversation[0].id;
  } else {
    let space = await context.prisma.space.findOne({
      where: { id: spaceId },
      include: { property: { include: { landlordUser: true } } },
    });
    if (!space) {
      throw new Error('Space not found or deleted');
    }
    if (!space.property) {
      throw new Error(
        'Property not found or deleted or disconnected from space',
      );
    }
    let userSender = space.property.landlordUser;

    let createdConversation = await context.prisma.conversation.create({
      data: {
        brand: { connect: { id: newBrand.id } },
        property: { connect: { id: space.property.id } },
        landlord: { connect: { id: userSender.id } },
        tenant: { connect: { id: tenantUser.id } },
        space: { connect: { id: space.id } },
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
  let isTrial = trialCheck(tenantUser.createdAt);
  return {
    token: createSession(tenantUser, 'TENANT'),
    tenant: { ...tenantUser, trial: isTrial },
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
