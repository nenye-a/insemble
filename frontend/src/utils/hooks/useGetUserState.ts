import { useQuery } from '@apollo/react-hooks';
import { GET_USER_STATE } from '../../graphql/queries/client/userState';
import { TenantTier } from '../../generated/globalTypes';

export function useGetUserState() {
  let { data, refetch } = useQuery(GET_USER_STATE, {
    notifyOnNetworkStatusChange: true,
  });
  let { tier, trial } = data.userState;
  let isTenantFreeTier = tier === TenantTier.FREE;
  let isTenantPro = tier === TenantTier.PROFESSIONAL;
  let isLocked = tier === TenantTier.FREE || !trial;
  return { tier, trial, refetch, isTenantFreeTier, isTenantPro, isLocked };
}
