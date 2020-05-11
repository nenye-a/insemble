import { queryField, FieldResolver, stringArg } from 'nexus';
import axios from 'axios';

import { Root, Context } from 'serverTypes';
import { LEGACY_API_URI } from '../../constants/host';
import { PropertyDetailsType, DemographicStatProperty } from 'dataTypes';
import { trialCheck } from '../../helpers/trialCheck';

let propertyDetailsResolver: FieldResolver<'Query', 'propertyDetails'> = async (
  _: Root,
  { propertyId },
  context: Context,
) => {
  let selectedProperty = await context.prisma.property.findOne({
    where: { id: propertyId },
    include: {
      location: true,
      landlordUser: true,
      space: { orderBy: { createdAt: 'asc' } },
    },
  });
  if (!selectedProperty) {
    throw new Error('Property not found!');
  }
  if (selectedProperty.landlordUser.id !== context.landlordUserId) {
    throw new Error('This is not your propeerty. Not authenticated.');
  }
  if (!selectedProperty.propertyId) {
    throw new Error('Your location details are loading.');
  }
  let isTrial = trialCheck(selectedProperty.landlordUser.createdAt);
  if (!isTrial) {
    if (
      selectedProperty.space.some(
        ({ stripeSubscriptionId, tier }) =>
          !stripeSubscriptionId && tier !== 'NO_TIER',
      )
    ) {
      selectedProperty = await context.prisma.property.update({
        where: { id: selectedProperty.id },
        data: {
          space: {
            updateMany: {
              where: { stripeSubscriptionId: null },
              data: { tier: 'NO_TIER' },
            },
          },
        },
        include: {
          location: true,
          landlordUser: true,
          space: { orderBy: { createdAt: 'asc' } },
        },
      });
    }
  }
  let isHaveProSpace = selectedProperty.space.some(
    ({ tier }) => tier === 'PROFESSIONAL',
  );
  let isHaveBasicSpace = selectedProperty.space.some(
    ({ tier }) => tier === 'BASIC',
  );
  if (!isHaveBasicSpace && !isHaveProSpace) {
    throw new Error(
      'Property locked, please upgrade one space to basic or pro to access.',
    );
  }
  let resultDetail;
  try {
    let { result }: PropertyDetailsType = (
      await axios.get(`${LEGACY_API_URI}/api/propertyDetails/`, {
        params: {
          property_id: selectedProperty.propertyId,
        },
      })
    ).data;
    resultDetail = result;
  } catch {
    throw new Error('An error has occurred, please try again.');
  }
  if (!resultDetail) {
    throw new Error("Can't get the result!");
  }
  let {
    key_facts: keyFacts,
    commute,
    personas,
    demographics1,
    demographics3,
    demographics5,
  } = resultDetail;

  let {
    nearby_apartments: numApartements,
    num_hospitals: numHospitals,
    num_metro: numMetro,
    num_universities: numUniversities,
    'HouseholdGrowth2017-2022': householdGrowth2017to2022,
    DaytimePop: daytimePop,
    MedHouseholdIncome: mediumHouseholdIncome,
    TotalHouseholds: totalHousehold,
    mile,
  } = keyFacts;
  let objectToArrayKeyObjectDemographics = (
    object: Record<string, DemographicStatProperty>,
  ) => {
    let objectKeyValue = Object.keys(object).map((key) => {
      let { growth, value: myLocation } = object[key];
      return {
        name: key,
        growth,
        myLocation,
      };
    });
    return objectKeyValue;
  };
  let objectToArrayKeyObjectCommute = (object: Record<string, number>) => {
    let objectKeyValue = Object.keys(object).map((key) => {
      return {
        name: key,
        value: object[key],
      };
    });
    return objectKeyValue;
  };
  let topPersonas = personas.map(({ ...persona }) => {
    return { photo: '', ...persona }; // TODO: change to real photoURL
  });

  return {
    keyFacts: {
      mile,
      householdGrowth2017to2022,
      numApartements,
      numMetro,
      numHospitals,
      numUniversities,
      daytimePop,
      totalHousehold,
      mediumHouseholdIncome,
    },
    commute: isHaveProSpace
      ? commute
        ? objectToArrayKeyObjectCommute(commute)
        : []
      : null,
    topPersonas: isHaveProSpace ? topPersonas : null,
    demographics1: isHaveProSpace
      ? demographics1
        ? {
            age: objectToArrayKeyObjectDemographics(demographics1.age),
            income: objectToArrayKeyObjectDemographics(demographics1.income),
            ethnicity: objectToArrayKeyObjectDemographics(
              demographics1.ethnicity,
            ),
            education: objectToArrayKeyObjectDemographics(
              demographics1.education,
            ),
            gender: objectToArrayKeyObjectDemographics(demographics1.gender),
          }
        : {
            age: [],
            income: [],
            ethnicity: [],
            education: [],
            gender: [],
          }
      : null,
    demographics3: isHaveProSpace
      ? demographics3
        ? {
            age: objectToArrayKeyObjectDemographics(demographics3.age),
            income: objectToArrayKeyObjectDemographics(demographics3.income),
            ethnicity: objectToArrayKeyObjectDemographics(
              demographics3.ethnicity,
            ),
            education: objectToArrayKeyObjectDemographics(
              demographics3.education,
            ),
            gender: objectToArrayKeyObjectDemographics(demographics3.gender),
          }
        : {
            age: [],
            income: [],
            ethnicity: [],
            education: [],
            gender: [],
          }
      : null,
    demographics5: isHaveProSpace
      ? demographics5
        ? {
            age: objectToArrayKeyObjectDemographics(demographics5.age),
            income: objectToArrayKeyObjectDemographics(demographics5.income),
            ethnicity: objectToArrayKeyObjectDemographics(
              demographics5.ethnicity,
            ),
            education: objectToArrayKeyObjectDemographics(
              demographics5.education,
            ),
            gender: objectToArrayKeyObjectDemographics(demographics5.gender),
          }
        : {
            age: [],
            income: [],
            ethnicity: [],
            education: [],
            gender: [],
          }
      : null,
  };
};

let propertyDetails = queryField('propertyDetails', {
  type: 'PropertyDetailsResult',
  args: {
    propertyId: stringArg({ required: true }),
  },
  resolve: propertyDetailsResolver,
});

export { propertyDetails };
