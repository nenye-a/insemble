import React, { useState, useReducer } from 'react';
import styled from 'styled-components';
import { useHistory, Redirect } from 'react-router-dom';

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

export default function Onboarding() {
  let [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  let history = useHistory();
  let onNextPress = () => setActiveSegmentIndex(activeSegmentIndex + 1);
  let onBackPress = () => setActiveSegmentIndex(activeSegmentIndex - 1);

  const SEGMENTS = [
    {
      title: 'Let’s confirm your business details.',
      content: ConfirmBusinessDetail,
      buttons: [
        {
          text: 'Not My Address',
          onPress: () => {
            history.push('/');
          },
        },
        {
          text: 'Done',
          onPress: onNextPress,
        },
      ],
    },
    {
      title: 'What are your goals?',
      content: TenantGoals,
      buttons: [
        {
          text: 'Back',
          onPress: onBackPress,
        },
        {
          text: 'Next',
          onPress: onNextPress,
        },
      ],
    },
    {
      title: 'Who are your target customers?',
      content: TenantTargetCustomers,
      buttons: [
        {
          text: 'Back',
          onPress: onBackPress,
        },
        {
          text: 'Next',
          onPress: onNextPress,
        },
      ],
    },
    {
      title: 'What is your physical site criteria?',
      content: TenantPhysicalCriteria,
      buttons: [
        {
          text: 'Back',
          onPress: onBackPress,
        },
        {
          text: 'Next',
          onPress: onNextPress,
        },
      ],
    },
    {
      title: 'Almost Done.',
      content: OnboardingSignUp,
      buttons: [],
    },
  ];

  let Content = SEGMENTS[activeSegmentIndex].content;

  let [state, dispatch] = useReducer(tenantOnboardingReducer, tenantOnboardingInitialState);
  if (!history.location.state.name) {
    <Redirect to="/" />;
  }
  return (
    <Container flex>
      <OnboardingCard
        title={SEGMENTS[activeSegmentIndex].title}
        progress={activeSegmentIndex / SEGMENTS.length}
        canPressNext={state.canPressNext}
        buttons={SEGMENTS[activeSegmentIndex].buttons}
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
