import React from 'react';
import styled from 'styled-components';

import { LoadingIndicator, Text } from '../../core-ui';
import DataTable from '../DataTable';
import { BillingList } from '../../generated/BillingList';
import { SECONDARY_COLOR } from '../../constants/colors';
import BillingRow from './BillingRow';

type Props = {
  loading: boolean;
  billingData?: BillingList;
};

export default function BillingSummaryTable({ loading, billingData }: Props) {
  return (
    <>
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
        {loading ? (
          <LoadingIndicator />
        ) : (
          billingData?.billingList.map((b) => <BillingRow key={b.id} {...b} />)
        )}
      </DataTable>
    </>
  );
}

const SectionTitle = styled(Text)`
  color: ${SECONDARY_COLOR};
  margin-bottom: 6px;
`;
