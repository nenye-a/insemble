import React from 'react';
import styled from 'styled-components';

import { Text } from '../../core-ui';
import DataTable from '../DataTable';
import { BillingList } from '../../generated/BillingList';
import formatDate from '../../utils/formatDate';
import { DEFAULT_LOCALE } from '../../constants/i18n';
import { DARK_TEXT_COLOR } from '../../constants/colors';

type BillingRowProps = BillingList['billingList'][0];

export default function BillingRow(props: BillingRowProps) {
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
        <RowText>{paidDate}</RowText>
      </DataTable.Cell>
      <DataTable.Cell width={260}>
        <RowText>{detail}</RowText>
      </DataTable.Cell>
      <DataTable.Cell>
        <RowText>Card ending in **{paymentMethod?.lastFourDigits}</RowText>
      </DataTable.Cell>
      <DataTable.Cell width={140} align="right">
        <RowText>${amountPaid.toFixed(2)}</RowText>
      </DataTable.Cell>
    </DataTable.Row>
  );
}

const RowText = styled(Text)`
  color: ${DARK_TEXT_COLOR};
`;
