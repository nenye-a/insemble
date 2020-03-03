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
    let { overview, description, minSqft, maxSqft, ceilingHeight, condition } = tenantView;
    return (
      <View>
        <Container>
          <TenantKeyFacts keyFacts={keyFacts} />
        </Container>
        <View>
          <Row flex>
            <OverviewCard title="Overview" content={overview} />
            <OverviewCard title="Description" content={description} />
          </Row>
          <SpaceContainer>
            <OverviewCard title="Physical Space">
              <TextRow>
                <Text>Target Sqft:</Text>
                <ContentText>
                  {minSqft} - {maxSqft}
                </ContentText>
              </TextRow>
              <TextRow>
                <Text>Target Ceiling Height:</Text>
                <ContentText>{ceilingHeight}</ContentText>
              </TextRow>
              <TextRow>
                <Text>Condition:</Text>
                <ContentText>{condition}</ContentText>
              </TextRow>
            </OverviewCard>
          </SpaceContainer>
        </View>
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
