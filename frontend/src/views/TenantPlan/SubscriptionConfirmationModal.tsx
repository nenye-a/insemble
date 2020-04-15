import React from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import { Text, Button, Modal, RadioButton, View } from '../../core-ui';
import DataTable from '../../components/DataTable';
import CardContainer from './CardContainer';

import getUnit from '../Billing/helpers/getUnit';
import { usePlanContext } from '../TenantPlan';

import { WHITE, THEME_COLOR } from '../../constants/colors';
import {
  FONT_WEIGHT_BOLD,
  FONT_SIZE_MEDIUM,
  FONT_SIZE_LARGE,
  FONT_WEIGHT_MEDIUM,
  FONT_WEIGHT_LIGHT,
  FONT_SIZE_XLARGE,
} from '../../constants/theme';

import { GET_BILLING_LIST } from '../../graphql/queries/server/billing';
import { CREATE_PLAN_SUBSCRIPTION } from '../..DELETED_BASE64_STRING';
import { PaymentMethodList } from '../../generated/PaymentMethodList';
import {
  CreateTenantPlanSubscription,
  CreateTenantPlanSubscriptionVariables,
} from '../../generated/CreateTenantPlanSubscription';

type Props = {
  tierName: string;
  price: number;
  isAnnual: boolean;
  isVisible: boolean;
  planId: string;
  paymentMethodList: PaymentMethodList['paymentMethodList'];
  onClose: () => void;
};

export default function SubscriptionConfirmationModal({
  tierName,
  isVisible,
  onClose,
  price,
  isAnnual,
  planId,
  paymentMethodList,
}: Props) {
  let [createPlanSubscription, { loading: createPlanSubscriptionLoading }] = useMutation<
    CreateTenantPlanSubscription,
    CreateTenantPlanSubscriptionVariables
  >(CREATE_PLAN_SUBSCRIPTION, {
    refetchQueries: [
      {
        query: GET_BILLING_LIST,
        variables: {
          status: 'paid',
        },
      },
    ],
    awaitRefetchQueries: true,
  });
  let history = useHistory<{
    from: 'TenantPlanList';
    isTierUpgradeSuccess: boolean;
  }>();
  let { selectedPaymentMethodId, setSelectedPaymentMethod } = usePlanContext();

  let onUpgradeButtonClick = async () => {
    await createPlanSubscription({
      variables: {
        planId,
        paymentMethodId: selectedPaymentMethodId,
      },
    });

    history.replace('/user/billing', {
      from: 'TenantPlanList',
      isTierUpgradeSuccess: true,
    });
  };

  return (
    <ConfirmationModalContainer visible={isVisible} onClose={onClose} hideCloseButton={true}>
      <CardContainer title="Confirmation">
        <PlanModalContentContainer>
          <PlanModalContentTitle>Confirm Plan Upgrade</PlanModalContentTitle>
          <PlanNameText>{tierName}</PlanNameText>
          <PriceText>
            ${price}
            <Text>/{getUnit(isAnnual)}</Text>
          </PriceText>
          <View style={{ marginBottom: 16 }}>
            <DataTable>
              <DataTable.HeaderRow>
                <DataTable.HeaderCell width={50} />
                <DataTable.HeaderCell>Card Number</DataTable.HeaderCell>
              </DataTable.HeaderRow>
              {paymentMethodList.map((p) => (
                <SubscriptionPaymentMethodRow
                  key={p.id}
                  {...p}
                  isSelected={
                    selectedPaymentMethodId != null ? selectedPaymentMethodId === p.id : p.isDefault
                  }
                  onRadioButtonPress={() => {
                    setSelectedPaymentMethod(p.id);
                  }}
                />
              ))}
            </DataTable>
          </View>
          <UpgradeButton
            text="Upgrade"
            onPress={onUpgradeButtonClick}
            loading={createPlanSubscriptionLoading}
            disabled={!selectedPaymentMethodId}
          />
        </PlanModalContentContainer>
      </CardContainer>
    </ConfirmationModalContainer>
  );
}

type PaymentMethodRowProps = PaymentMethodList['paymentMethodList'][0] & {
  isSelected: boolean;
  onRadioButtonPress: () => void;
};

function SubscriptionPaymentMethodRow(props: PaymentMethodRowProps) {
  let { lastFourDigits, isSelected, onRadioButtonPress } = props;
  return (
    <DataTable.Row>
      <DataTable.Cell width={50}>
        <RadioButton name="primary" title="" isSelected={isSelected} onPress={onRadioButtonPress} />
      </DataTable.Cell>
      <DataTable.Cell>
        <Text> **{lastFourDigits}</Text>
      </DataTable.Cell>
    </DataTable.Row>
  );
}

let PlanModalContentContainer = styled(Text)`
  flex-direction: column;
  display: flex;
  align-items: center;
  text-align: center;
  padding: 16px 58px;
  background-color: ${WHITE};
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;

let PlanModalContentTitle = styled(Text)`
  font-size: ${FONT_SIZE_LARGE};
  margin-bottom: 14px;
  font-weight: ${FONT_WEIGHT_LIGHT};
`;

let ConfirmationModalContainer = styled(Modal)`
  width: fit-content;
  height: fit-content;
  border-radius: 5px;
`;

let PlanNameText = styled(Text)`
  font-size: ${FONT_SIZE_XLARGE};
  color: ${THEME_COLOR};
  font-weight: ${FONT_WEIGHT_BOLD};
  margin-bottom: 8px;
`;

let PriceText = styled(Text)`
  font-size: ${FONT_SIZE_MEDIUM};
  font-weight: ${FONT_WEIGHT_MEDIUM};
  margin-bottom: 21px;
`;

let UpgradeButton = styled(Button)`
  font-size: ${FONT_SIZE_MEDIUM};
  width: 100%;
  margin-bottom: 8px;
`;
