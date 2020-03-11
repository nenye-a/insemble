import React from 'react';
import styled from 'styled-components';
import { View, Text, Button } from '../../core-ui';
import { FONT_WEIGHT_HEAVY, FONT_SIZE_LARGE } from '../../constants/theme';

export default function SpeedUpLeasing() {
  return (
    <Container>
      <CenteredText fontSize="32px" fontWeight={FONT_WEIGHT_HEAVY}>
        Speed up your leasing
      </CenteredText>
      <CenteredText fontSize="20px" style={{ marginTop: 32, marginBottom: 32 }}>
        At Insemble, we believe in helping you open the best stores as fast as possible. We start by
        giving custom market insights, and followup with properties that work best for you.
      </CenteredText>
      <FindLocationsButton
        text="Find Locations"
        textProps={{ fontSize: FONT_SIZE_LARGE }}
        onPress={() =>
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          })
        }
      />
    </Container>
  );
}

const Container = styled(View)`
  justify-content: center;
  align-items: center;
  padding: 75px 20%;
`;

const CenteredText = styled(Text)`
  text-align: center;
`;

const FindLocationsButton = styled(Button)`
  border-radius: 20px;
  padding: 0 10%;
  height: 40px;
`;
