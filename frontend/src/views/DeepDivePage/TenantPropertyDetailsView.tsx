import React from 'react';
import styled from 'styled-components';

import { View, Card, Text } from '../../core-ui';
import DemographicCard from '../../core-ui/Demographics';
import { CONSUMER_PERSONAS } from '../../fixtures/dummyData';
import RelevantConsumerCard from './RelevantConsumerCard';
import { LIGHTEST_GREY } from '../../constants/colors';
import { FONT_SIZE_MEDIUM, FONT_WEIGHT_BOLD } from '../../constants/theme';
import TenantKeyFacts from './TenantKeyFacts';

export default function TenantPropertyDetailsView() {
  return (
    <View>
      <Container>
        <TenantKeyFacts />
      </Container>
      <Container>
        <ConsumerPersonaText>Relevant Consumer Personas</ConsumerPersonaText>
        <CardsContainer>
          {CONSUMER_PERSONAS.map((item, index) => (
            <RelevantConsumerCard percentile={100} name="name" key={index} {...item} />
          ))}
        </CardsContainer>
      </Container>

      <Container>
        <DemographicCard withMargin={false} />
      </Container>
    </View>
  );
}

const ConsumerPersonaText = styled(Text)`
  font-size: ${FONT_SIZE_MEDIUM};
  font-weight: ${FONT_WEIGHT_BOLD};
  margin: 10px 10px;
`;

const Container = styled(Card)`
  margin: 16px;
`;

const CardsContainer = styled(View)`
  padding: 30px;
  flex-direction: row;
  background-color: ${LIGHTEST_GREY};
`;
