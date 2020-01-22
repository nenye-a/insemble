import React, { useState } from 'react';
import styled from 'styled-components';

import { View, Text, Card } from '../../core-ui';
import PhotoGallery from './PhotoGallery';
import SummaryCard from './SummaryCard';
import DescriptionCard from './DescriptionCard';
import { PHOTOS, PROPERTY_DESCRIPTION, PROPERTY_SUMMARY } from '../../fixtures/dummyData';
import PropertyDeepDiveHeader from './PropertyDeepDiveHeader';
import { BACKGROUND_COLOR } from '../../constants/colors';

type Props = {
  visible: boolean;
};

export default function LocationDeepDiveModal(props: Props) {
  let { visible } = props;
  let [isLiked, toggleIsLiked] = useState(false); // get value from backend
  if (visible) {
    return (
      <Modal>
        <ModalDialog>
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
        </ModalDialog>
      </Modal>
    );
  }
  return null;
}

const ModalDialog = styled(View)`
  background: #fefefe;
  width: 960px;
  height: 100%;
`;

const CardsContainer = styled(View)`
  padding: 16px;
`;
const Spacing = styled(View)`
  height: 12px;
`;
const Modal = styled(View)`
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  align-items: center;
`;

const TourContainer = styled(View)`
  height: 320px;
  justify-content: center;
  align-items: center;
`;
const RowedView = styled(View)`
  flex-direction: row;
  align-items: flex-start;
  overflow-y: scroll;
  background-color: ${BACKGROUND_COLOR};
`;
const Container = styled(View)`
  position: fixed;
  top: 0;
  left: 10vw;
  width: 80vw;
  height: 1000px;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 10px;
  text-align: center;
  z-index: 9999;
  background-color: tomato;
  color: #fff;
  overflow-y: scroll;
  &:before {
    background: rgba(0, 0, 0, 0.6);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
  }
`;
