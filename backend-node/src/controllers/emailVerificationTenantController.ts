import { Request, Response } from 'express';
import { Base64 } from 'js-base64';

import { prisma } from '../prisma';
import { FRONTEND_HOST } from '../constants/constants';

export let emailVerificationTenantHandler = async (
  req: Request,
  res: Response,
) => {
  let [verifyId, tokenEmail] = req.params.token
    ? req.params.token.split(':')
    : [];
  if (!verifyId || !tokenEmail) {
    throw new Error('Invalid verification code');
  }
  let tenantEmailVerificationId = Base64.decode(verifyId);
  let decodedTokenEmail = Base64.decode(tokenEmail);
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
  if (decodedTokenEmail !== tenantEmailVerification.tokenEmail) {
    res.status(400).send('Invalid token');
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
