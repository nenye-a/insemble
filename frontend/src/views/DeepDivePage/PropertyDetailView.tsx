import React, { useContext } from 'react';
import styled from 'styled-components';

import { View } from '../../core-ui';
import PhotoGallery from './PhotoGallery';
import DescriptionCard from './DescriptionCard';
import SummaryCard from './SummaryCard';
import { BACKGROUND_COLOR } from '../../constants/colors';
import { DeepDiveContext } from './DeepDiveModal';

export default function PropertyDetailView() {
  let contextValue = useContext(DeepDiveContext);
  if (contextValue?.propertyDetails) {
    let { mainPhoto, photos, sqft, summary, description } = contextValue.propertyDetails;
    return (
      <RowedView flex>
        <PhotoGallery images={[...mainPhoto, ...photos]} />
        <CardsContainer flex>
          <SummaryCard
            priceSqft={sqft.toString() || ''}
            summary={summary || ''}
            sqft={sqft.toString() || ''}
            // giving and empty string since no backend data match
            type=""
            tenacy=""
            condition=""
          />
          <Spacing />
          <DescriptionCard content={description || ''} />
        </CardsContainer>
      </RowedView>
    );
  }
  return <View />;
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
