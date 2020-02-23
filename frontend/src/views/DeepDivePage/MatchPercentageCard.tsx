import React, { useContext } from 'react';
import styled from 'styled-components';

import { View, FragmentedProgressBar, Text, TouchableOpacity } from '../../core-ui';
import {
  FONT_SIZE_MEDIUM,
  FONT_SIZE_LARGE,
  FONT_SIZE_XXLARGE,
  FONT_SIZE_HUGE,
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_HEAVY,
  FONT_WEIGHT_MEDIUM,
} from '../../constants/theme';
import { GREEN_ICON, GREY_ICON, DARK_TEXT_COLOR } from '../../constants/colors';
import SvgTriangleUp from '../../components/icons/triangle-up';
import SvgArrowDownShort from '../../components/icons/arrow-down-short';
import { DeepDiveContext } from './DeepDiveModal';
import { roundDecimal } from '../../utils';

export default function MatchPercentageCard() {
  let data = useContext(DeepDiveContext);
  let progress = data?.result.matchValue;
  let affinities = data?.result.affinities;

  const ASPECTS = [
    {
      name: 'Growth',
      description: 'Growth potential of this area',
      growthIcon: affinities?.growth,
    },
    {
      name: 'Personas',
      description: 'Growth potential of this area',
      growthIcon: affinities?.personas,
    },
    {
      name: 'Demographics',
      description: 'Who lives & frequents this area',
      growthIcon: affinities?.demographics,
    },
    {
      name: 'Ecosystem',
      description: 'The economic ecosystem nearby',
      growthIcon: affinities?.ecosystem,
    },
  ];

  return (
    <Container>
      <PercentageContainer>
        <PercentageText fontSize={FONT_SIZE_HUGE} fontWeight={FONT_WEIGHT_HEAVY}>
          {roundDecimal(progress || '')}
          <Text fontSize={FONT_SIZE_XXLARGE} fontWeight={FONT_WEIGHT_HEAVY}>
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
            <AspectContainer key={name + '_' + index.toString()}>
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
  padding-top: 16px;
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
  line-height: 1;
`;
