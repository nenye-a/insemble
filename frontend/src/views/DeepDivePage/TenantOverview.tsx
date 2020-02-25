import React, { ReactNode } from 'react';
import styled, { CSSProperties } from 'styled-components';

import { View, Card, Text } from '../../core-ui';
import { THEME_COLOR } from '../../constants/colors';
import TenantKeyFacts from './TenantKeyFacts';

type OverviewCardProps = {
  title: string;
  content?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

function OverviewCard({ title, content, style, children }: OverviewCardProps) {
  return (
    <CardsContainer style={style} title={title} titleBackground="grey">
      <ContentContainer>
        <Text>{content}</Text>
        {children}
      </ContentContainer>
    </CardsContainer>
  );
}

export default function TenantOverview() {
  return (
    <View>
      <Container>
        <TenantKeyFacts withMargin={false} />
      </Container>
      {/* <RelevantConsumerPersonas />
      <Container>
        <Graphic population={100} />
      </Container> */}

      <View>
        <Row flex>
          <OverviewCard
            title="Overview"
            content="Actively looking for retail and restaurant space in Greater Los Angeles, San Francisco, and Waco, TX."
          />
          <OverviewCard
            title="Description"
            content="Spitz Diner is a fast casual Turkish diner with 2 existing locations (one in Los Angeles’s very own Little Tokyo), looking to expand by 10 locations in the upcoming year. We look for spaces about 3200 - 4000 square foot, and are happy exploring white box and second generation locations."
          />
        </Row>
        <SpaceContainer>
          <OverviewCard title="Physical Space">
            <TextRow>
              <Text>Target Sqft:</Text>
              <ContentText>4000 - 5200</ContentText>
            </TextRow>
            <TextRow>
              <Text>Target Ceiling Height:</Text>
              <ContentText>15ft</ContentText>
            </TextRow>
            <TextRow>
              <Text>Condition:</Text>
              <ContentText>White Box</ContentText>
            </TextRow>
          </OverviewCard>
        </SpaceContainer>
      </View>
    </View>
  );
}

const ContentText = styled(Text)`
  color: ${THEME_COLOR};
`;

const Container = styled(Card)`
  margin: 16px;
`;

const SpaceContainer = styled(View)`
  width: 50%;
`;

const CardsContainer = styled(Card)`
  margin: 16px;
  height: 200px;
  flex: 1;
`;

const TextRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin: 8px 0;
`;

const ContentContainer = styled(View)`
  padding: 12px;
`;

const Row = styled(View)`
  flex-direction: row;
`;
