import React from 'react';
import styled from 'styled-components';
import { Card, Text, Badge as BaseBadge } from '../../core-ui';
import NearbyPlacesTag from './NearbyPlacesTag';
import { DropdownSelection } from './NearbyCard';
import { DEFAULT_BORDER_RADIUS, FONT_WEIGHT_MEDIUM, FONT_SIZE_SMALL } from '../../constants/theme';
import { THEME_COLOR } from '../../constants/colors';
import { roundDecimal, numberFormatter } from '../../utils';

type Props = {
  name: string;
  distance: number;
  photo?: string;
  similar: boolean;
  selectedDropdownValue: DropdownSelection;
  rating: number | null;
  numberRating: number;
};

export default function MiniNearbyPlacesCard(props: Props) {
  let { name, distance, rating, numberRating, similar, selectedDropdownValue } = props;

  const MiniNearbyTag: {
    [key in DropdownSelection]: {
      field: number | null;
      postfix: string;
    };
  } = {
    'Most Popular': {
      field: numberRating,
      postfix: 'Reviews',
    },
    Distance: {
      field: distance,
      postfix: 'Miles',
    },
    Rating: {
      field: rating,
      postfix: 'Rating',
    },
    Similar: {
      field: distance,
      postfix: 'Miles',
    },
  };

  let selectedTag = MiniNearbyTag[selectedDropdownValue];

  return (
    <Container>
      {similar && (
        <Badge
          text="Similar"
          textProps={{ style: { fontWeight: FONT_WEIGHT_MEDIUM, fontSize: FONT_SIZE_SMALL } }}
        />
      )}
      <PlaceName>{name}</PlaceName>
      {selectedTag.field != null && (
        <NearbyPlacesTag
          content={numberFormatter(roundDecimal(selectedTag.field))}
          postfix={selectedTag.postfix}
          style={{ margin: 0, marginTop: 3 }}
        />
      )}
    </Container>
  );
}

const MARGIN = '4px';
const Container = styled(Card)`
  margin: ${MARGIN};
  padding: 12px;
  width: calc(100% / 3 - (2 * ${MARGIN}));
  overflow: visible;
`;

const PlaceName = styled(Text)`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const Badge = styled(BaseBadge)`
  position: absolute;
  top: -9px;
  left: 0px;
  height: 18px;
  border-radius: ${DEFAULT_BORDER_RADIUS} ${DEFAULT_BORDER_RADIUS} 0 0;
  width: 100%;
  background-color: ${THEME_COLOR};
`;
