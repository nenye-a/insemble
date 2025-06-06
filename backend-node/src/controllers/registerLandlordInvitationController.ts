import { Request, Response } from 'express';
import { Base64 } from 'js-base64';

import { prisma } from '../prisma';
import { FRONTEND_HOST } from '../constants/constants';
import { PendingDataType, ReceiverContact } from 'dataTypes';
import { createSession } from '../helpers/auth';
import { trialCheck } from '../helpers/trialCheck';
import { LandlordTier } from '@prisma/client';

export let emailRegisterLandlordInvitationHandler = async (
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
  if (pendingConversation.senderRole !== 'TENANT') {
    res.status(400).send('Invalid role');
    return;
  }
  let targetProperties = await prisma.space.findMany({
    where: {
      spaceId: pendingConversation.spaceId,
    },
  });

  if (targetProperties.length) {
    res.status(400).send('Property already exist');
    return;
  }
  let { email: receiverEmail }: ReceiverContact = JSON.parse(
    pendingConversation.receiverContact,
  );

  let existUser = await prisma.landlordUser.findOne({
    where: { email: receiverEmail.toLocaleLowerCase() },
  });
  if (existUser) {
    // TODO: Auto complete property Data expecting sending spaceId return whole property
    // TODO: If propertyId from above already exist just create Space else create whole property
    // TODO: fix logic checking if conversation exist first
    let tier: LandlordTier = 'PROFESSIONAL';
    let isTrial = trialCheck(existUser.createdAt);
    if (!isTrial) {
      tier = 'NO_TIER';
    }
    let linkedProperty = await prisma.property.create({
      data: {
        name: 'Dummy property',
        // propertyId: `From auto complete ${Math.random()}`, suppose to be from auto complete
        location: {
          create: {
            address: '19317 Sherman Way, Reseda, CA',
            lat: '1',
            lng: '1',
          },
        },
        userRelation: 'Owner',
        userRelations: {
          set: ['Owner'],
        },
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
            tier,
            marketingPreference: 'PUBLIC',
          },
        },
        landlordUser: {
          connect: {
            id: existUser.id,
          },
        },
        marketingPreference: 'PUBLIC',
      },
      include: {
        space: true,
      },
    });
    if (!linkedProperty) {
      throw new Error('Property failed to be created');
    }

    let { brandId, pendingConversationData, spaceId } = pendingConversation;
    let { header, matchScore, messageInput }: PendingDataType = JSON.parse(
      pendingConversationData,
    );
    let convId;
    let existingConversation = await prisma.conversation.findMany({
      where: {
        AND: [{ brand: { id: brandId } }, { space: { spaceId } }],
      },
    });
    if (existingConversation.length) {
      convId = existingConversation[0].id;
    } else {
      let brand = await prisma.brand.findOne({
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

      let createdConversation = await prisma.conversation.create({
        data: {
          brand: { connect: { id: brandId } },
          property: { connect: { id: linkedProperty.id } },
          landlord: { connect: { id: existUser.id } },
          tenant: { connect: { id: userSender.id } },
          space: { connect: { id: linkedProperty.space[0].id } },
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
    let token = await createSession(existUser, 'LANDLORD');
    res.redirect(`${FRONTEND_HOST}/redirect-login-landlord/${token}`);
  }

  res.redirect(
    `${FRONTEND_HOST}/create-landlord-user-invitation/${pendConvId}`,
  );
};
