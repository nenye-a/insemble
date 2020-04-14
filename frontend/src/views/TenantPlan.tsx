import React, { useState, Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import {
  View,
  SegmentedControl as BaseSegmentedControl,
  LoadingIndicator,
  Button,
  Text,
} from '../core-ui';
import TierSubscriptionCard from './Billing/TierSubscriptionCard';
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
  let history = useHistory();
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
        <BackButton
          mode="transparent"
          text="Back"
          onPress={() => {
            history.goBack();
          }}
        />
        <SegmentedControl
          options={['Monthly', 'Anually']}
          selectedIndex={isAnnual}
          onPress={(index: number) => {
            setIsAnnual(index);
          }}
          style={{ width: 140 }}
        />
        {tenantProfileLoading ? (
          <LoadingIndicator />
        ) : (
          <CardsContainer>
            {Object.values(TenantTiers).map(({ name, monthly, yearly, title, type: tierType }) => {
              let planId = isAnnual ? yearly.id : monthly.id;
              let price = isAnnual ? yearly.price : monthly.price;
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
                  planId={planId}
                  price={price}
                  isUserCurrentTier={tenantProfile?.profileTenant.tier === tierType}
                  onUpgradeButtonPress={() => {
                    history.push('/user/upgrade-plan/confirm-plan', {
                      background: location,
                      planId,
                      tierName: name,
                      price,
                      isAnnual,
                    });
                  }}
                />
              );
            })}
          </CardsContainer>
        )}
      </Container>
    </PlanContextProvider>
  );
}

const Container = styled(View)`
  padding: 33px 15% 0px 15%;
  align-items: center;
`;

const SegmentedControl = styled(BaseSegmentedControl)`
  width: 320px;
`;

const BackButton = styled(Button)`
  align-self: flex-start;
  ${Text} {
    font-style: italic;
  }
`;

const CardsContainer = styled(View)`
  padding: 42px 0;
  flex-direction: row;
`;
