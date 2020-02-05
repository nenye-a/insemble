import React, { useState } from 'react';
import styled from 'styled-components';

import { Collapsible, View, Text } from '../../core-ui';
import { WHITE } from '../../constants/colors';

import orangeCircleIcon from '../../assets/images/orange-circle.svg';
import purpleCircleIcon from '../../assets/images/purple-circle.svg';
import blueCircleIcon from '../../assets/images/blue-circle.svg';
import subwayIcon from '../../assets/images/subway.svg';
import parkIcon from '../../assets/images/park.svg';

export const LEGEND = {
  Restaurant: orangeCircleIcon,
  Hospital: purpleCircleIcon,
  Clothing: blueCircleIcon,
  'Subway Station': subwayIcon,
  Park: parkIcon,
};

export type PlaceType = keyof typeof LEGEND;

export default function NearbyMapLegend() {
  let [isCollapsed, toggleCollapsible] = useState(true);
  let legends = Object.entries(LEGEND);
  let leftLegends = legends.slice(0, 3);
  let rightLegends = legends.slice(3);
  return (
    <Collapsible
      title={isCollapsed ? 'Show Legend' : 'Hide Legend'}
      isCollapsed={isCollapsed}
      onChange={() => {
        toggleCollapsible(!isCollapsed);
      }}
      containerStyle={{ marginBottom: 8 }}
    >
      <Container>
        <RowedView>
          <View flex>
            {leftLegends.map(([text, icon], index) => {
              return (
                <LegendItem key={index}>
                  <Icon src={icon} />
                  <LegendText>{text}</LegendText>
                </LegendItem>
              );
            })}
          </View>
          <View flex>
            {rightLegends.map(([text, icon], index) => {
              return (
                <LegendItem key={index}>
                  <Icon src={icon} />
                  <LegendText>{text}</LegendText>
                </LegendItem>
              );
            })}
          </View>
        </RowedView>
      </Container>
    </Collapsible>
  );
}

const Container = styled(View)`
  padding: 4px 20px;
  background-color: ${WHITE};
`;

const RowedView = styled(View)`
  flex-direction: row;
`;

const LegendItem = styled(View)`
  flex-direction: row;
  align-items: center;
  margin: 8px 0;
`;

const LegendText = styled(Text)`
  padding-left: 4px;
`;

const Icon = styled.img`
  object-fit: contain;
  width: 16px;
  height: 16px;
`;
