import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';

import { View } from '../../core-ui';

import { PaymentMethodList } from '../../generated/PaymentMethodList';
import { GET_PAYMENT_METHOD_LIST } from '../../graphql/queries/server/billing';
import { BillingSummaryTable, CreditCardTable } from '../../components/plan';
import { BillingContextProvider } from '../../utils/billing';

export default function LandlordBillingSummary() {
  let { refetch: refetchPaymentList } = useQuery<PaymentMethodList>(GET_PAYMENT_METHOD_LIST);

  return (
    <BillingContextProvider value={{ refetchPaymentList }}>
      <Container flex>
        <BillingSummaryTable />
        <CreditCardTable />
      </Container>
    </BillingContextProvider>
  );
}

const Container = styled(View)`
  padding-top: 20px;
`;
