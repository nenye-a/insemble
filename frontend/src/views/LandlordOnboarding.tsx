import React, { useState, useReducer, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, Redirect } from 'react-router-dom';

import { View } from '../core-ui';
import landlordOnboardingReducer, {
  landlordOnboardingInitialState,
} from '../reducers/landlordOnboardingReducer';
import OnboardingCard from './OnboardingPage/OnboardingCard';
import LocationConfirm from './LandlordOnboardingPage/LocationConfirm';
import PropertyConfirm from './LandlordOnboardingPage/PropertyConfirm';
import TenantConfirm from './LandlordOnboardingPage/TenantConfirm';
import LandlordListing from './LandlordOnboardingPage/LandlordListing';
import PreviewListing from './LandlordOnboardingPage/PreviewListing';
import ThankYou from './LandlordOnboardingPage/ThankYou';

type Params = {
  formStep?: string;
};
export default function LandlordOnboarding() {
  let params = useParams<Params>();
  let { formStep } = params;
  let [selectedStep, setSelectedStep] = useState(params.formStep || 'step-1');
  let [state, dispatch] = useReducer(landlordOnboardingReducer, landlordOnboardingInitialState);
  let {
    confirmLocation: { physicalAddress },
  } = state;

  useEffect(() => {
    // putting here as well to avoid blinking
    if (!physicalAddress && formStep !== 'step-1') {
      setSelectedStep('step-1');
    } else {
      setSelectedStep(formStep || 'step-1');
    }
  }, [formStep, physicalAddress]);

  const SEGMENTS = [
    {
      title: 'Let’s confirm your property details.',
      content: PropertyConfirm,
      path: 'step-1',
    },
    {
      title: 'Let’s confirm your property details.',
      content: LocationConfirm,
      path: 'step-2',
    },

    {
      title: 'What types of tenants are you looking for?',
      content: TenantConfirm,
      path: 'step-3',
    },
    {
      title: 'Let’s build your listings!',
      content: LandlordListing,
      path: 'step-4',
    },
    {
      title: 'Preview your listing',
      content: PreviewListing,
      path: 'step-5',
    },
    {
      title: 'Thank You!',
      content: ThankYou,
    },
  ];
  let selectedPage = SEGMENTS.find((item) => item.path === selectedStep) || SEGMENTS[0];

  let Content = selectedPage.content;

  if (!formStep || (!physicalAddress && formStep !== 'step-1')) {
    return <Redirect to="/landlord/new-property/step-1" />;
  }

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
