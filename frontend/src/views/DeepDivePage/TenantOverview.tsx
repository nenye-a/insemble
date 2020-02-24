import React from 'react';
import styled from 'styled-components';

import { View, Card, Text } from '../../core-ui';
import PhotoGallery from './PhotoGallery';
import DescriptionCard from './DescriptionCard';
import SummaryCard from './SummaryCard';
import { BACKGROUND_COLOR, THEME_COLOR } from '../../constants/colors';
import { PHOTOS, PROPERTY_SUMMARY, PROPERTY_DESCRIPTION } from '../../fixtures/dummyData';
import KeyFacts from './KeyFacts';
import RelevantConsumerPersonas from './RelevantConsumerPersonas';
import Graphic from '../../core-ui/Demographics';

export default function TenantOverview() {
  return (
    <View>
      <Container>
        <KeyFacts withMargin={false} />
      </Container>
      {/* <RelevantConsumerPersonas />
      <Container>
        <Graphic population={100} />
      </Container> */}

      <Row flex>
        <CardsContainer title="Overview" titleBackground="grey">
          <ContentContainer>
            <Text>
              Actively looking for retail and restaurant space in Greater Los Angeles, San
              Francisco, and Waco, TX.
            </Text>
          </ContentContainer>
        </CardsContainer>

        <CardsContainer title="Description" titleBackground="grey">
          <ContentContainer>
            <Text>
              Spitz Diner is a fast casual Turkish diner with 2 existing locations (one in Los
              Angeles’s very own Little Tokyo), looking to expand by 10 locations in the upcoming
              year. We look for spaces about 3200 - 4000 square foot, and are happy exploring white
              box and second generation locations.
            </Text>
          </ContentContainer>
        </CardsContainer>
      </Row>
      <View>
        <CardsContainer title="Physical Space" titleBackground="grey">
          <ContentContainer>
            <RowedView>
              <Text>Target Sqft:</Text>
              <ContentText>4000 - 5200</ContentText>
            </RowedView>
            <RowedView>
              <Text>Target Ceiling Height:</Text>
              <ContentText>15ft</ContentText>
            </RowedView>
            <RowedView>
              <Text>Condition:</Text>
              <ContentText>White Box</ContentText>
            </RowedView>
          </ContentContainer>
        </CardsContainer>
      </View>
    </View>
  );
}

const ContentText = styled(Text)`
  color: ${THEME_COLOR};
`;
const Container = styled(View)`
  padding: 16px;
`;
const CardsContainer = styled(Card)`
  margin: 16px;
  flex: 1;
  height: fit-content;
`;

const Spacing = styled(View)`
  height: 12px;
`;
const RowedView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;

const ContentContainer = styled(View)`
  padding: 12px;
`;

const Row = styled(View)`
  flex-direction: row;
`;
