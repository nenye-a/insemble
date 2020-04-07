import React, { useState, Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';

import { View, SegmentedControl as BaseSegmentedControl, LoadingIndicator } from '../core-ui';
import TierSubscriptionCard from './TenantPlan/TierSubscriptionCard';
import { TenantTiers } from '../constants/SubscriptionTiers';
import createContext from '../utils/createContext';
import { GET_TENANT_PROFILE } from '../graphql/queries/server/profile';
import { GetTenantProfile } from '../generated/GetTenantProfile';

type PlanCtx = {
  selectedPaymentMethodId: string | null;
  setSelectedPaymentMethod: Dispatch<SetStateAction<string | null>>;
};

export let [usePlanContext, PlanContextProvider] = createContext<PlanCtx>();
export default function TenantPlan() {
  let [isAnnual, setIsAnnual] = useState(0);
  let [selectedPaymentMethodId, setSelectedPaymentMethod] = useState<
    PlanCtx['selectedPaymentMethodId']
  >(null);
  let { data: tenantProfile, loading: tenantProfileLoading } = useQuery<GetTenantProfile>(
    GET_TENANT_PROFILE
  );

  return (
    <PlanContextProvider value={{ selectedPaymentMethodId, setSelectedPaymentMethod }}>
      <Container>
        <SegmentedControl
          options={['Monthly', 'Anually']}
          selectedIndex={isAnnual}
          onPress={(index: number) => {
            setIsAnnual(index);
          }}
        />
        {tenantProfileLoading ? (
          <LoadingIndicator />
        ) : (
          <View style={{ flexDirection: 'row', padding: 23 }}>
            {Object.values(TenantTiers).map(({ name, monthly, yearly, title, type: tierType }) => {
              return (
                <TierSubscriptionCard
                  key={isAnnual ? yearly.id : monthly.id}
                  title={title}
                  tierName={name}
                  benefits={[
                    'Access matching locations and properties',
                    'Connect with property managers & reps',
                    'Compare prospective sites to existing stores',
                    'See high level location match details',
                  ]}
                  isAnnual={!!isAnnual}
                  onPress={() => {}}
                  planId={isAnnual ? yearly.id : monthly.id}
                  price={isAnnual ? yearly.price : monthly.price}
                  isUserCurrentTier={tenantProfile?.profileTenant.tier === tierType}
                />
              );
            })}
          </View>
        )}
      </Container>
    </PlanContextProvider>
  );
}

const Container = styled(View)`
  padding: 33px 221px 0px 221px;
  align-items: center;
`;

const SegmentedControl = styled(BaseSegmentedControl)`
  width: 320px;
`;
