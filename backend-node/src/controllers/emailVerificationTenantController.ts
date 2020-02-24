import { Request, Response } from 'express';
import { Base64 } from 'js-base64';

import { prisma } from '../prisma';
import { FRONTEND_HOST } from '../constants/constants';

export let emailVerificationTenantHandler = async (
  req: Request,
  res: Response,
) => {
  let tenantEmailVerificationId = Base64.decode(req.params.token);
  let tenantEmailVerification = await prisma.tenantEmailVerification.findOne({
    where: {
      id: tenantEmailVerificationId,
    },
    include: {
      user: true,
    },
  });
  if (!tenantEmailVerification) {
    res.status(400).send('Invalid verification code');
    return;
  }
  if (tenantEmailVerification.verified) {
    res.status(400).send('Verification code already used.');
    return;
  }
  await prisma.tenantUser.update({
    data: {
      email: tenantEmailVerification.email,
      pendingEmail: false,
    },
    where: {
      id: tenantEmailVerification.user.id,
    },
  });
  res.redirect(`${FRONTEND_HOST}/verification-successful`);
};
