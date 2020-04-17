import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';

import { LoadingIndicator, Text } from '../../core-ui';
import DataTable from '../DataTable';
import { BillingList, BillingListVariables } from '../../generated/BillingList';
import { SECONDARY_COLOR } from '../../constants/colors';
import BillingRow from './BillingRow';
import { GET_BILLING_LIST } from '../../graphql/queries/server/billing';
import { BillingStatus } from '../../generated/globalTypes';

export default function BillingSummaryTable() {
  let { data: billingListData, loading: billingListLoading } = useQuery<
    BillingList,
    BillingListVariables
  >(GET_BILLING_LIST, {
    variables: {
      status: BillingStatus.paid,
    },
  });

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
        {billingListLoading ? (
          <LoadingIndicator />
        ) : (
          billingListData?.billingList.map((b) => <BillingRow key={b.id} {...b} />)
        )}
      </DataTable>
    </>
  );
}

const SectionTitle = styled(Text)`
  color: ${SECONDARY_COLOR};
  margin-bottom: 6px;
`;
