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
import LandlordBilling from '../LandlordBilling';
import UpgradeSuccess from '../Billing/UpgradeSuccess';
import { LandlordTiers } from '../../constants/SubscriptionTiers';

type Param = {
  step: string;
};

export default function ChangeLandlordPlanModal() {
  let params = useParams<Param>();
  let history = useHistory();
  let [selectedStepIndex, setSelectedStepIndex] = useState(0);
  let [planId, setPlanId] = useState('');
  let { spaceId } = history.location.state;
  let { step = 'select-plan' } = params;
  let { data: paymentListData, loading: paymentListLoading } = useQuery<PaymentMethodList>(
    GET_PAYMENT_METHOD_LIST
  );
  let planIdObj = Object.entries(LandlordTiers).find(
    (item) => item[1].monthly.id === planId || item[1].yearly.id === planId
  );
  let isAnnual = planIdObj?.[1].yearly.id === planId;
  let {
    name = '',
    monthly: { price: monthlyPrice = 0 } = {},
    yearly: { price: yearlyPrice = 0 } = {},
  } = (planIdObj && planIdObj[1]) || {};

  const SEGMENTS = [
    {
      title: "Let's confirm  your subscription",
      content: <SelectLandlordPlan onPlanSelect={setPlanId} />,
      path: 'view-plan',
    },
    {
      title: "Let's confirm  your subscription",
      content: (
        <ConfirmLandlordPlanUpgrade
          tierName={name}
          price={isAnnual ? yearlyPrice : monthlyPrice}
          isAnnual={isAnnual}
        />
      ),
      path: 'select-plan',
    },
    {
      title: "Let's confirm  your subscription",
      content: (
        <LandlordBillingInfo
          paymentMethodList={paymentListData?.paymentMethodList || []}
          tierName={name}
          price={isAnnual ? yearlyPrice : monthlyPrice}
          isAnnual={isAnnual}
          spaceId={spaceId}
          planId={planId}
        />
      ),
      path: 'select-payment',
    },
    {
      title: 'Thank You!',
      content: <UpgradeSuccess />,
      path: 'upgrade-success',
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
