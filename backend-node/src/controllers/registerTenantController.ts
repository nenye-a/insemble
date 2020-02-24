import { Request, Response } from 'express';
import { Base64 } from 'js-base64';

import { prisma } from '../prisma';
import { createBrandResolver } from '../resolvers';
import { GraphQLResolveInfo } from 'graphql';

export let registerTenantHandler = async (req: Request, res: Response) => {
  let tenantVerificationId = Base64.decode(req.params.token);
  let tenantVerification = await prisma.tenantVerification.findOne({
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
  let tenant = JSON.parse(tenantVerification.tenantInput);
  let business = JSON.parse(tenantVerification.businessInput);
  let filter = JSON.parse(tenantVerification.filterInput);

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
  await prisma.tenantVerification.update({
    data: {
      verified: true,
    },
    where: {
      id: tenantVerificationId,
    },
  });
  res.send('success');
};
