import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { View, Text, TouchableOpacity } from '../core-ui';
import {
  FILTER_CAROUSEL_INDICATOR,
  THEME_COLOR,
  MUTED_TEXT_COLOR,
  LIGHT_GREY_ICON,
} from '../constants/colors';
import { DEFAULT_BORDER_RADIUS, FONT_WEIGHT_MEDIUM, FONT_WEIGHT_NORMAL } from '../constants/theme';
import SvgArrowLeft from './icons/arrow-left';
import SvgArrowRight from './icons/arrow-right';

type Props = {
  selectedOption: string;
  options: Array<string>;
  onSelectionChange: (selectedOption: string) => void;
};

type OptionsContainerProps = {
  width: number;
};

type IndicatorProps = {
  width: number;
};

/**
 *
 * To future me or whoever reading this
 * The idea
 *
 * I put the arrow icons on
 */

const ICON_WIDTH = 24;

export default function FilterCarousel(props: Props) {
  let { selectedOption, options, onSelectionChange } = props;
  let [allOptionsWidth, setSegmentsWidth] = useState<Array<number>>([]);
  let selectedOptionIndex = options.indexOf(selectedOption);

  useEffect(() => {
    let allWidth = options.map((item) => {
      let target = document.getElementById('option-' + item);
      if (target) {
        return target.getBoundingClientRect().width;
      }
      return 0;
    });
    // populating width of each options
    setSegmentsWidth(allWidth);
  }, [options]);

  let translatedWidth =
    allOptionsWidth.slice(0, selectedOptionIndex).reduce((a, b) => a + b, 0) +
    allOptionsWidth[selectedOptionIndex] / 2;

  return (
    <View>
      <OptionsContainer width={translatedWidth}>
        {options.map((item, index) => {
          let isSelected = selectedOptionIndex === index;
          return (
            <TouchableOption
              key={item}
              onPress={() => {
                onSelectionChange(options[index]);
              }}
              id={'option-' + item}
              forwardedAs="button"
            >
              <Text
                color={isSelected ? THEME_COLOR : MUTED_TEXT_COLOR}
                fontWeight={isSelected ? FONT_WEIGHT_MEDIUM : FONT_WEIGHT_NORMAL}
              >
                {item}
              </Text>
            </TouchableOption>
          );
        })}
      </OptionsContainer>
      {selectedOptionIndex !== options.length - 1 && (
        <IconContainer
          style={{
            left: '50%',
            marginLeft: -(allOptionsWidth[selectedOptionIndex] + ICON_WIDTH) / 2,
          }}
          onPress={() => onSelectionChange(options[selectedOptionIndex + 1])}
        >
          <SvgArrowLeft style={{ color: LIGHT_GREY_ICON }} />
        </IconContainer>
      )}
      {selectedOptionIndex !== 0 && (
        <IconContainer
          style={{
            right: '50%',
            marginRight: -(allOptionsWidth[selectedOptionIndex] + ICON_WIDTH) / 2,
          }}
          onPress={() => onSelectionChange(options[selectedOptionIndex - 1])}
        >
          <SvgArrowRight style={{ color: LIGHT_GREY_ICON }} />
        </IconContainer>
      )}
      <Indicator width={allOptionsWidth[selectedOptionIndex]} />
    </View>
  );
}

const OptionsContainer = styled(View)<OptionsContainerProps>`
  flex-direction: row;
  transform: translate(calc(50% - ${({ width }) => width.toString() + 'px'}));
  transition: all 0.3s;
  z-index: 2;
  align-items: center;
`;

const Indicator = styled(View)<IndicatorProps>`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  margin-left: ${({ width }) => '-' + (width / 2).toString() + 'px'};
  height: 35px;
  width: ${({ width }) => width + 'px'};
  background-color: ${FILTER_CAROUSEL_INDICATOR};
  border-radius: ${DEFAULT_BORDER_RADIUS};
`;

const TouchableOption = styled(TouchableOpacity)`
  justify-content: center;
  padding: 0 17px;
  background-color: transparent;
  height: 35px;
`;

const IconContainer = styled(TouchableOpacity)`
  // putting it in absolute position so we can set a higher z-index. that way the icon still can be pressable
  position: absolute;
  top: 10px;
  align-self: center;
  z-index: 3;
`;
