import { mutationField, arg, FieldResolver } from 'nexus';
import bcrypt from 'bcrypt';
import { Base64 } from 'js-base64';

import { Context } from 'serverTypes';
import { sendTenantVerificationEmail } from '../../helpers/sendEmail';
import { NODE_ENV, HOST } from '../../constants/constants';

let registerTenantResolver: FieldResolver<
  'Mutation',
  'registerTenant'
> = async (_, { tenant, business, filter }, context: Context) => {
  let password = bcrypt.hashSync(tenant.password, 10);
  let lowerCasedEmail = tenant.email.toLocaleLowerCase();
  let exist = await context.prisma.tenantUser.findMany({
    where: {
      email: lowerCasedEmail,
    },
  });
  if (exist.length) {
    throw new Error('user already exist');
  }
  let tenantVerification = await context.prisma.tenantVerification.create({
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
    },
  });

  if (NODE_ENV === 'production') {
    sendTenantVerificationEmail(
      {
        email: `${tenant.email}`,
        name: `${tenant.firstName} ${tenant.lastName}`,
      },
      `${HOST}/register-tenant-verification/${Base64.encodeURI(
        tenantVerification.id,
      )}`,
    );
  } else {
    // console the verification id so we could still test it on dev environment
    // eslint-disable-next-line no-console
    console.log(Base64.encodeURI(tenantVerification.id));
  }

  return { message: 'success' };
};

export let registerTenant = mutationField('registerTenant', {
  type: 'Message',
  args: {
    tenant: arg({ type: 'TenantRegisterInput', required: true }),
    business: arg({ type: 'BusinessInput' }),
    filter: arg({ type: 'FilterInput' }),
  },
  resolve: registerTenantResolver,
});
