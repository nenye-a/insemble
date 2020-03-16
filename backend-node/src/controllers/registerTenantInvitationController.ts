import { Request, Response } from 'express';
import { Base64 } from 'js-base64';

import { prisma } from '../prisma';
import { FRONTEND_HOST } from '../constants/constants';
import { PendingDataType } from 'dataTypes';
import { createSession } from '../helpers/auth';

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
  let existUser = await prisma.tenantUser.findOne({
    where: { email: pendingConversation.receiverEmail },
  });
  if (existUser) {
    let targetBrands = await prisma.brand.findMany({
      where: {
        tenantId: pendingConversation.brandId,
      },
    });
    if (targetBrands.length) {
      res.status(400).send('Brand already exist please reload your search');
      return;
    }
    // TODO: Auto complete brand Data
    let newBrand = await prisma.brand.create({
      data: {
        name: 'Dummy brand',
        tenantId: pendingConversation.brandId,
        location: {
          create: { address: 'Dummy', lat: '1', lng: '1' },
        },
        userRelation: 'Owner',
        tenantUser: {
          connect: {
            id: existUser.id,
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
    let existingConversation = await prisma.conversation.findMany({
      where: {
        AND: [
          { brand: { tenantId: brandId } },
          { property: { id: propertyId } },
        ],
      },
    });
    if (existingConversation.length) {
      convId = existingConversation[0].id;
    } else {
      let property = await prisma.property.findOne({
        where: { id: propertyId },
        include: { landlordUser: true },
      });
      if (!property) {
        throw new Error('Brand not found');
      }
      let userSender = property.landlordUser;

      let createdConversation = await prisma.conversation.create({
        data: {
          brand: { connect: { id: newBrand.id } },
          property: { connect: { id: propertyId } },
          landlord: { connect: { id: userSender.id } },
          tenant: { connect: { id: existUser.id } },
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
