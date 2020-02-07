import React from 'react';
import styled from 'styled-components';
import { View, Card, Text, Badge as BaseBadge } from '../../core-ui';
import NearbyPlacesTag from './NearbyPlacesTag';
import { DEFAULT_BORDER_RADIUS, FONT_WEIGHT_MEDIUM, FONT_SIZE_SMALL } from '../../constants/theme';
import { THEME_COLOR } from '../../constants/colors';

type Props = {
  name: string;
  distance: number;
  photo: string;
  isSimilar: boolean;
};

export default function MiniNearbyPlacesCard(props: Props) {
  let { name, distance, photo, isSimilar } = props;
  return (
    <Container>
      {isSimilar && (
        <Badge
          text="Similar"
          textProps={{ style: { fontWeight: FONT_WEIGHT_MEDIUM, fontSize: FONT_SIZE_SMALL } }}
        />
      )}
      <RowedView>
        <Image src={photo} />
        <PlaceName>{name}</PlaceName>
      </RowedView>
      <NearbyPlacesTag content={distance} postfix="Miles" style={{ margin: 0, marginTop: 3 }} />
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
  object-fit: cover;
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
