import React, { useState, useReducer, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory, Redirect, useParams } from 'react-router-dom';

import { View } from '../core-ui';
import OnboardingCard from './OnboardingPage/OnboardingCard';
import ConfirmBusinessDetail from './OnboardingPage/ConfirmBusinessDetail';
import TenantGoals from './OnboardingPage/TenantGoals';
import TenantTargetCustomers from './OnboardingPage/TenantTargetCustomers';
import TenantPhysicalCriteria from './OnboardingPage/TenantPhysicalCriteria';
import OnboardingSignUp from './OnboardingPage/OnboardingSignUp';
import tenantOnboardingReducer, {
  tenantOnboardingInitialState,
} from '../reducers/tenantOnboardingReducer';

type Params = {
  formStep?: string;
};

export default function Onboarding() {
  let params = useParams<Params>();
  let history = useHistory();
  let { state: landingState } = history.location;

  let [selectedStep, setSelectedStep] = useState(params.formStep);
  let [state, dispatch] = useReducer(tenantOnboardingReducer, tenantOnboardingInitialState);

  useEffect(() => {
    if (landingState && !landingState.newPlace) {
      let { name, lat, lng, formattedAddress } = landingState;
      dispatch({
        type: 'SAVE_CHANGES_CONFIRM_BUSINESS_DETAIL',
        values: {
          ...state,
          confirmBusinessDetail: {
            ...state.confirmBusinessDetail,
            name,
            location: {
              lat,
              lng,
              address: formattedAddress,
            },
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.formStep]);

  useEffect(() => {
    setSelectedStep(params.formStep || 'step-1');
  }, [params.formStep]);

  const SEGMENTS = [
    {
      title: 'Let’s confirm your business details.',
      content: ConfirmBusinessDetail,
      path: 'step-1',
    },
    {
      title: 'What are your goals?',
      content: TenantGoals,
      path: 'step-2',
    },
    {
      title: 'Who are your target customers?',
      content: TenantTargetCustomers,
      path: 'step-3',
    },
    {
      title: 'What is your physical site criteria?',
      content: TenantPhysicalCriteria,
      path: 'step-4',
    },
    {
      title: 'Almost Done. Sign up to instantly see your matches.',
      content: OnboardingSignUp,
      path: 'step-5',
    },
  ];

  let selectedPage = SEGMENTS.find((item) => item.path === selectedStep) || SEGMENTS[0];

  let Content = selectedPage.content;
  if (!params?.formStep) {
    return <Redirect to="/verify/step-1" />;
  } else if (!state.confirmBusinessDetail.name && params.formStep !== 'step-1') {
    return <Redirect to="/" />;
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
