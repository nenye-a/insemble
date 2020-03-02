import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import DataTable from '../components/DataTable';
import { SECONDARY_COLOR, THEME_COLOR, WHITE } from '../constants/colors';
import { DEFAULT_LOCALE } from '../constants/i18n';
import { FONT_SIZE_LARGE, FONT_WEIGHT_BOLD } from '../constants/theme';
import { Button, Card, LoadingIndicator, RadioButton, Text, View, Alert } from '../core-ui';

import { PaymentMethodList } from '../generated/PaymentMethodList';
import {
  RemovePaymentMethod,
  RemovePaymentMethodVariables,
} from '../generated/RemovePaymentMethod';
import { BillingList } from '../generated/BillingList';
import {
  GET_BILLING_LIST,
  GET_PAYMENT_METHOD_LIST,
  REMOVE_PAYMENT_METHOD,
  CHANGE_DEFAULT_PAYMENT_METHOD,
} from '../graphql/queries/server/billing';
import createContext from '../utils/createContext';
import formatDate from '../utils/formatDate';
import AddNewCard from './TenantBilling/AddNewCard';
import { GET_TENANT_PROFILE } from '../graphql/queries/server/profile';
import { GetTenantProfile } from '../generated/GetTenantProfile';
import { TenantTier } from '../generated/globalTypes';
import {
  ChangeDefaultPaymentMethod,
  ChangeDefaultPaymentMethodVariables,
} from '../generated/ChangeDefaultPaymentMethod';

type BillingCtx = {
  refetchPaymentList: () => Promise<unknown>;
};

export let [useBillingContext, BillingContextProvider] = createContext<BillingCtx>();

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
        <SectionTitle>Billing Summary</SectionTitle>
        <DataTable>
          <DataTable.HeaderRow>
            <DataTable.HeaderCell width={160}>Date Posted</DataTable.HeaderCell>
            <DataTable.HeaderCell width={260}>Description</DataTable.HeaderCell>
            <DataTable.HeaderCell>Method</DataTable.HeaderCell>
            <DataTable.HeaderCell width={140} align="right">
              Total Amount
            </DataTable.HeaderCell>
          </DataTable.HeaderRow>
          {billingListLoading ? (
            <LoadingIndicator />
          ) : (
            billingListData?.billingList.map((b) => <BillingRow key={b.id} {...b} />)
          )}
        </DataTable>
        <SectionTitleContainer>
          <SectionTitle>Credit Cards</SectionTitle>
          <AddNewCard />
        </SectionTitleContainer>
        <DataTable>
          <DataTable.HeaderRow>
            <DataTable.HeaderCell width={130}>Primary</DataTable.HeaderCell>
            <DataTable.HeaderCell>Card Number</DataTable.HeaderCell>
            <DataTable.HeaderCell>Expiration</DataTable.HeaderCell>
            <DataTable.HeaderCell width={100} align="right" />
          </DataTable.HeaderRow>
          {paymentListLoading ? (
            <LoadingIndicator />
          ) : (
            paymentListData?.paymentMethodList.map((p) => <PaymentMethodRow key={p.id} {...p} />)
          )}
        </DataTable>
      </Container>
    </BillingContextProvider>
  );
}

type BillingRowProps = BillingList['billingList'][0];

function BillingRow(props: BillingRowProps) {
  let { statusTransition, paymentMethod, subscription, amountPaid } = props;

  let paidDate =
    typeof statusTransition.paidAt === 'number'
      ? formatDate(new Date(statusTransition.paidAt))
      : '-';
  let subscriptionStartDate = subscription ? new Date(subscription.currentPeriodStart) : null;
  let detail = subscriptionStartDate
    ? `Active Plan ${subscriptionStartDate.toLocaleDateString(DEFAULT_LOCALE, {
        month: 'long',
      })} Fee`
    : '-';

  return (
    <DataTable.Row>
      <DataTable.Cell width={160}>
        <Text>{paidDate}</Text>
      </DataTable.Cell>
      <DataTable.Cell width={260}>
        <Text>{detail}</Text>
      </DataTable.Cell>
      <DataTable.Cell>
        <Text>Card ending in **{paymentMethod?.lastFourDigits}</Text>
      </DataTable.Cell>
      <DataTable.Cell width={140} align="right">
        <Text>${amountPaid.toFixed(2)}</Text>
      </DataTable.Cell>
    </DataTable.Row>
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

type PaymentMethodRowProps = PaymentMethodList['paymentMethodList'][0];

function PaymentMethodRow(props: PaymentMethodRowProps) {
  let { id, lastFourDigits, expMonth, expYear, isDefault } = props;
  let { refetchPaymentList } = useBillingContext();
  let [removePaymentMethod, { loading }] = useMutation<
    RemovePaymentMethod,
    RemovePaymentMethodVariables
  >(REMOVE_PAYMENT_METHOD);
  let [changeDefaultPaymentMethod, { loading: changeDefaultLoading }] = useMutation<
    ChangeDefaultPaymentMethod,
    ChangeDefaultPaymentMethodVariables
  >(CHANGE_DEFAULT_PAYMENT_METHOD);
  return (
    <DataTable.Row>
      <DataTable.Cell width={130}>
        <DefaultPaymentRadioButton
          name="primary"
          title=""
          isSelected={isDefault}
          onPress={async () => {
            if (isDefault || changeDefaultLoading) {
              return;
            }
            await changeDefaultPaymentMethod({
              variables: {
                paymentMethodId: id,
              },
              refetchQueries: ['PaymentMethodList'],
            });
          }}
        />
      </DataTable.Cell>
      <DataTable.Cell>
        <Text>Card ending in **{lastFourDigits}</Text>
      </DataTable.Cell>
      <DataTable.Cell>
        <Text>
          {String(expMonth).padStart(2, '0')}/{String(expYear).slice(2)}
        </Text>
      </DataTable.Cell>
      <DataTable.Cell width={100} align="center">
        <DeleteButton
          mode="transparent"
          text="Delete"
          onPress={async () => {
            await removePaymentMethod({
              variables: {
                paymentMethodId: id,
              },
            });
            await refetchPaymentList();
          }}
          loading={loading}
        />
      </DataTable.Cell>
    </DataTable.Row>
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

const SectionTitleContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
`;

const SectionTitle = styled(Text)`
  color: ${SECONDARY_COLOR};
  margin-bottom: 6px;
`;

const DeleteButton = styled(Button)`
  ${Text} {
    color: ${SECONDARY_COLOR};
  }
`;

const DefaultPaymentRadioButton = styled(RadioButton)`
  margin-left: 12px;
`;
let TierSectionCard = styled(SectionCard)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

let UpgradePlanButton = styled(Button)`
  padding: '8px 32px';
`;
