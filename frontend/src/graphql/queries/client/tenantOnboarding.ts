import gql from 'graphql-tag';

export const UPDATE_TENANT_ONBOARDING = gql`
  mutation updateTenantOnboarding(
    $confirmBusinessDetail: ConfirmBusinessDetail
    $tenantGoals: TenantGoals
    $targetCustomers: TargetCustomers
    $tenantPhysicalCriteria: TenantPhysicalCriteria
  ) {
    updateTenantOnboarding(
      confirmBusinessDetail: $confirmBusinessDetail
      tenantGoals: $tenantGoals
      targetCustomers: $targetCustomers
      tenantPhysicalCriteria: $tenantPhysicalCriteria
    ) @client
  }
`;

export const GET_TENANT_ONBOARDING_STATE = gql`
  query tenantOnboardingState {
    tenantOnboardingState @client {
      confirmBusinessDetail {
        name
        location {
          address
          lat
          lng
        }
        categories
        userRelation
        otherUserRelation
      }
      tenantGoals {
        newLocationPlan {
          label
          value
        }
        location {
          address
          lat
          lng
        }
        locationCount
      }
      targetCustomers {
        minAge
        maxAge
        noAgePreference
        minIncome
        maxIncome
        personas
        noPersonasPreference
        educations
        noEducationsPreference
        minDaytimePopulation
        noMinDaytimePopulationPreference
      }
      physicalSiteCriteria {
        minSize
        maxSize
        minFrontageWidth
        equipments
        spaceType
      }
    }
  }
`;
