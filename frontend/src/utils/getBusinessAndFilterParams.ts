import {
  ConfirmBusinessDetail,
  TenantGoals,
  TargetCustomers,
  PhysicalSiteCriteria,
} from '../reducers/tenantOnboardingReducer';

export default function getBusinessAndFilterParams(
  confirmBusinessDetail: ConfirmBusinessDetail,
  tenantGoals: TenantGoals,
  targetCustomers: TargetCustomers,
  physicalSiteCriteria: PhysicalSiteCriteria
) {
  let { name, userRelation, otherUserRelation, location, categories } = confirmBusinessDetail;
  let { locationCount, newLocationPlan, location: nextLocations } = tenantGoals;
  let {
    noPersonasPreference,
    personas,
    noEducationsPreference,
    educations,
    noMinDaytimePopulationPreference,
    minDaytimePopulation,
    noAgePreference,
    minAge,
    maxAge,
    minIncome,
    maxIncome,
  } = targetCustomers;
  let { minSize, minFrontageWidth, spaceType, equipments } = physicalSiteCriteria;
  return {
    business: {
      name,
      userRelation: userRelation === 'Other' ? otherUserRelation || '' : userRelation,
      location,
      locationCount: locationCount ? Number(locationCount) : null,
      newLocationPlan: newLocationPlan?.value,
      nextLocations,
    },
    filter: {
      categories,
      personas: noPersonasPreference ? undefined : personas,
      education: noEducationsPreference ? undefined : educations,
      minDaytimePopulation: noMinDaytimePopulationPreference
        ? undefined
        : Number(minDaytimePopulation),
      minAge: noAgePreference ? undefined : Number(minAge),
      maxAge: noAgePreference ? undefined : Number(maxAge),
      minIncome: Number(minIncome) * 1000,
      maxIncome: Number(maxIncome) * 1000,
      minSize: Number(minSize),
      minFrontageWidth: Number(minFrontageWidth),
      spaceType,
      equipment: equipments,
    },
  };
}
