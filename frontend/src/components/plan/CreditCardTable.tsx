import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';

import { LoadingIndicator, Text, View } from '../../core-ui';
import DataTable from '../DataTable';
import { SECONDARY_COLOR } from '../../constants/colors';
import { PaymentMethodList } from '../../generated/PaymentMethodList';
import AddNewCard from '../../views/TenantBilling/AddNewCard';

import PaymentMethodRow from './PaymentMethodRow';
import { GET_PAYMENT_METHOD_LIST } from '../../graphql/queries/server/billing';

export default function CreditCardTable() {
  let { data: paymentListData, loading: paymentListLoading } = useQuery<PaymentMethodList>(
    GET_PAYMENT_METHOD_LIST
  );
  return (
    <>
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
    </>
  );
}

const SectionTitle = styled(Text)`
  color: ${SECONDARY_COLOR};
  margin-bottom: 6px;
`;

const SectionTitleContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
`;
