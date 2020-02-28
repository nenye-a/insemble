import React from 'react';
import styled from 'styled-components';

import { CONSUMER_PERSONAS } from '../../fixtures/dummyData';
import { View, Text } from '../../core-ui';
import { FONT_SIZE_MEDIUM, FONT_WEIGHT_BOLD } from '../../constants/theme';
import { LIGHTEST_GREY, GREY } from '../../constants/colors';
import KeyFacts from '../DeepDivePage/KeyFacts';
import RelevantConsumerCard from '../DeepDivePage/RelevantConsumerCard';
import DemographicCard from '../../core-ui/Demographics';

export default function LandlordLocationDetails() {
  return (
    <View>
      {/* TODO: change to map */}
      <Placeholder />
      <KeyFacts withMargin={false} />
      <ConsumerPersonaText>All Consumer Personas</ConsumerPersonaText>
      <Container flex>
        <CardsContainer>
          {CONSUMER_PERSONAS.map((item, index) => (
            <RelevantConsumerCard percentile={100} name="name" key={index} {...item} />
          ))}
        </CardsContainer>
      </Container>
      <GraphicContainer>
        <DemographicCard withMargin={false} />
      </GraphicContainer>
    </View>
  );
}

const Container = styled(View)`
  flex-wrap: wrap;
  overflow-x: scroll;
`;

const Placeholder = styled(View)`
  background-color: ${GREY};
  width: 100%;
  height: 200px;
`;
const ConsumerPersonaText = styled(Text)`
  font-size: ${FONT_SIZE_MEDIUM};
  font-weight: ${FONT_WEIGHT_BOLD};
  margin: 30px 10px 10px;
`;
const CardsContainer = styled(View)`
  padding: 30px;
  flex-direction: row;
  background-color: ${LIGHTEST_GREY};
`;

const GraphicContainer = styled(View)`
  margin: 0 14px;
`;
