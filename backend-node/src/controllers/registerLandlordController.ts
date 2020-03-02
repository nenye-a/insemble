import { Request, Response } from 'express';
import { Base64 } from 'js-base64';

import { prisma } from '../prisma';
import { FRONTEND_HOST } from '../constants/constants';

export let registerLandlordHandler = async (req: Request, res: Response) => {
  let landlordVerificationId = Base64.decode(req.params.token);
  let landlordVerification = await prisma.landlordRegisterVerification.findOne({
    where: {
      id: landlordVerificationId,
    },
  });
  if (!landlordVerification) {
    res.status(400).send('Invalid verification code');
    return;
  }
  if (landlordVerification.verified) {
    res.status(400).send('Verification code already used.');
    return;
  }
  let landlord = JSON.parse(landlordVerification.landlordInput);

  await prisma.landlordUser.create({
    data: {
      ...landlord,
    },
  });

  await prisma.landlordRegisterVerification.update({
    data: {
      verified: true,
    },
    where: {
      id: landlordVerificationId,
    },
  });
  res.redirect(`${FRONTEND_HOST}/verification-successful`);
};
