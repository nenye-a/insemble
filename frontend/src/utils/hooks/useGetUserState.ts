import { useEffect } from 'react';

import { useLazyQuery } from '@apollo/react-hooks';
import { TenantTier } from '../../generated/globalTypes';
import { GET_TENANT_PROFILE, GET_LANDLORD_PROFILE } from '../../graphql/queries/server/profile';
import useCredentials from '../useCredentials';
import { Role } from '../../types/types';
import { GetTenantProfile } from '../../generated/GetTenantProfile';
import { GetLandlordProfile } from '../../generated/GetLandlordProfile';

export function useGetUserState() {
  let { role } = useCredentials();
  let [getTenantProfile, { data: tenantProfile, loading: tenantLoading }] = useLazyQuery<
    GetTenantProfile
  >(GET_TENANT_PROFILE, {
    notifyOnNetworkStatusChange: true,
  });
  let [getLandlordProfile, { data: landlordProfile, loading: landlordLoading }] = useLazyQuery<
    GetLandlordProfile
  >(GET_LANDLORD_PROFILE, {
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (role === Role.TENANT) {
      getTenantProfile();
    } else if (role === Role.LANDLORD) {
      getLandlordProfile();
    }
  }, [role, getTenantProfile, getLandlordProfile]);

  if (tenantProfile?.profileTenant) {
    let { tier, trial } = tenantProfile.profileTenant;
    let isTenantFreeTier = tier === TenantTier.FREE;
    let isTenantPro = tier === TenantTier.PROFESSIONAL;

    return {
      loading: false,
      tier,
      trial,
      isTenantFreeTier,
      isTenantPro,
      isLocked: isTenantFreeTier,
    };
  } else if (landlordProfile?.profileLandlord) {
    let { trial } = landlordProfile.profileLandlord;
    return {
      loading: false,
      tier: undefined,
      trial,
      isTenantFreeTier: undefined,
      isTenantPro: undefined,
      isLocked: undefined,
    };
  }
  return {
    loading: role === Role.TENANT ? tenantLoading : landlordLoading,
    tier: undefined,
    trial: undefined,
    isTenantFreeTier: undefined,
    isTenantPro: undefined,
    isLocked: undefined,
  };
}
