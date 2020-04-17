import React from 'react';
import styled from 'styled-components';
import { View, Button, Text } from '../../core-ui';
import CardFooter from '../../components/layout/OnboardingFooter';
import { FONT_SIZE_LARGE, FONT_WEIGHT_LIGHT } from '../../constants/theme';
import { DARK_TEXT_COLOR } from '../../constants/colors';

export default function ChangeMultipleLandlordPlansUpgradeSuccess() {
  return (
    <>
      <Container>
        <Title>Your Plan is Updated!</Title>
        <Text color={DARK_TEXT_COLOR}>Congratulations! You’ve successfully updated your plan.</Text>
      </Container>
      <CardFooter>
        <Button text="Spaces" />
      </CardFooter>
    </>
  );
}

const Container = styled(View)`
  padding: 12px 24px;
  align-items: center;
  height: 330px;
`;

const Title = styled(Text)`
  font-size: ${FONT_SIZE_LARGE};
  font-weight: ${FONT_WEIGHT_LIGHT};
  padding: 12px 0;
`;
