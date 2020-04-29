import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';

import { View, Card } from '../../core-ui';
import DemographicCard from './Demographics';
import TenantKeyFacts from './TenantKeyFacts';
import {
  TenantDetail_tenantDetail_keyFacts as KeyFactsProps,
  TenantDetail_tenantDetail_insightView as InsightViewProps,
} from '../../generated/TenantDetail';
import { EmptyDataComponent } from '../../components';
import { GET_USER_STATE } from '../../graphql/queries/client/userState';
import RelevantConsumerPersonas from './RelevantConsumerPersonas';

type Props = {
  keyFacts?: KeyFactsProps;
  insightsView?: InsightViewProps;
};

export default function TenantPropertyDetailsView({ keyFacts, insightsView }: Props) {
  let { data: tierData } = useQuery(GET_USER_STATE);
  let { trial } = tierData.userState;
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
