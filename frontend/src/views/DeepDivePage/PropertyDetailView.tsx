import React from 'react';
import styled from 'styled-components';

import { View } from '../../core-ui';
import PhotoGallery from './PhotoGallery';
import DescriptionCard from './DescriptionCard';
import SummaryCard from './SummaryCard';
import { BACKGROUND_COLOR } from '../../constants/colors';
import { PHOTOS, PROPERTY_SUMMARY, PROPERTY_DESCRIPTION } from '../../fixtures/dummyData';

export default function PropertyDetailView() {
  return (
    <RowedView flex>
      <PhotoGallery images={PHOTOS} />
      <CardsContainer flex>
        <SummaryCard {...PROPERTY_SUMMARY} />
        <Spacing />
        <DescriptionCard content={PROPERTY_DESCRIPTION} />
      </CardsContainer>
    </RowedView>
  );
}

const CardsContainer = styled(View)`
  padding: 16px;
`;
const Spacing = styled(View)`
  height: 12px;
`;
const RowedView = styled(View)`
  flex-direction: row;
  align-items: flex-start;
  background-color: ${BACKGROUND_COLOR};
`;
