import React from 'react';
import styled from 'styled-components';

import DataTable from '../../components/DataTable';
import { Text, RadioButton } from '../../core-ui';
import { PaymentMethodList_paymentMethodList as PaymentMethodList } from '../../generated/PaymentMethodList';
import { FONT_WEIGHT_LIGHT } from '../../constants/theme';

type Props = {
  paymentMethodList: Array<PaymentMethodList>;
};

export default function CreditCardTable(props: Props) {
  let { paymentMethodList } = props;
  return (
    <DataTable>
      <DataTable.HeaderRow>
        <DataTable.HeaderCell width={130}>Primary</DataTable.HeaderCell>
        <DataTable.HeaderCell width={200}>Card Number</DataTable.HeaderCell>
        <DataTable.HeaderCell>Expiration</DataTable.HeaderCell>
      </DataTable.HeaderRow>
      {paymentMethodList.map((p) => (
        <PaymentMethodRow key={p.id} {...p} />
      ))}
    </DataTable>
  );
}

function PaymentMethodRow(props: PaymentMethodList) {
  let { lastFourDigits, expMonth, expYear, isDefault } = props;
  return (
    <DataTable.Row>
      <DataTable.Cell width={130}>
        <DefaultPaymentRadioButton
          name="primary"
          title=""
          isSelected={isDefault}
          onPress={() => {}}
        />
      </DataTable.Cell>
      <DataTable.Cell width={200}>
        <Text fontWeight={FONT_WEIGHT_LIGHT}>Card ending in **{lastFourDigits}</Text>
      </DataTable.Cell>
      <DataTable.Cell>
        <Text fontWeight={FONT_WEIGHT_LIGHT}>
          {String(expMonth).padStart(2, '0')}/{String(expYear).slice(2)}
        </Text>
      </DataTable.Cell>
    </DataTable.Row>
  );
}

const DefaultPaymentRadioButton = styled(RadioButton)`
  margin-left: 12px;
`;
