import { ApolloCache } from 'apollo-cache';
import { TenantOnboardingContent } from '../localState';
import { GET_TENANT_ONBOARDING_STATE } from '../queries/client/tenantOnboarding';

export let updateTenantOnboarding = async (
  _obj: ObjectKey,
  args: TenantOnboardingContent,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { cache }: { cache: ApolloCache<any> }
) => {
  let { confirmBusinessDetail, tenantGoals, targetCustomers, physicalSiteCriteria } = args;
  console.log(args, 'MASUK RESOLVER');
  let previousState: TenantOnboardingContent | null = cache.readQuery({
    query: GET_TENANT_ONBOARDING_STATE,
  });

  console.log(previousState);
  let data = {
    tenantOnboardingState: {
      __typename: 'TenantOnboardingState',
      confirmBusinessDetail: {
        __typename: 'TenantOnboardingConfirmBusinessDetail',
        ...previousState?.confirmBusinessDetail,
        ...confirmBusinessDetail,
        location: {
          __typename: 'LocationInput',
          ...previousState?.confirmBusinessDetail?.location,
          ...confirmBusinessDetail?.location,
        },
      },
      tenantGoals: {
        __typename: 'TenantOnboardingTenantGoals',
        ...previousState?.tenantGoals,
        ...tenantGoals,
        newLocationPlan: {
          __typename: 'TenantOnboardingTenantGoalsNewLocationPlan',
          ...previousState?.tenantGoals?.newLocationPlan,
          ...tenantGoals?.newLocationPlan,
        },
      },
      targetCustomers: {
        __typename: 'TenantOnboardingTargetCustomers',
        ...previousState?.targetCustomers,
        ...targetCustomers,
      },
      physicalSiteCriteria: {
        __typename: 'TenantOnboardingPhysicalSiteCriteria',
        ...previousState?.physicalSiteCriteria,
        ...physicalSiteCriteria,
      },
    },
  };
  console.log('RESOLVER', data);

  cache.writeData({ data });
  return null;
};
