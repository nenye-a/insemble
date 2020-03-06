import { mutationField, arg, FieldResolver } from 'nexus';
import bcrypt from 'bcrypt';
import { Base64 } from 'js-base64';

import { Context } from 'serverTypes';
import { sendVerificationEmail } from '../../helpers/sendEmail';
import { NODE_ENV, HOST } from '../../constants/constants';
import getRandomBytes from '../../helpers/getRandomBytes';

let registerTenantResolver: FieldResolver<
  'Mutation',
  'registerTenant'
> = async (_, { tenant, business, filter }, context: Context) => {
  let password = bcrypt.hashSync(tenant.password, 10);
  let lowerCasedEmail = tenant.email.toLocaleLowerCase();
  let existing = await context.prisma.tenantUser.findMany({
    where: {
      email: lowerCasedEmail,
    },
  });
  if (existing.length) {
    throw new Error('User already exists');
  }

  let bytesEmail = await getRandomBytes(18);
  let bytesQuery = await getRandomBytes(18);
  let tenantVerification = await context.prisma.tenantRegisterVerification.create(
    {
      data: {
        businessInput: JSON.stringify(business),
        filterInput: JSON.stringify(filter),
        tenantInput: JSON.stringify({
          ...tenant,
          email: lowerCasedEmail,
          password,
          tier: 'FREE',
        }),
        email: lowerCasedEmail,
        tokenEmail: bytesEmail.toString('base64'),
        tokenQuery: bytesQuery.toString('base64'),
      },
    },
  );
  let emailVerifyCode =
    Base64.encodeURI(tenantVerification.id) +
    ':' +
    Base64.encodeURI(tenantVerification.tokenEmail);

  if (NODE_ENV === 'production') {
    sendVerificationEmail(
      {
        email: `${tenant.email}`,
        name: `${tenant.firstName} ${tenant.lastName}`,
      },
      `${HOST}/register-tenant-verification/${emailVerifyCode}`,
    );
  } else {
    // console the verification id so we could still test it on dev environment
    // eslint-disable-next-line no-console
    console.log(emailVerifyCode);
  }

  return {
    message: 'success',
    verificationId:
      Base64.encodeURI(tenantVerification.id) +
      ':' +
      tenantVerification.tokenQuery,
  };
};

export let registerTenant = mutationField('registerTenant', {
  type: 'TenantRegisterResult',
  args: {
    tenant: arg({ type: 'TenantRegisterInput', required: true }),
    business: arg({ type: 'BusinessInput' }),
    filter: arg({ type: 'FilterInput' }),
  },
  resolve: registerTenantResolver,
});
