import React, { ReactNode } from 'react';
import styled, { CSSProperties } from 'styled-components';

import { View, Card, Text } from '../../core-ui';
import { THEME_COLOR } from '../../constants/colors';
import TenantKeyFacts from './TenantKeyFacts';
import {
  TenantDetail_tenantDetail_keyFacts as KeyFactsProps,
  TenantDetail_tenantDetail_tenantView as TenantViewProps,
} from '../../generated/TenantDetail';
import { EmptyDataComponent } from '../../components';

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

type Props = {
  keyFacts?: KeyFactsProps;
  tenantView?: TenantViewProps;
};

export default function TenantOverview({ keyFacts, tenantView }: Props) {
  if (tenantView) {
    let { overview, description, minSqft, ceilingHeight, condition } = tenantView;
    return (
      <View>
        <Container>
          <TenantKeyFacts keyFacts={keyFacts} />
        </Container>
        <BottomContainer>
          <Row flex>
            <OverviewCard title="Expansion Plans" content={overview} />
            <OverviewCard title="Description" content={description} />
          </Row>
          <SpaceContainer>
            <OverviewCard title="Physical Space">
              <TextRow>
                <Text>Min Sqft:</Text>
                <ContentText>{minSqft || 'Not Provided'}</ContentText>
              </TextRow>
              <TextRow>
                <Text>Min Frontage:</Text>
                <ContentText>{ceilingHeight || 'Not Provided'}</ContentText>
              </TextRow>
              <TextRow>
                <Text>Condition:</Text>
                <ContentText>{condition || 'Not Provided'}</ContentText>
              </TextRow>
            </OverviewCard>
          </SpaceContainer>
        </BottomContainer>
      </View>
    );
  }
  return <EmptyDataComponent />;
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
  margin: 8px;
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

const BottomContainer = styled(View)`
  padding: 8px;
`;
