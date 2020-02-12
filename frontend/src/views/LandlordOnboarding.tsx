import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { View } from '../core-ui';
import OnboardingCard from './OnboardingPage/OnboardingCard';
import LocationConfirm from './LandlordOnboarding/LocationConfirm';
import PropertyConfirm from './LandlordOnboarding/PropertyConfirm';
import ThankYou from './LandlordOnboarding/ThankYou';

export default function LandlordOnboarding() {
  let [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  let history = useHistory();
  let onNextPress = () => setActiveSegmentIndex(activeSegmentIndex + 1);
  let onBackPress = () => setActiveSegmentIndex(activeSegmentIndex - 1);

  const SEGMENTS = [
    {
      title: 'Let’s confirm your property details.',
      content: <PropertyConfirm />,
      buttons: [
        {
          text: 'Back',
          onPress: () => {
            history.push('/');
          },
        },
        {
          text: 'Next',
          onPress: onNextPress,
        },
      ],
    },
    {
      title: 'Let’s confirm your property details.',
      content: <LocationConfirm />,
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
      title: 'Thank You!',
      content: <ThankYou />,
      buttons: [
        {
          text: 'See Tenants',
          onPress: onNextPress,
        },
      ],
    },
  ];

  return (
    <Container flex>
      <OnboardingCard
        title={SEGMENTS[activeSegmentIndex].title}
        progress={activeSegmentIndex / SEGMENTS.length}
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
