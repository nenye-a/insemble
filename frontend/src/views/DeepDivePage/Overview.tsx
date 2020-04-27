import React, { useContext } from 'react';

import { View } from '../../core-ui';
import MatchPercentageCard from './MatchPercentageCard';
import RelevantConsumerPersonas from './RelevantConsumerPersonas';
import NearbyCard from './NearbyCard';
import Demographics from './Demographics';
import KeyFacts from './KeyFacts';
import { DeepDiveContext } from './DeepDiveModal';
import { TenantTier } from '../../generated/globalTypes';

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
  let isLocked = data?.tier === TenantTier.FREE; // TODO: grant access to free trial users
  let totalValue = 0;
  commuteData &&
    commuteData.forEach((item) => {
      totalValue = totalValue + item.value;
    });

  return (
    <View>
      <MatchPercentageCard />
      <KeyFacts
        totalValue={totalValue}
        commuteData={commuteData}
        keyFactsData={keyFactsData}
        withMargin
        isLocked={isLocked}
        id="keyfacts"
      />
      <RelevantConsumerPersonas id="personas" isLocked={isLocked} personasData={personasData} />
      <Demographics
        id="demographics"
        isLocked={isLocked}
        demographicsData={demographicsData}
        withMargin={true}
      />
      <NearbyCard id="ecosystem" />
    </View>
  );
}
