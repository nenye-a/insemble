import { Request, Response } from 'express';
import { Base64 } from 'js-base64';

import { prisma } from '../prisma';
import { FRONTEND_HOST } from '../constants/constants';

export let emailVerificationLandlordHandler = async (
  req: Request,
  res: Response,
) => {
  let landlordEmailVerificationId = Base64.decode(req.params.token);
  let landlordEmailVerification = await prisma.landlordEmailVerification.findOne(
    {
      where: {
        id: landlordEmailVerificationId,
      },
      include: {
        user: true,
      },
    },
  );
  if (!landlordEmailVerification) {
    res.status(400).send('Invalid verification code');
    return;
  }
  if (landlordEmailVerification.verified) {
    res.status(400).send('Verification code already used.');
    return;
  }
  await prisma.landlordUser.update({
    data: {
      email: landlordEmailVerification.email,
      pendingEmail: false,
    },
    where: {
      id: landlordEmailVerification.user.id,
    },
  });
  res.redirect(`${FRONTEND_HOST}/verification-successful`);
};
