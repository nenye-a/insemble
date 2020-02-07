import React from 'react';
import styled from 'styled-components';
import { View, Text } from '../../core-ui';
import availablePropertyIcon from '../../assets/images/available-property-marker.svg';
import recommendedPropertyIcon from '../../assets/images/recommended-property-marker.svg';
import { THEME_COLOR, HOVERED_LIST_ITEM_BG } from '../../constants/colors';

type Props = {
  barGraph?: boolean;
};

export default function Legend(props: Props) {
  let { barGraph } = props;

  return barGraph ? (
    <BarRowedView>
      <Round />
      <Text>This Location</Text>
      <RoundExisting />
      <Text>Your Existing Location</Text>
    </BarRowedView>
  ) : (
    <RowedView>
      <Icon src={recommendedPropertyIcon} />
      <Text>Recommended Property</Text>
      <Icon src={availablePropertyIcon} />
      <Text>Available Property</Text>
    </RowedView>
  );
}

const RowedView = styled(View)`
  flex-direction: row;
  align-items: center;
`;
const BarRowedView = styled(View)`
  flex-direction: row;
  align-items: center;
  // justify-content: space-between;
`;

const Icon = styled.img`
  margin: 0px 12px;
`;

const Round = styled(View)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${THEME_COLOR};
  margin: 0 12px 0 0;
`;
const RoundExisting = styled(View)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin: 0 12px 0 36px;
  background-color: ${HOVERED_LIST_ITEM_BG};
`;
