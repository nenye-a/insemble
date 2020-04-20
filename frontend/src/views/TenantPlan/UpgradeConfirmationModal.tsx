import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { Card, Modal, LoadingIndicator } from '../../core-ui';
import ConfirmPlanUpgrade from '../Billing/ConfirmPlanUpgrade';
import EnterBillingInfo from '../Billing/EnterBillingInfo';
import TenantPlan from '../TenantPlan';
import { DEFAULT_BORDER_RADIUS, FONT_WEIGHT_NORMAL } from '../../constants/theme';
import { PaymentMethodList } from '../../generated/PaymentMethodList';
import UpgradeSuccess from '../Billing/UpgradeSuccess';
import { GET_PAYMENT_METHOD_LIST } from '../../graphql/queries/server/billing';

type UpgradeConfirmationModalState = {
  tierName: string;
  price: number;
  isAnnual: boolean;
  planId: string;
};

type Param = {
  step: string;
};
export default function UpgradeConfirmationModal() {
  let [selectedStepIndex, setSelectedStepIndex] = useState(0);
  let history = useHistory<UpgradeConfirmationModalState>();
  let params = useParams<Param>();
  let { step = 'confirm-plan' } = params;
  let { tierName, price, isAnnual, planId } = history.location.state;
  let { data: paymentListData, loading: paymentListLoading } = useQuery<PaymentMethodList>(
    GET_PAYMENT_METHOD_LIST
  );

  const SEGMENTS = [
    {
      title: "Let's confirm  your subscription",
      content: <ConfirmPlanUpgrade tierName={tierName} price={price} isAnnual={isAnnual} />,
      path: 'confirm-plan',
      props: {},
    },
    {
      title: "Let's confirm  your subscription",
      content: (
        <EnterBillingInfo
          paymentMethodList={paymentListData?.paymentMethodList || []}
          tierName={tierName}
          price={price}
          isAnnual={isAnnual}
          planId={planId}
        />
      ),
      path: 'confirm-payment',
    },
    { title: 'Thank You!', content: <UpgradeSuccess />, path: 'upgrade-success' },
  ];

  let selectedPage = SEGMENTS[selectedStepIndex];

  let Content = selectedPage.content;

  useEffect(() => {
    let foundIndex = SEGMENTS.findIndex(({ path }) => path === step);
    setSelectedStepIndex(foundIndex || 0);
  }, [SEGMENTS, step]);

  return (
    <>
      {/* TODO: find a better way to display the modal without hardcoding the component underneath */}
      <TenantPlan />
      <Container
        visible={true}
        hideCloseButton={true}
        onClose={() => {
          history.push('/user/plan');
        }}
        progress={SEGMENTS.indexOf(selectedPage) / SEGMENTS.length}
      >
        <Card
          titleBackground="purple"
          title={selectedPage.title}
          // TODO: make this default Card styling
          titleProps={{
            style: {
              fontWeight: FONT_WEIGHT_NORMAL,
              textAlign: 'center',
            },
          }}
        >
          {paymentListLoading ? <LoadingIndicator /> : Content}
        </Card>
      </Container>
    </>
  );
}

const Container = styled(Modal)`
  border-radius: ${DEFAULT_BORDER_RADIUS};
  width: 750px;
  height: fit-content;
  max-height: 70vh;
`;
