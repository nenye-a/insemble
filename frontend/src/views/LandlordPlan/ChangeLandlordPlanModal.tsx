import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { Card, Modal, LoadingIndicator } from '../../core-ui';
import { DEFAULT_BORDER_RADIUS, FONT_WEIGHT_NORMAL } from '../../constants/theme';
import ConfirmLandlordPlanUpgrade from './ConfirmLandlordPlanUpgrade';
import { PaymentMethodList } from '../../generated/PaymentMethodList';
import LandlordBillingInfo from './LandlordBillingInfo';
import { GET_PAYMENT_METHOD_LIST } from '../../graphql/queries/server/billing';
import SelectLandlordPlan from './SelectLandlordPlan';

type Param = {
  step: string;
};

export default function ChangeLandlordPlanModal() {
  let params = useParams<Param>();
  let history = useHistory();
  let [selectedStepIndex, setSelectedStepIndex] = useState(0);
  let [planId] = useState(history.location.state.planId);
  let [spaceId] = useState(history.location.state.spaceId);
  let { tierName, price, isAnnual } = history.location.state;
  let { step = 'select-plan' } = params;
  let { data: paymentListData, loading: paymentListLoading } = useQuery<PaymentMethodList>(
    GET_PAYMENT_METHOD_LIST
  );

  const SEGMENTS = [
    {
      title: "Let's confirm  your subscription",
      content: <SelectLandlordPlan />,
      path: 'view-plan',
    },
    {
      title: "Let's confirm  your subscription",
      content: <ConfirmLandlordPlanUpgrade tierName={tierName} price={price} isAnnual={isAnnual} />,
      path: 'select-plan',
    },
    {
      title: "Let's confirm  your subscription",
      content: (
        <LandlordBillingInfo
          paymentMethodList={paymentListData?.paymentMethodList || []}
          tierName={tierName}
          price={price}
          isAnnual={isAnnual}
          spaceId={spaceId}
          planId={planId}
        />
      ),
      path: 'select-payment',
    },
  ];

  let selectedPage = SEGMENTS[selectedStepIndex];

  let Content = selectedPage.content;

  useEffect(() => {
    let foundIndex = SEGMENTS.findIndex(({ path }) => path === step);
    setSelectedStepIndex(foundIndex || 0);
  }, [SEGMENTS, step]);

  return (
    <Container
      visible={true}
      hideCloseButton={true}
      onClose={() => {
        history.push('landlord/billing');
      }}
    >
      <Card
        titleBackground="purple"
        title="Lets confirm your subscription"
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
  );
}

const Container = styled(Modal)`
  border-radius: ${DEFAULT_BORDER_RADIUS};
  width: 750px;
  height: fit-content;
  max-height: 70vh;
`;
