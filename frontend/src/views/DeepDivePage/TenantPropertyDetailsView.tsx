import React from 'react';
import styled from 'styled-components';

import { View, Card } from '../../core-ui';
import DemographicCard from './Demographics';
import TenantKeyFacts from './TenantKeyFacts';
import {
  TenantDetail_tenantDetail_keyFacts as KeyFactsProps,
  TenantDetail_tenantDetail_insightView as InsightViewProps,
} from '../../generated/TenantDetail';
import { EmptyDataComponent } from '../../components';
import RelevantConsumerPersonas from './RelevantConsumerPersonas';
import { useGetUserState } from '../../utils/hooks/useGetUserState';

type Props = {
  keyFacts?: KeyFactsProps;
  insightsView?: InsightViewProps;
};

export default function TenantPropertyDetailsView({ keyFacts, insightsView }: Props) {
  let { trial } = useGetUserState();
  if (insightsView) {
    let { topPersonas, demographics1, demographics3, demographics5 } = insightsView;
    let demographics = [demographics1, demographics3, demographics5];
    return (
      <View>
        <Container>
          <TenantKeyFacts keyFacts={keyFacts} />
        </Container>
        <RelevantConsumerPersonas isLocked={!trial} personasData={topPersonas} />
        <Container>
          <DemographicCard isLocked={!trial} demographicsData={demographics} withMargin={false} />
        </Container>
      </View>
    );
  }
  return <EmptyDataComponent />;
}

const Container = styled(Card)`
  margin: 16px;
`;
