import { mutationField, FieldResolver, stringArg } from 'nexus';
import { Base64 } from 'js-base64';

import { Context } from 'serverTypes';
import { sendVerificationEmail } from '../../helpers/sendEmail';
import { NODE_ENV, FRONTEND_HOST } from '../../constants/constants';

let forgotPasswordTenantResolver: FieldResolver<
  'Mutation',
  'forgotPasswordTenant'
> = async (_, { email }, context: Context) => {
  let lowerCasedEmail = email.toLocaleLowerCase();
  let existing = await context.prisma.tenantUser.findOne({
    where: { email: lowerCasedEmail },
  });
  if (!existing) {
    throw new Error('User not found!');
  }
  let tenantRPVerification;
  let existingTenantRPVerification = await context.prisma.tenantResetPasswordVerification.findMany(
    {
      where: {
        email: lowerCasedEmail,
        verified: false,
      },
    },
  );
  if (existingTenantRPVerification.length) {
    tenantRPVerification = existingTenantRPVerification[0];
  } else {
    tenantRPVerification = await context.prisma.tenantResetPasswordVerification.create(
      {
        data: {
          user: { connect: { id: existing.id } },
          email: lowerCasedEmail,
        },
      },
    );
  }

  if (NODE_ENV === 'production') {
    sendVerificationEmail(
      {
        email: `${existing.email}`,
        name: `${existing.firstName} ${existing.lastName}`,
      },
      `${FRONTEND_HOST}/reset-password-tenant/${Base64.encodeURI(
        tenantRPVerification.id,
      )}`,
    );
  } else {
    // console the verification id so we could still test it on dev environment
    // eslint-disable-next-line no-console
    console.log(Base64.encodeURI(tenantRPVerification.id));
  }

  return { message: 'success', verificationId: tenantRPVerification.id };
};

export let forgotPasswordTenant = mutationField('forgotPasswordTenant', {
  type: 'TenantRegisterResult',
  args: {
    email: stringArg({ required: true }),
  },
  resolve: forgotPasswordTenantResolver,
});
