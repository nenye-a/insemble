import React from 'react';

import { View } from '../../core-ui';
import MatchPercentageCard from '../MatchPercentageCard';
import RelevantConsumerPersonas from './RelevantConsumerPersonas';

export default function PropertyDetailsView() {
  return (
    <View>
      <MatchPercentageCard progress={87} />
      <RelevantConsumerPersonas />
    </View>
  );
}
