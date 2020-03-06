import React, { useContext } from 'react';

import { View } from '../../core-ui';
import MatchPercentageCard from './MatchPercentageCard';
import RelevantConsumerPersonas from './RelevantConsumerPersonas';
import NearbyCard from './NearbyCard';
import Demographics from '../../core-ui/Demographics';
import KeyFacts from './KeyFacts';
import { DeepDiveContext } from './DeepDiveModal';

export default function Overview() {
  let data = useContext(DeepDiveContext);
  let commuteData = data?.result?.commute;
  let keyFactsData = data?.result?.keyFacts;
  let personasData = data?.result?.topPersonas;
  let demographicsData = [
    data?.result?.demographics1,
    data?.result?.demographics3,
    data?.result?.demographics5,
  ];
  return (
    <View>
      <MatchPercentageCard />
      <KeyFacts commuteData={commuteData} keyFactsData={keyFactsData} withMargin />
      <RelevantConsumerPersonas personasData={personasData} />
      <Demographics demographicsData={demographicsData} withMargin={true} />
      <NearbyCard />
    </View>
  );
}
