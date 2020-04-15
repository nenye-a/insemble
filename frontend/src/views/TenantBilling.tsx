import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import { SECONDARY_COLOR, THEME_COLOR, WHITE } from '../constants/colors';
import { FONT_SIZE_LARGE, FONT_WEIGHT_BOLD } from '../constants/theme';
import { Button, Card, LoadingIndicator, Text, View, Alert } from '../core-ui';

import { PaymentMethodList } from '../generated/PaymentMethodList';

import { BillingList } from '../generated/BillingList';
import { GET_BILLING_LIST, GET_PAYMENT_METHOD_LIST } from '../graphql/queries/server/billing';

import { GET_TENANT_PROFILE } from '../graphql/queries/server/profile';
import { GetTenantProfile } from '../generated/GetTenantProfile';
import { TenantTier } from '../generated/globalTypes';
import { BillingSummaryTable, CreditCardTable } from '../components/plan';
import { BillingContextProvider } from '../constants/billing';

export default function TenantBilling() {
  let { data: billingListData, loading: billingListLoading } = useQuery<BillingList>(
    GET_BILLING_LIST,
    {
      variables: {
        status: 'paid',
      },
    }
  );
  let {
    data: paymentListData,
    loading: paymentListLoading,
    refetch: refetchPaymentList,
  } = useQuery<PaymentMethodList>(GET_PAYMENT_METHOD_LIST);
  let { data: tenantProfile, loading: tenantProfileLoading } = useQuery<GetTenantProfile>(
    GET_TENANT_PROFILE
  );

  let history = useHistory();
  return (
    <BillingContextProvider value={{ refetchPaymentList }}>
      <Container flex>
        <Title>{`Billing & Plans`}</Title>
        <Alert
          text="Upgrading your account may take up to 1 minute. Please refresh this page later."
          visible={
            history.location.state &&
            history.location.state?.from === 'TenantPlanList' &&
            history.location.state?.isTierUpgradeSuccess
          }
          style={{ marginBottom: 8 }}
        />
        <TierSection
          currentTier={tenantProfile?.profileTenant.tier}
          loading={tenantProfileLoading}
        />
        <BillingSummaryTable loading={billingListLoading} billingData={billingListData} />
        <CreditCardTable loading={paymentListLoading} paymentData={paymentListData} />
      </Container>
    </BillingContextProvider>
  );
}

type TierSectionProps = { currentTier?: TenantTier; loading: boolean };

function TierSection({ currentTier, loading }: TierSectionProps) {
  let history = useHistory();
  let onUpgradePlanButtonClick = useCallback(() => {
    history.push('/user/plan');
  }, [history]);

  return (
    <View>
      <SectionTitle>Account Tier</SectionTitle>
      <TierSectionCard>
        {/* TODO: Handle if tenantProfile is undefined */}
        {loading || !currentTier ? (
          <LoadingIndicator />
        ) : (
          <Text>
            Your current account tier is <Text fontWeight="bold">{currentTier}</Text>
          </Text>
        )}
        <UpgradePlanButton text="Upgrade Plan" onPress={onUpgradePlanButtonClick} />
      </TierSectionCard>
    </View>
  );
}

const Container = styled(Card)`
  padding: 24px;
  padding-top: 12px;
`;

const Title = styled(Text)`
  color: ${THEME_COLOR};
  font-weight: ${FONT_WEIGHT_BOLD};
  font-size: ${FONT_SIZE_LARGE};
  margin: 12px 0;
`;

const SectionCard = styled(View)`
  margin-bottom: 30px;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
  background-color: ${WHITE};
`;

const SectionTitle = styled(Text)`
  color: ${SECONDARY_COLOR};
  margin-bottom: 6px;
`;

let TierSectionCard = styled(SectionCard)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

let UpgradePlanButton = styled(Button)`
  padding: '8px 32px';
`;
