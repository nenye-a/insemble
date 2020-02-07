import React from 'react';
import styled from 'styled-components';

import { View, Card, Text, Badge as BaseBadge } from '../../core-ui';
import NearbyPlacesTag from './NearbyPlacesTag';
import { DEFAULT_BORDER_RADIUS, FONT_SIZE_SMALL, FONT_WEIGHT_MEDIUM } from '../../constants/theme';
import { MUTED_TEXT_COLOR, THEME_COLOR } from '../../constants/colors';
import { LEGEND, PlaceType } from './NearbyMapLegend';

type Props = {
  name: string;
  categories: Array<string>;
  rating: number;
  salesEstimation: number;
  distance: number;
  photo: string;
  placeType: PlaceType;
  isSimilar: boolean;
};

export default function NearbyPlacesCard(props: Props) {
  let { name, categories, rating, salesEstimation, distance, photo, placeType, isSimilar } = props;
  return (
    <Container>
      {isSimilar && (
        <Badge
          text="Similar"
          textProps={{ style: { fontWeight: FONT_WEIGHT_MEDIUM, fontSize: FONT_SIZE_SMALL } }}
        />
      )}
      <RowedView flex>
        <Image src={photo} />
        <Text style={{ flex: 1 }}>{name}</Text>
        <LegendIcon src={LEGEND[placeType]} />
      </RowedView>
      <RowedView>
        <Text fontSize={FONT_SIZE_SMALL} color={MUTED_TEXT_COLOR}>
          {categories.join(' \u00B7 ')}
        </Text>
      </RowedView>
      <TagsContainer>
        <NearbyPlacesTag content={rating} postfix="Rating" />
        <NearbyPlacesTag content={`${salesEstimation}M`} postfix="est Sales" />
        <NearbyPlacesTag content={distance} postfix="Miles" />
      </TagsContainer>
    </Container>
  );
}
const MARGIN = '6px';

const Container = styled(Card)`
  margin: ${MARGIN};
  width: calc(50% - (2 * ${MARGIN}));
  padding: 12px;
  overflow: visible;
`;

const RowedView = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const TagsContainer = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
`;

const Image = styled.img`
  height: 27px;
  width: 27px;
  object-fit: cover;
  margin-right: 8px;
  border-radius: ${DEFAULT_BORDER_RADIUS};
`;

const LegendIcon = styled.img`
  object-fit: contain;
`;

const Badge = styled(BaseBadge)`
  position: absolute;
  top: -7px;
  right: 0px;
  border-radius: ${DEFAULT_BORDER_RADIUS};
  background-color: ${THEME_COLOR};
  padding: 0 13px;
  height: 18px;
`;
