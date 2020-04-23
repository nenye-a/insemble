import React from 'react';
import styled from 'styled-components';

import { View, Card, Text, Badge as BaseBadge, TouchableOpacity } from '../../core-ui';
import NearbyPlacesTag from './NearbyPlacesTag';
import { DEFAULT_BORDER_RADIUS, FONT_SIZE_SMALL, FONT_WEIGHT_MEDIUM } from '../../constants/theme';
import { MUTED_TEXT_COLOR, THEME_COLOR } from '../../constants/colors';
import { LEGEND } from './NearbyMapLegend';
import { roundDecimal, numberFormatter } from '../../utils';
import { LocationDetails_locationDetails_result_nearby as Nearby } from '../../generated/LocationDetails';

type Props = Nearby & {
  onPress: (name: string) => void;
};

export default function NearbyPlacesCard(props: Props) {
  let { name, category, rating, numberRating, distance, placeType, similar, onPress } = props;
  return (
    <Container>
      <TouchableOpacity onPress={() => onPress(name)}>
        {similar && (
          <Badge
            text="Similar"
            textProps={{ style: { fontWeight: FONT_WEIGHT_MEDIUM, fontSize: FONT_SIZE_SMALL } }}
          />
        )}
        <RowedView flex>
          <Text style={{ flex: 1 }}>{name}</Text>
          <LegendIcon src={LEGEND[placeType[0] as keyof typeof LEGEND]} />
        </RowedView>
        <RowedView>
          <Text fontSize={FONT_SIZE_SMALL} color={MUTED_TEXT_COLOR}>
            {category}
          </Text>
        </RowedView>
        <TagsContainer>
          <NearbyPlacesTag content={rating} postfix="Rating" />
          <NearbyPlacesTag content={numberRating} postfix="Reviews" />
          <NearbyPlacesTag content={numberFormatter(roundDecimal(distance))} postfix="Miles" />
        </TagsContainer>
      </TouchableOpacity>
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
