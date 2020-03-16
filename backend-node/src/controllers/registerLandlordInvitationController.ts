import { Request, Response } from 'express';
import { Base64 } from 'js-base64';

import { prisma } from '../prisma';
import { FRONTEND_HOST } from '../constants/constants';
import { PendingDataType } from 'dataTypes';
import { createSession } from '../helpers/auth';

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
  let existUser = await prisma.landlordUser.findOne({
    where: { email: pendingConversation.receiverEmail },
  });
  if (existUser) {
    let targetProperties = await prisma.property.findMany({
      where: {
        propertyId: pendingConversation.propertyId,
      },
    });

    if (targetProperties.length) {
      res.status(400).send('Property already exist');
      return;
    }
    // TODO: Auto complete property Data
    let newProperty = await prisma.property.create({
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
            id: existUser.id,
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
    let existingConversation = await prisma.conversation.findMany({
      where: {
        AND: [{ brand: { id: brandId } }, { property: { propertyId } }],
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
          property: { connect: { id: newProperty.id } },
          landlord: { connect: { id: existUser.id } },
          tenant: { connect: { id: userSender.id } },
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
