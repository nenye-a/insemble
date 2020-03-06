import axios from 'axios';
import { FieldResolver, queryField, stringArg } from 'nexus';

import { Root, Context } from 'serverTypes';
import { LEGACY_API_URI } from '../../constants/host';
import { TenantDetail } from 'dataTypes';
import { objectToArrayKeyObjectDemographics } from '../../helpers/objectToArrayKeyObjectDemographics';

let tenantDetailResolver: FieldResolver<'Query', 'tenantDetail'> = async (
  _: Root,
  { brandId },
  __: Context,
) => {
  let {
    insights: { demographics1, demographics2, demographics3, personas },
    // eslint-disable-next-line @typescript-eslint/camelcase
    key_facts,
    tenant,
  }: TenantDetail = (
    await axios.get(`${LEGACY_API_URI}/api/tenantDetails/`, {
      params: {
        tenant_id: brandId,
      },
    })
  ).data.result;
  return {
    name: 'California Cheeseburgers',
    category: 'Hamburger Restaurant',
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
      topPersonas: personas.map((persona) => {
        return { ...persona, photo: '' };
      }),
      demographics1: {
        age: objectToArrayKeyObjectDemographics(demographics1.age),
        income: objectToArrayKeyObjectDemographics(demographics1.income),
        ethnicity: objectToArrayKeyObjectDemographics(demographics1.ethnicity),
        education: objectToArrayKeyObjectDemographics(demographics1.education),
        gender: objectToArrayKeyObjectDemographics(demographics1.gender),
      },
      demographics3: {
        age: objectToArrayKeyObjectDemographics(demographics2.age),
        income: objectToArrayKeyObjectDemographics(demographics2.income),
        ethnicity: objectToArrayKeyObjectDemographics(demographics2.ethnicity),
        education: objectToArrayKeyObjectDemographics(demographics2.education),
        gender: objectToArrayKeyObjectDemographics(demographics2.gender),
      },
      demographics5: {
        age: objectToArrayKeyObjectDemographics(demographics3.age),
        income: objectToArrayKeyObjectDemographics(demographics3.income),
        ethnicity: objectToArrayKeyObjectDemographics(demographics3.ethnicity),
        education: objectToArrayKeyObjectDemographics(demographics3.education),
        gender: objectToArrayKeyObjectDemographics(demographics3.gender),
      },
    },
  };
};

let tenantDetailQuery = queryField('tenantDetail', {
  type: 'TenantDetailsResult',
  args: { brandId: stringArg({ required: true }) },
  resolve: tenantDetailResolver,
});

export { tenantDetailQuery };
