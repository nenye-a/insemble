import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useHistory } from 'react-router-dom';

import { Card, Modal } from '../../core-ui';
import { DEFAULT_BORDER_RADIUS } from '../../constants/theme';
import ViewLandlordPlans from './ViewLandlordPlans';
import SelectMultipleLandlordPlans from './SelectMultipleLandlordPlans';
import ConfirmChangeMultiplePlans from './ConfirmChangeMultiplePlans';
import ChangeMultipleLandlordPlansBillingInfo from './ChangeMultipleLandlordPlansBillingInfo';
import LandlordBilling from '../LandlordBilling';
import { SUBSCRIPTIONS } from '../../fixtures/dummyData';

type Param = {
  step: string;
};

export default function ChangeMultipleLandlordPlansModal() {
  let [selectedStepIndex, setSelectedStepIndex] = useState(0);
  let history = useHistory();
  let params = useParams<Param>();
  let { step = 'view-plans' } = params;

  const SEGMENTS = [
    {
      title: "Let's confirm  your subscription",
      content: <ViewLandlordPlans />,
      path: 'view-plans',
    },
    {
      title: "Let's confirm your subscription",
      content: <SelectMultipleLandlordPlans />,
      path: 'select-plans',
    },
    {
      title: "Let's confirm your subscription",
      content: <ConfirmChangeMultiplePlans plans={SUBSCRIPTIONS} />,
      path: 'confirm-plans',
    },
    {
      title: "Let's confirm your subscription",
      content: (
        <ChangeMultipleLandlordPlansBillingInfo plans={SUBSCRIPTIONS} paymentMethodList={[]} />
      ),
      path: 'confirm-payment',
    },
  ];

  let selectedPage = SEGMENTS[selectedStepIndex];

  let Content = selectedPage.content;

  useEffect(() => {
    let foundIndex = SEGMENTS.findIndex(({ path }) => path === step);
    setSelectedStepIndex(foundIndex || 0);
  }, [SEGMENTS, step]);

  return (
    <>
      <LandlordBilling />
      <Container
        visible={true}
        hideCloseButton={true}
        onClose={() => {
          history.push('/landlord/billing');
        }}
      >
        <Card
          mode="secondary"
          title="Lets confirm your subscription"
          titleContainerProps={{ style: { height: 42 } }}
        >
          {Content}
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
