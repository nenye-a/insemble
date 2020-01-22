import React, { useState } from 'react';
import styled from 'styled-components';

import { View, Text, Modal } from '../../core-ui';
import PhotoGallery from './PhotoGallery';
import SummaryCard from './SummaryCard';
import DescriptionCard from './DescriptionCard';
import { PHOTOS, PROPERTY_DESCRIPTION, PROPERTY_SUMMARY } from '../../fixtures/dummyData';
import PropertyDeepDiveHeader from './PropertyDeepDiveHeader';
import { BACKGROUND_COLOR } from '../../constants/colors';

type Props = {
  visible: boolean;
  onClosePress: () => void;
};

export default function LocationDeepDiveModal(props: Props) {
  let { visible, onClosePress } = props;
  let [isLiked, toggleIsLiked] = useState(false); // get value from backend
  if (visible) {
    return (
      <Modal onClosePress={onClosePress}>
        <TourContainer>
          <Text>3D Tour</Text>
        </TourContainer>
        <PropertyDeepDiveHeader isLiked={isLiked} onLikePress={toggleIsLiked} />
        <RowedView flex>
          <PhotoGallery images={PHOTOS} />
          <CardsContainer flex>
            <SummaryCard {...PROPERTY_SUMMARY} />
            <Spacing />
            <DescriptionCard content={PROPERTY_DESCRIPTION} />
          </CardsContainer>
        </RowedView>
      </Modal>
    );
  }
  return null;
}

const CardsContainer = styled(View)`
  padding: 16px;
`;
const Spacing = styled(View)`
  height: 12px;
`;

const TourContainer = styled(View)`
  height: 320px;
  justify-content: center;
  align-items: center;
  background-color: grey;
`;

const RowedView = styled(View)`
  flex-direction: row;
  align-items: flex-start;
  overflow-y: scroll;
  background-color: ${BACKGROUND_COLOR};
`;
