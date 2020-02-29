import React, { useState, useReducer, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory, useParams, Redirect } from 'react-router-dom';

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
  let [activeSegmentIndex, setActiveSegmentIndex] = useState(0);

  let [selectedStep, setSelectedStep] = useState(params.formStep || 'step-1');
  let history = useHistory();
  let [state, dispatch] = useReducer(landlordOnboardingReducer, landlordOnboardingInitialState);

  useEffect(() => {
    setSelectedStep(params.formStep || 'step-1');
  }, [params.formStep]);

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
  let activeSegment = SEGMENTS[activeSegmentIndex];
  let selectedPage;
  switch (selectedStep) {
    case 'step-1': {
      selectedPage = SEGMENTS[0];
      break;
    }
    case 'step-2': {
      selectedPage = SEGMENTS[1];
      break;
    }
    case 'step-3': {
      selectedPage = SEGMENTS[2];
      break;
    }
    case 'step-4': {
      selectedPage = SEGMENTS[3];
      break;
    }
    case 'step-5': {
      selectedPage = SEGMENTS[4];
      break;
    }
    default: {
      selectedPage = SEGMENTS[0];
      break;
    }
  }
  let Content = selectedPage.content;
  console.log(selectedPage, 'CON');
  // if (
  //   (!params?.formStep || params.formStep !== 'step-1') &&
  //   (!history.location.state || !history.location.state)
  // ) {
  //   // TODO: check form state. if empty then should redirect to step-1, else can skip to next step
  //   return <Redirect to="/landlord/new-property/step-1" />;
  // }

  return (
    <Container flex>
      <OnboardingCard
        title={activeSegment.title}
        progress={activeSegmentIndex / SEGMENTS.length}
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
