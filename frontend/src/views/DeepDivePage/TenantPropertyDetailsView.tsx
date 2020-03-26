import React from 'react';
import styled from 'styled-components';

import { View, Card, Text } from '../../core-ui';
import DemographicCard from './Demographics';
import RelevantConsumerCard from './RelevantConsumerCard';
import { LIGHTEST_GREY } from '../../constants/colors';
import { FONT_SIZE_MEDIUM, FONT_WEIGHT_BOLD } from '../../constants/theme';
import TenantKeyFacts from './TenantKeyFacts';
import {
  TenantDetail_tenantDetail_keyFacts as KeyFactsProps,
  TenantDetail_tenantDetail_insightView as InsightViewProps,
} from '../../generated/TenantDetail';
import { EmptyDataComponent } from '../../components';

type Props = {
  keyFacts?: KeyFactsProps;
  insightsView?: InsightViewProps;
};

export default function TenantPropertyDetailsView({ keyFacts, insightsView }: Props) {
  if (insightsView) {
    let { topPersonas, demographics1, demographics3, demographics5 } = insightsView;
    let demographics = [demographics1, demographics3, demographics5];
    return (
      <View>
        <Container>
          <TenantKeyFacts keyFacts={keyFacts} />
        </Container>
        <Container>
          <ConsumerPersonaText>Relevant Consumer Personas</ConsumerPersonaText>
          <CardsContainer>
            {topPersonas.map((item, index) => (
              <RelevantConsumerCard key={index} {...item} />
            ))}
          </CardsContainer>
        </Container>

        <Container>
          <DemographicCard demographicsData={demographics} withMargin={false} />
        </Container>
      </View>
    );
  }
  return <EmptyDataComponent />;
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
