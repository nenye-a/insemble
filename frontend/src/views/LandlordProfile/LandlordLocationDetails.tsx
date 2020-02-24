import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { LANDLORD_TENANT_MATCHES, CONSUMER_PERSONAS } from '../../fixtures/dummyData';
import { View, Text, Card } from '../../core-ui';
import imgPlaceholder from '../../assets/images/image-placeholder.jpg';
import {
  FONT_WEIGHT_MEDIUM,
  FONT_SIZE_LARGE,
  FONT_WEIGHT_HEAVY,
  FONT_SIZE_SMALL,
  FONT_SIZE_MEDIUM,
  FONT_WEIGHT_BOLD,
} from '../../constants/theme';
import { PURPLE, DARK_TEXT_COLOR, LIGHTEST_GREY } from '../../constants/colors';
import KeyFacts from '../DeepDivePage/KeyFacts';
import RelevantConsumerCard from '../DeepDivePage/RelevantConsumerCard';
import Graphic from '../../core-ui/Demographics';

export default function LandlordLocationDetails() {
  return (
    <Container>
      <KeyFacts withMargin={false} />
      <ConsumerPersonaText>All Consumer Personas</ConsumerPersonaText>
      <CardsContainer>
        {CONSUMER_PERSONAS.map((item, index) => (
          <RelevantConsumerCard percentile={100} name="name" key={index} {...item} />
        ))}
      </CardsContainer>
      <GraphicContainer>
        <Graphic withMargin={false} />
      </GraphicContainer>
    </Container>
  );
}

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
const Container = styled(View)``;

const Image = styled.img`
  height: 120px;
  object-fit: cover;
`;

const RowedView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin: 6px 0;
`;

const TenantCard = styled(Card)`
  width: calc(33.33% - 11px);
  margin: 12px 16px 12px 0;
  &:nth-child(3n) {
    margin-right: 0;
  }
  height: fit-content;
`;
const DescriptionContainer = styled(View)`
  padding: 12px;
`;

const CardTitle = styled(Text)`
  color: ${PURPLE};
  font-weight: ${FONT_WEIGHT_MEDIUM};
`;

const CardPercentage = styled(Text)`
  color: ${PURPLE};
  font-size: ${FONT_SIZE_LARGE};
  font-weight: ${FONT_WEIGHT_HEAVY};
`;

const CardCategoryText = styled(Text)`
  color: ${DARK_TEXT_COLOR};
  font-size: ${FONT_SIZE_SMALL};
`;

const CardExistingLocationText = styled(Text)`
  font-size: ${FONT_SIZE_SMALL};
`;
