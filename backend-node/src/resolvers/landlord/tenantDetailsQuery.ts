import axios from 'axios';
import { FieldResolver, queryField, stringArg } from 'nexus';

import { Root, Context } from 'serverTypes';
import { LEGACY_API_URI } from '../../constants/host';
import { TenantDetail } from 'dataTypes';
import { DELETED_BASE64_STRING } from '../..DELETED_BASE64_STRING';
import { trialCheck } from '../../helpers/trialCheck';

let tenantDetailResolver: FieldResolver<'Query', 'tenantDetail'> = async (
  _: Root,
  { brandId, propertyId: nodePropertyId, matchId },
  context: Context,
) => {
  let property = await context.prisma.property.findOne({
    where: {
      id: nodePropertyId,
    },
    include: {
      location: true,
      landlordUser: true,
      space: true,
    },
  });
  if (!property) {
    throw new Error('Invalid property Id');
  }
  if (property.landlordUser.id !== context.landlordUserId) {
    throw new Error('This is not your propeerty. Not authenticated.');
  }
  let isTrial = trialCheck(property.landlordUser.createdAt);
  if (!isTrial) {
    if (
      property.space.some(
        ({ stripeSubscriptionId, tier }) =>
          !stripeSubscriptionId && tier !== 'NO_TIER',
      )
    ) {
      property = await context.prisma.property.update({
        where: { id: property.id },
        data: {
          space: {
            updateMany: {
              where: { stripeSubscriptionId: null, tier: { not: 'NO_TIER' } },
              data: { tier: 'NO_TIER' },
            },
          },
        },
        include: {
          location: true,
          landlordUser: true,
          space: true,
        },
      });
    }
  }
  let isHaveProSpace = property.space.some(
    ({ tier }) => tier === 'PROFESSIONAL',
  );
  let isHaveBasicSpace = property.space.some(({ tier }) => tier === 'BASIC');
  if (!isHaveBasicSpace && !isHaveProSpace) {
    throw new Error(
      'Property locked, please upgrade one space to basic or pro to access.',
    );
  }
  let {
    // eslint-disable-next-line @typescript-eslint/camelcase
    brand_name,
    category,
    insights: { demographics1, demographics2, demographics3, personas },
    // eslint-disable-next-line @typescript-eslint/camelcase
    key_facts,
    tenant,
  }: TenantDetail = (
    await axios.get(`${LEGACY_API_URI}/api/tenantDetails/`, {
      params: {
        brand_id: brandId,
        match_id: matchId,
        property_id: property.propertyId,
      },
    })
  ).data.result;
  return {
    name: brand_name,
    category: category || '',
    keyFacts: {
      tenantPerformance: {
        storeCount: key_facts.num_stores,
        averageReviews: key_facts.num_reviews,
        operationYears: key_facts.years_operating,
        rating: key_facts.rating,
      },
    },
    tenantView: {
      overview: tenant.overview,
      description: tenant.description,
      minSqft: tenant['physical requirements']['minimum sqft'],
      ceilingHeight: tenant['physical requirements']['frontage width'],
      condition: tenant['physical requirements'].condition,
    },
    insightView: {
      topPersonas: isHaveProSpace
        ? personas.map((persona) => {
            return { ...persona, photo: persona.photo || '' };
          })
        : null,
      demographics1: isHaveProSpace
        ? {
            age: DELETED_BASE64_STRING(
              demographics1.age,
            ),
            income: DELETED_BASE64_STRING(
              demographics1.income,
            ),
            ethnicity: DELETED_BASE64_STRING(
              demographics1.ethnicity,
            ),
            education: DELETED_BASE64_STRING(
              demographics1.education,
            ),
            gender: DELETED_BASE64_STRING(
              demographics1.gender,
            ),
          }
        : null,
      demographics3: isHaveProSpace
        ? {
            age: DELETED_BASE64_STRING(
              demographics2.age,
            ),
            income: DELETED_BASE64_STRING(
              demographics2.income,
            ),
            ethnicity: DELETED_BASE64_STRING(
              demographics2.ethnicity,
            ),
            education: DELETED_BASE64_STRING(
              demographics2.education,
            ),
            gender: DELETED_BASE64_STRING(
              demographics2.gender,
            ),
          }
        : null,
      demographics5: isHaveProSpace
        ? {
            age: DELETED_BASE64_STRING(
              demographics3.age,
            ),
            income: DELETED_BASE64_STRING(
              demographics3.income,
            ),
            ethnicity: DELETED_BASE64_STRING(
              demographics3.ethnicity,
            ),
            education: DELETED_BASE64_STRING(
              demographics3.education,
            ),
            gender: DELETED_BASE64_STRING(
              demographics3.gender,
            ),
          }
        : null,
    },
  };
};

let tenantDetailQuery = queryField('tenantDetail', {
  type: 'TenantDetailsResult',
  args: {
    brandId: stringArg({ required: true }),
    propertyId: stringArg({ required: true }),
    matchId: stringArg(),
  },
  resolve: tenantDetailResolver,
});

export { tenantDetailQuery };
