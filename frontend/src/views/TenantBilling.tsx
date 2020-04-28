import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useMutation, useQuery, useLazyQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import { SECONDARY_COLOR, THEME_COLOR, WHITE } from '../constants/colors';
import { FONT_SIZE_LARGE, FONT_WEIGHT_BOLD, DEFAULT_BORDER_RADIUS } from '../constants/theme';
import { Button, Card, LoadingIndicator, Text, View, Alert } from '../core-ui';

import { PaymentMethodList } from '../generated/PaymentMethodList';
import {
  GET_PAYMENT_METHOD_LIST,
  CANCEL_TENANT_SUBSCRIPTION,
} from '../graphql/queries/server/billing';

import { GET_TENANT_PROFILE } from '../graphql/queries/server/profile';
import { GetTenantProfile } from '../generated/GetTenantProfile';
import { TenantTier } from '../generated/globalTypes';
import { Popup } from '../components';
import { CancelTenantSubcription } from '../generated/CancelTenantSubcription';
import { GetBrands } from '../generated/GetBrands';
import { GET_BRANDS } from '../graphql/queries/server/brand';
import { BillingContextProvider } from '../utils/billing';
import { BillingSummaryTable, CreditCardTable } from '../components/plan';
import formatDate from '../utils/formatDate';

export default function TenantBilling() {
  let [cancelPlanVisible, setCancelPlanVisible] = useState(false);
  let [lastBill, setLastBill] = useState('');

  let [cancelPlan, { error: cancelPlanError, loading: cancelPlanLoading }] = useMutation<
    CancelTenantSubcription
  >(CANCEL_TENANT_SUBSCRIPTION, {
    onCompleted: (result) => {
      if (result.cancelTenantSubscription) {
        setLastBill(formatDate(new Date(result.cancelTenantSubscription)));
      }
    },
  });

  let [getBrand] = useLazyQuery<GetBrands>(GET_BRANDS, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data.brands.length > 0) {
        let { id } = data.brands[0];
        history.push(`/map/${id}`);
      } else {
        history.push('/user/brands');
      }
    },
  });

  let { refetch: refetchPaymentList } = useQuery<PaymentMethodList>(GET_PAYMENT_METHOD_LIST);
  let { data: tenantProfile, loading: tenantProfileLoading } = useQuery<GetTenantProfile>(
    GET_TENANT_PROFILE
  );

  let errorMessage = cancelPlanError?.message || '';
  let history = useHistory();
  return (
    <BillingContextProvider value={{ refetchPaymentList }}>
      <Container flex>
        <Title>{`Billing & Plans`}</Title>
        <BillingAlert
          text="Upgrading your account may take up to 1 minute. Please refresh this page later."
          visible={
            history.location.state &&
            history.location.state?.from === 'TenantPlanList' &&
            history.location.state?.isTierUpgradeSuccess
          }
        />
        <BillingAlert text={errorMessage} visible={!!errorMessage} />
        <TierSection
          currentTier={tenantProfile?.profileTenant.tier}
          loading={tenantProfileLoading || cancelPlanLoading}
          onCancel={() => setCancelPlanVisible(true)}
        />
        <BillingSummaryTable />
        <CreditCardTable />
      </Container>
      <Popup
        visible={cancelPlanVisible}
        title="Subscription Cancellation"
        bodyText={
          lastBill
            ? `Cancellation Successful. Your last bill will be on ${lastBill}`
            : 'Are you sure you want to cancel your professional subscription? You will lose access to all professional features.'
        }
        buttons={
          lastBill
            ? [{ text: 'Home', onPress: () => getBrand() }]
            : [
                {
                  text: 'Cancel',
                  onPress: () => {
                    cancelPlan();
                    setCancelPlanVisible(false);
                  },
                },
                {
                  text: 'Keep Pro Features',
                  onPress: () => setCancelPlanVisible(false),
                },
              ]
        }
      />
    </BillingContextProvider>
  );
}

type TierSectionProps = { currentTier?: TenantTier; loading: boolean; onCancel: () => void };

function TierSection({ currentTier, loading, onCancel }: TierSectionProps) {
  let history = useHistory();
  let onPlanButtonClick = useCallback(() => {
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
        {currentTier === TenantTier.FREE ? (
          <UpgradePlanButton text="Upgrade Plan" onPress={onPlanButtonClick} />
        ) : (
          <Row>
            <Button text="Cancel Plan" onPress={onCancel} mode="withShadow" />
            <SeePlanButton text="See Plan" onPress={onPlanButtonClick} />
          </Row>
        )}
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
  border-radius: ${DEFAULT_BORDER_RADIUS};
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
  padding: 8px 32px;
`;

const Row = styled(View)`
  flex-direction: row;
`;

const SeePlanButton = styled(Button)`
  padding: 8px 32px;
  margin-left: 12px;
`;

const BillingAlert = styled(Alert)`
  margin-bottom: 8px;
`;
