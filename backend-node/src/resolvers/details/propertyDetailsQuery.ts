import { queryField, FieldResolver, stringArg } from 'nexus';
import axios from 'axios';

import { Root, Context } from 'serverTypes';
import { LEGACY_API_URI } from '../../constants/host';
import { PropertyDetailsType, DemographicStatProperty } from 'dataTypes';

let propertyDetailsResolver: FieldResolver<'Query', 'propertyDetails'> = async (
  _: Root,
  { propertyId },
  context: Context,
) => {
  let selectedProperty = await context.prisma.property.findOne({
    where: { id: propertyId },
    include: {
      location: true,
    },
  });
  if (!selectedProperty) {
    throw new Error('Property not found!');
  }
  let { result }: PropertyDetailsType = (
    await axios.get(`${LEGACY_API_URI}/api/propertyDetails/`, {
      params: {
        property_id: selectedProperty.propertyId,
      },
    })
  ).data;
  if (!result) {
    throw new Error("Can't get the result!");
  }
  let {
    key_facts: keyFacts,
    commute,
    personas: topPersonas,
    demographics1,
    demographics3,
    demographics5,
  } = result;

  let {
    num_apartments: numApartements,
    num_hospitals: numHospitals,
    num_metro: numMetro,
    num_universities: numUniversities,
    'HouseholdGrowth2017-2022': householdGrowth2017to2022,
    DaytimePop: daytimePop,
    MedHouseholdIncome: mediumHouseholdIncome,
    TotalHousholds: totalHousehold,
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
    commute: commute ? objectToArrayKeyObjectCommute(commute) : [],
    topPersonas,
    demographics1: demographics1
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
        },
    demographics3: demographics3
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
        },
    demographics5: demographics5
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
        },
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
