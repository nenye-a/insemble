import { mutationField, arg } from 'nexus';
import bcrypt from 'bcrypt';

import { Context } from 'serverTypes';
import { createTenantSession } from '../../helpers/auth';

export let registerTenant = mutationField('registerTenant', {
  type: 'TenantAuth',
  args: {
    tenant: arg({ type: 'TenantRegisterInput', required: true }),
    business: arg({ type: 'BusinessInput' }),
    filter: arg({ type: 'FilterInput' }),
  },
  resolve: async (_, { tenant, business, filter }, context: Context) => {
    let password = bcrypt.hashSync(tenant.password, 10);
    let lowerCasedEmail = tenant.email.toLocaleLowerCase();
    let exist = await context.prisma.tenantUser.findMany({
      where: {
        email: lowerCasedEmail,
      },
    });
    let brandId = '';
    if (exist.length) {
      throw new Error('user already exist');
    }
    let createdTenant = await context.prisma.tenantUser.create({
      data: {
        ...tenant,
        email: lowerCasedEmail,
        password,
        tier: 'FREE',
      },
    });
    if (business || filter) {
      let {
        categories = [],
        equipmentIds = [],
        personas = [],
        spaceType = [],
        education = [],
        commute = [],
        ...filterInput
      } = filter || {};
      let { location, nextLocations, ...businessInput } = business || {};
      let brands = await context.prisma.tenantUser
        .update({
          data: {
            brands: {
              create: {
                ...businessInput,
                ...filterInput,
                categories: {
                  set: categories,
                },
                equipmentIds: {
                  set: equipmentIds,
                },
                personas: {
                  set: personas,
                },
                spaceType: {
                  set: spaceType,
                },
                education: {
                  set: education,
                },
                commute: {
                  set: commute,
                },
                location: {
                  create: location,
                },
              },
            },
          },
          where: {
            id: createdTenant.id,
          },
        })
        .brands();
      brandId = brands[0].id;
    }
    return {
      token: createTenantSession(createdTenant),
      tenant: createdTenant,
      brandId,
    };
  },
});
