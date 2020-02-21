import React from 'react';

import { View } from '../../core-ui';
import MatchPercentageCard from './MatchPercentageCard';
import RelevantConsumerPersonas from './RelevantConsumerPersonas';
import NearbyCard from './NearbyCard';
import Demographics from '../../components/explore/Demographics';
import KeyFacts from './KeyFacts';

export default function Overview() {
  return (
    <View>
      <MatchPercentageCard />
      <KeyFacts />
      <RelevantConsumerPersonas />
      <Demographics />
      <NearbyCard />
    </View>
  );
}
