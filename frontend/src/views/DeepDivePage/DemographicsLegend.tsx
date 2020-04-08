import React from 'react';
import styled from 'styled-components';
import { Text, View } from '../../core-ui';
import { THEME_COLOR, HOVERED_LIST_ITEM_BG } from '../../constants/colors';
import projectedIcon from '../../assets/images/arrow-projected.svg';

export default function DemographicsLegend() {
  return (
    <BarRowedView>
      <Round />
      <Text>This Location</Text>
      <RoundExisting />
      <Text>Your Existing Location</Text>
      <ProjectedIcon src={projectedIcon} />
      <Text>Projected 5 Year Growth</Text>
    </BarRowedView>
  );
}

const BarRowedView = styled(View)`
  flex-direction: row;
  align-items: center;
`;
const Round = styled(View)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${THEME_COLOR};
  margin: 0 12px 0 0;
`;
const RoundExisting = styled(Round)`
  margin: 0 12px 0 36px;
  background-color: ${HOVERED_LIST_ITEM_BG};
`;

const ProjectedIcon = styled.img`
  margin: 0 12px 0 36px;
`;
