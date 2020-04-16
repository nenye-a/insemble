import React from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/react-hooks';

import { Text, Button, RadioButton } from '../../core-ui';
import DataTable from '../DataTable';
import { DARK_TEXT_COLOR, SECONDARY_COLOR } from '../../constants/colors';
import { PaymentMethodList } from '../../generated/PaymentMethodList';

import {
  RemovePaymentMethod,
  RemovePaymentMethodVariables,
} from '../../generated/RemovePaymentMethod';
import {
  REMOVE_PAYMENT_METHOD,
  CHANGE_DEFAULT_PAYMENT_METHOD,
} from '../../graphql/queries/server/billing';
import {
  ChangeDefaultPaymentMethod,
  ChangeDefaultPaymentMethodVariables,
} from '../../generated/ChangeDefaultPaymentMethod';
import { useBillingContext } from '../../utils/billing';

type PaymentMethodRowProps = PaymentMethodList['paymentMethodList'][0];

export default function PaymentMethodRow(props: PaymentMethodRowProps) {
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
        <RowText>Card ending in **{lastFourDigits}</RowText>
      </DataTable.Cell>
      <DataTable.Cell>
        <RowText>
          {String(expMonth).padStart(2, '0')}/{String(expYear).slice(2)}
        </RowText>
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

const RowText = styled(Text)`
  color: ${DARK_TEXT_COLOR};
`;

const DeleteButton = styled(Button)`
  ${Text} {
    color: ${SECONDARY_COLOR};
  }
`;

const DefaultPaymentRadioButton = styled(RadioButton)`
  margin-left: 12px;
`;
