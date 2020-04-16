import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

import { Card, Modal } from '../../core-ui';
import { DEFAULT_BORDER_RADIUS, FONT_WEIGHT_NORMAL } from '../../constants/theme';
import ViewLandlordPlans from './ViewLandlordPlans';
import SelectMultipleLandlordPlans from './SelectMultipleLandlordPlans';

type Param = {
  step: string;
};

export default function ChangeMultipleLandlordPlansModal() {
  let [selectedStepIndex, setSelectedStepIndex] = useState(0);
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
        // navigate to landlord billing
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
        {Content}
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
