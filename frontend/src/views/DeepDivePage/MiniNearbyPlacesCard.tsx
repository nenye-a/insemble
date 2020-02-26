import React from 'react';
import styled from 'styled-components';
import { View, Card, Text, Badge as BaseBadge } from '../../core-ui';
import NearbyPlacesTag from './NearbyPlacesTag';
import { DEFAULT_BORDER_RADIUS, FONT_WEIGHT_MEDIUM, FONT_SIZE_SMALL } from '../../constants/theme';
import { THEME_COLOR } from '../../constants/colors';
import { roundDecimal } from '../../utils';
import mapPin from '../../components/icons/map-pin.svg';

type Props = {
  name: string;
  distance: number;
  photo?: string;
  similar: boolean;
};

export default function MiniNearbyPlacesCard(props: Props) {
  let { name, distance, photo, similar } = props;
  return (
    <Container>
      {similar && (
        <Badge
          text="Similar"
          textProps={{ style: { fontWeight: FONT_WEIGHT_MEDIUM, fontSize: FONT_SIZE_SMALL } }}
        />
      )}
      <RowedView>
        <Image src={photo || mapPin} />
        <PlaceName>{name}</PlaceName>
      </RowedView>
      <NearbyPlacesTag
        content={roundDecimal(distance)}
        postfix="Miles"
        style={{ margin: 0, marginTop: 3 }}
      />
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

const RowedView = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const Image = styled.img`
  height: 27px;
  width: 27px;
  object-fit: contain;
  margin-right: 8px;
  border-radius: ${DEFAULT_BORDER_RADIUS};
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
