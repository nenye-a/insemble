import React, { useState, useReducer, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useHistory } from 'react-router-dom';

import { View } from '../core-ui';
import landlordAddSpaceReducer, {
  landlordAddSpacelInitialState,
} from '../reducers/landlordAddSpaceReducer';
import OnboardingCard from './OnboardingPage/OnboardingCard';
import AddSpace from './LandlordOnboardingPage/AddSpace';
import PreviewSpace from './LandlordOnboardingPage/PreviewSpace';

type Params = {
  formStep?: string;
};
export default function LandlordAddSpace() {
  let params = useParams<Params>();
  let history = useHistory();
  let { formStep } = params;
  let [selectedStep, setSelectedStep] = useState(params.formStep || 'step-1');
  let [state, dispatch] = useReducer(landlordAddSpaceReducer, landlordAddSpacelInitialState);
  let { address } = history.location.state;

  useEffect(() => {
    // putting here as well to avoid blinking
    if (!address && formStep !== 'step-1') {
      setSelectedStep('step-1');
    } else {
      setSelectedStep(formStep || 'step-1');
    }
  }, [formStep, address]);

  const SEGMENTS = [
    {
      title: 'Let’s build your space.',
      content: AddSpace,
      path: 'step-1',
    },
    {
      title: 'Preview your space.',
      content: PreviewSpace,
      path: 'step-2',
    },
  ];
  let selectedPage = SEGMENTS.find((item) => item.path === selectedStep) || SEGMENTS[0];

  let Content = selectedPage.content;

  return (
    <Container flex>
      <OnboardingCard
        title={selectedPage.title}
        progress={SEGMENTS.indexOf(selectedPage) / SEGMENTS.length}
        canPressNext={state.canPressNext}
      >
        <Content dispatch={dispatch} state={state} />
      </OnboardingCard>
    </Container>
  );
}

const Container = styled(View)`
  align-items: center;
  margin: 24px;
`;
