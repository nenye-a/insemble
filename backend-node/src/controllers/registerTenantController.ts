import { Request, Response } from 'express';
import { Base64 } from 'js-base64';

import { prisma } from '../prisma';
import { createBrandResolver } from '../resolvers';
import { GraphQLResolveInfo } from 'graphql';
import { FRONTEND_HOST } from '../constants/constants';

export let registerTenantHandler = async (req: Request, res: Response) => {
  let [verifyId, tokenEmail] = req.params.token
    ? req.params.token.split(':')
    : [];
  if (!verifyId || !tokenEmail) {
    throw new Error('Invalid verification code');
  }
  let tenantVerificationId = Base64.decode(verifyId);
  let decodedTokenEmail = Base64.decode(tokenEmail);
  let tenantVerification = await prisma.tenantRegisterVerification.findOne({
    where: {
      id: tenantVerificationId,
    },
  });
  if (!tenantVerification) {
    res.status(400).send('Invalid verification code');
    return;
  }
  if (tenantVerification.verified) {
    res.status(400).send('Verification code already used.');
    return;
  }
  if (decodedTokenEmail !== tenantVerification.tokenEmail) {
    res.status(400).send('Invalid token');
    return;
  }
  let tenant = JSON.parse(tenantVerification.tenantInput);
  let business = tenantVerification.businessInput
    ? JSON.parse(tenantVerification.businessInput)
    : undefined;
  let filter = tenantVerification.filterInput
    ? JSON.parse(tenantVerification.filterInput)
    : undefined;

  let createdTenant = await prisma.tenantUser.create({
    data: {
      ...tenant,
    },
  });

  if (business || filter) {
    await createBrandResolver(
      {},
      { business, filter },
      { prisma, tenantUserId: createdTenant.id },
      {} as GraphQLResolveInfo,
    );
  }
  await prisma.tenantRegisterVerification.update({
    data: {
      verified: true,
    },
    where: {
      id: tenantVerificationId,
    },
  });
  res.redirect(`${FRONTEND_HOST}/verification-successful`);
};
