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
    noIncomePreference,
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
      personas: noPersonasPreference ? null : personas,
      education: noEducationsPreference ? null : educations,
      minDaytimePopulation: noMinDaytimePopulationPreference ? null : Number(minDaytimePopulation),
      minAge: noAgePreference ? null : Number(minAge),
      maxAge: noAgePreference ? null : Number(maxAge),
      minIncome: noIncomePreference ? null : Number(minIncome) * 1000,
      maxIncome: noIncomePreference ? null : Number(maxIncome) * 1000,
      minSize: Number(minSize),
      minFrontageWidth: Number(minFrontageWidth),
      spaceType,
      equipment: equipments,
    },
  };
}
