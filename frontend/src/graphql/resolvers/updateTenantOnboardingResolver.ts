import { ApolloCache } from 'apollo-cache';
import { TenantOnboardingContent, TenantOnboardingState } from '../localState';
import { GET_TENANT_ONBOARDING_STATE } from '../queries/client/tenantOnboarding';

export let updateTenantOnboarding = async (
  _obj: ObjectKey,
  args: TenantOnboardingContent,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { cache }: { cache: ApolloCache<any> }
) => {
  let {
    confirmBusinessDetail,
    tenantGoals,
    targetCustomers,
    physicalSiteCriteria,
    pendingData,
  } = args;
  console.log(args, 'MASUK RESOLVER');
  let previousState: TenantOnboardingState | null = cache.readQuery({
    query: GET_TENANT_ONBOARDING_STATE,
  });
  let oper =
    typeof pendingData === 'boolean'
      ? pendingData
      : previousState?.tenantOnboardingState.pendingData;
  console.log(oper, pendingData, previousState, '<<<<');
  let data = {
    tenantOnboardingState: {
      __typename: 'TenantOnboardingState',
      pendingData:
        typeof pendingData === 'boolean'
          ? pendingData
          : previousState?.tenantOnboardingState.pendingData,
      confirmBusinessDetail: {
        __typename: 'TenantOnboardingConfirmBusinessDetail',
        ...previousState?.tenantOnboardingState.confirmBusinessDetail,
        ...confirmBusinessDetail,
        location: {
          __typename: 'LocationInput',
          ...previousState?.tenantOnboardingState.confirmBusinessDetail?.location,
          ...confirmBusinessDetail?.location,
        },
      },
      tenantGoals: {
        __typename: 'TenantOnboardingTenantGoals',
        ...previousState?.tenantOnboardingState.tenantGoals,
        ...tenantGoals,
        newLocationPlan: {
          __typename: 'TenantOnboardingTenantGoalsNewLocationPlan',
          ...previousState?.tenantOnboardingState.tenantGoals?.newLocationPlan,
          ...tenantGoals?.newLocationPlan,
        },
      },
      targetCustomers: {
        __typename: 'TenantOnboardingTargetCustomers',
        ...previousState?.tenantOnboardingState.targetCustomers,
        ...targetCustomers,
      },
      physicalSiteCriteria: {
        __typename: 'TenantOnboardingPhysicalSiteCriteria',
        ...previousState?.tenantOnboardingState.physicalSiteCriteria,
        ...physicalSiteCriteria,
      },
    },
  };
  console.log('RESOLVER', data);

  cache.writeData({ data });
  return null;
};
