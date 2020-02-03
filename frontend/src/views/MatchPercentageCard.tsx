import React from 'react';
import styled from 'styled-components';

import { View, FragmentedProgressBar, Text, TouchableOpacity } from '../core-ui';
import {
  FONT_SIZE_LARGE,
  FONT_WEIGHT_MEDIUM,
  FONT_WEIGHT_HEAVY,
  FONT_WEIGHT_BOLD,
  FONT_SIZE_MEDIUM,
} from '../constants/theme';
import SvgTriangleUp from '../components/icons/triangle-up';
import { GREEN_ICON, GREY_ICON, DARK_TEXT_COLOR } from '../constants/colors';
import SvgArrowDownShort from '../components/icons/arrow-down-short';

type Props = {
  progress: number;
};

export default function MatchPercentageCard(props: Props) {
  let { progress } = props;
  const ASPECTS = [
    {
      name: 'Growth',
      description: 'Growth potential of this area',
      growthIcon: true,
    },
    {
      name: 'Personas',
      description: 'Growth potential of this area',
      growthIcon: true,
    },
    {
      name: 'Demographics',
      description: 'Who lives & frequents this area',
      growthIcon: true,
    },
    {
      name: 'Ecosystem',
      description: 'The economic ecosystem nearby',
      growthIcon: false,
    },
  ];

  return (
    <Container>
      <PercentageContainer>
        <PercentageText fontSize="84px" fontWeight={FONT_WEIGHT_HEAVY} style={{ lineHeight: 1 }}>
          {progress}
          <Text fontSize="28px" fontWeight={FONT_WEIGHT_HEAVY}>
            %
          </Text>
        </PercentageText>
        <Text fontSize={FONT_SIZE_LARGE} fontWeight={FONT_WEIGHT_MEDIUM}>
          Match
        </Text>
        <FragmentedProgressBar progress={progress} style={{ marginTop: 30, marginBottom: 60 }} />
      </PercentageContainer>
      <AspectsRowedView>
        {ASPECTS.map(({ name, description, growthIcon }, index) => {
          return (
            <AspectContainer key={index}>
              <RowedView>
                <Text fontSize={FONT_SIZE_LARGE} fontWeight={FONT_WEIGHT_BOLD}>
                  {name}
                </Text>
                {growthIcon && <SvgTriangleUp style={{ color: GREEN_ICON, marginLeft: 8 }} />}
              </RowedView>
              <Text fontWeight={FONT_SIZE_MEDIUM} style={{ textAlign: 'center' }}>
                {description}
              </Text>
            </AspectContainer>
          );
        })}
      </AspectsRowedView>
      <SeeMoreContainer>
        <SvgArrowDownShort style={{ color: GREY_ICON }} />
        <Text fontColor={DARK_TEXT_COLOR}>See More</Text>
      </SeeMoreContainer>
    </Container>
  );
}

const Container = styled(View)`
  padding: 16px;
`;
const PercentageContainer = styled(View)`
  align-items: center;
`;

const RowedView = styled(View)`
  flex-direction: row;
`;

const AspectsRowedView = styled(RowedView)``;

const SeeMoreContainer = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 23px;
`;

const AspectContainer = styled(View)`
  align-items: center;
  width: 25%;
`;

const PercentageText = styled(Text)`
  lineheight: 1;
`;
