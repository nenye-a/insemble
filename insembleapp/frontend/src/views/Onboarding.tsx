import React, { useState } from 'react';
import styled from 'styled-components';

import { View } from '../core-ui';
import OnboardingCard from './OnboardingPage/OnboardingCard';
import ConfirmBusinessDetail from './OnboardingPage/ConfirmBusinessDetail';

export default function Onboarding() {
  let [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  let onNextPress = () => setActiveSegmentIndex(activeSegmentIndex + 1);
  let onBackPress = () => setActiveSegmentIndex(activeSegmentIndex - 1);

  const SEGMENTS = [
    {
      title: 'Let’s confirm your business details.',
      content: <ConfirmBusinessDetail />,
      buttons: [
        {
          text: 'Not My Address',
          onPress: () => {},
        },
        {
          text: 'Done',
          onPress: onNextPress,
        },
      ],
    },
    {
      title: 'What are your goals?',
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
    { title: 'Almost Done.' },
  ];
  return (
    <Container flex>
      <OnboardingCard
        title={SEGMENTS[activeSegmentIndex].title}
        progress={activeSegmentIndex + 1 / SEGMENTS.length}
        buttons={SEGMENTS[activeSegmentIndex].buttons}
      >
        {SEGMENTS[activeSegmentIndex].content}
      </OnboardingCard>
    </Container>
  );
}

const Container = styled(View)`
  align-items: center;
  margin: 24px;
`;
