/* eslint-disable @typescript-eslint/camelcase */
import { Request, Response } from 'express';
import { Base64 } from 'js-base64';

import { prisma } from '../prisma';
import { FRONTEND_HOST } from '../constants/constants';
import {
  PendingDataType,
  ReceiverContact,
  BrandInfo,
  TenantMatchesType,
} from 'dataTypes';
import { createSession } from '../helpers/auth';
import { trialCheck } from '../helpers/trialCheck';
import { axiosParamsSerializer } from '../helpers/axiosParamsCustomSerializer';
import { LEGACY_API_URI } from '../constants/host';
import axios from 'axios';

export let emailRegisterTenantInvitationHandler = async (
  req: Request,
  res: Response,
) => {
  let pendConvId = req.params.token;
  if (!pendConvId) {
    res.status(400).send('Invalid verification code');
    return;
  }
  let decodedPendConvId = Base64.decode(pendConvId);
  let pendingConversation = await prisma.pendingConversation.findOne({
    where: {
      id: decodedPendConvId,
    },
  });
  if (!pendingConversation) {
    res.status(400).send('Invalid verification code');
    return;
  }
  if (pendingConversation.senderRole !== 'LANDLORD') {
    res.status(400).send('Invalid role');
    return;
  }
  let targetBrands = await prisma.brand.findMany({
    where: {
      tenantId: pendingConversation.brandId,
    },
  });
  if (targetBrands.length) {
    res.status(400).send('Brand already exist');
    return;
  }

  let { email: receiverEmail }: ReceiverContact = JSON.parse(
    pendingConversation.receiverContact,
  );

  let existUser = await prisma.tenantUser.findOne({
    where: { email: receiverEmail.toLocaleLowerCase() },
    include: { brands: true },
  });
  if (existUser) {
    let isTrial = trialCheck(existUser.createdAt);
    if (!isTrial) {
      if (existUser.tier !== 'FREE' && existUser.stripeSubscriptionId) {
        existUser = await prisma.tenantUser.update({
          where: { id: existUser.id },
          data: { tier: 'FREE' },
          include: { brands: true },
        });
      }
    }
    if (existUser.tier === 'FREE' && existUser.brands.length > 1) {
      let token = await createSession(existUser, 'TENANT');
      res.redirect(`${FRONTEND_HOST}/redirect-login-tenant/${token}`);
      throw new Error(
        'Can not receive the message. Please upgrade to pro to make new brand and answer the message.',
      );
    }
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
      let spaces = await prisma.space.findMany({
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
        await prisma.savedProperty.findMany({
          where: {
            tenantUser: {
              id: existUser.id,
            },
          },
        })
      ).map(({ spaceId }) => {
        return spaceId;
      });
      newBrandMatchingLoaction = newMatchingLocations
        ? newMatchingLocations
        : [];
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
    let newBrand = await prisma.brand.create({
      data: {
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
    let existingConversation = await prisma.conversation.findMany({
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
      let space = await prisma.space.findOne({
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

      let createdConversation = await prisma.conversation.create({
        data: {
          brand: { connect: { id: newBrand.id } },
          property: { connect: { id: space.property.id } },
          landlord: { connect: { id: userSender.id } },
          tenant: { connect: { id: existUser.id } },
          space: { connect: { id: space.id } },
          matchScore,
          header,
        },
      });
      convId = createdConversation.id;
    }
    await prisma.message.create({
      data: {
        message: messageInput.message,
        sender: messageInput.senderRole,
        conversation: { connect: { id: convId } },
      },
    });
    let token = await createSession(existUser, 'TENANT');
    res.redirect(`${FRONTEND_HOST}/redirect-login-tenant/${token}`);
    return;
  }
  res.redirect(`${FRONTEND_HOST}/create-tenant-user-invitation/${pendConvId}`);
};
