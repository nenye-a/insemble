import React from 'react';
import styled from 'styled-components';

import { View, Text, Alert } from '../../core-ui';
import PhotoGallery from '../DeepDivePage/PhotoGallery';
import DescriptionCard from '../DeepDivePage/DescriptionCard';
import SummaryCard from '../DeepDivePage/SummaryCard';
import PropertyDeepDiveHeader from '../DeepDivePage/PropertyDeepDiveHeader';
import { BACKGROUND_COLOR, THEME_COLOR } from '../../constants/colors';
import { PHOTOS } from '../../fixtures/dummyData';
import { FONT_SIZE_LARGE, FONT_WEIGHT_BOLD } from '../../constants/theme';

export default function PreviewListing() {
  /* TODO: replace dummy data */
  return (
    <>
      <RowView>
        <Title>Space 1</Title>
        <Alert visible text="This is how the Retailer will see your listing." />
      </RowView>
      <TourContainer isShrink={false}>
        <PendingAlert visible text="Pending virtual tour" />
        <Text>3D Tour</Text>
      </TourContainer>
      <PropertyDeepDiveHeader
        address={'4027 Sepulveda Boulevard, Los Angeles, CA'}
        targetNeighborhood={'Mclaughlin, Culver City'}
      />
      <RowedView flex>
        <PhotoGallery images={PHOTOS} />
        <CardsContainer flex>
          <SummaryCard
            priceSqft={'$30'}
            sqft={'4,900'}
            tenacy={'Multiple'}
            type={'Inline'}
            condition={'Whitebox'}
          />
          <Spacing />
          <DescriptionCard
            content={
              'This place, positioned uniquely between a Yoshinoya and a Jack-In-The-Box, is a quick lunchtime getaway location close to nearby grocery stores, salons, and banks. Open your brand in this community today! '
            }
          />
        </CardsContainer>
      </RowedView>
    </>
  );
}

const CardsContainer = styled(View)`
  padding: 0 16px;
`;
const Spacing = styled(View)`
  height: 12px;
`;
const RowedView = styled(View)`
  flex-direction: row;
  align-items: flex-start;
  background-color: ${BACKGROUND_COLOR};
`;

type TourContainerProps = {
  isShrink: boolean;
};

const TourContainer = styled(View)<TourContainerProps>`
  height: ${(props) => (props.isShrink ? '180px' : '320px')};
  transition: 0.3s height linear;
  justify-content: center;
  align-items: center;
  background-color: grey;
`;
const RowView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 24px 0;
  padding: 0 24px 0 50px;
`;
const Title = styled(Text)`
  font-size: ${FONT_SIZE_LARGE};
  font-weight: ${FONT_WEIGHT_BOLD};
  color: ${THEME_COLOR};
  margin: 0 14px 0 0;
`;
const PendingAlert = styled(Alert)`
  position: absolute;
  top: 12px;
  left: 12px;
`;
