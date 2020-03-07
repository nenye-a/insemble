import {
  DemographicStat,
  DemographicTenantDetailStat,
} from '../types/dataTypes';

export let objectToArrayKeyObjectDemographics = (
  object: Record<string, DemographicStat>,
) => {
  let objectKeyValue = Object.keys(object).map((key) => {
    let {
      growth,
      my_location: myLocation,
      target_location: targetLocation,
    } = object[key];
    return {
      name: key,
      growth,
      myLocation,
      targetLocation,
    };
  });
  return objectKeyValue;
};

export let objectToArrayKeyObjectDemographicsTenantDetail = (
  object: Record<string, DemographicTenantDetailStat>,
) => {
  let objectKeyValue = Object.keys(object).map((key) => {
    let {
      growth,
      tenant_location: myLocation,
      property_details: targetLocation,
    } = object[key];
    return {
      name: key,
      growth,
      myLocation,
      targetLocation,
    };
  });
  return objectKeyValue;
};
