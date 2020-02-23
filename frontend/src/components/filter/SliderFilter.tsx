import React from 'react';
import { Range } from 'rc-slider';
import styled from 'styled-components';

import { View, Text } from '../../core-ui';
import { THEME_COLOR, UNSELECTED_TEXT_COLOR, SLIDER_SECONDARY_COLOR } from '../../constants/colors';
import { FONT_SIZE_SMALL } from '../../constants/theme';

type Props = {
  onSliderChange?: (values: Array<number>) => void;
  values?: Array<number>;
  maximum?: number;
  minimum?: number;
  prefix?: string;
  postfix?: string;
  disabled?: boolean;
};

export default function SliderFilter(props: Props) {
  let { values, maximum, minimum, onSliderChange, prefix = '', postfix = '', disabled } = props;
  let minRange = minimum != null ? prefix + minimum.toString() + postfix : '';
  let maxRange = maximum ? prefix + maximum.toString() + postfix + '+' : '';
  let minSelectedRange = values && values.length > 0 ? prefix + values[0].toString() + postfix : '';
  let maxSelectedRange = values && values.length > 1 ? prefix + values[1].toString() + postfix : '';
  let selectedRange = `${minSelectedRange} - ${maxSelectedRange}`;

  return (
    <Slider>
      <Range
        disabled={disabled}
        value={values}
        max={maximum}
        min={minimum}
        allowCross={false}
        onChange={(value) => onSliderChange && onSliderChange(value)}
        style={{
          position: 'relative',
          height: 20,
          paddingTop: 5,
          paddingBottom: 5,
          width: '100%',
          touchAction: 'none',
          boxSizing: 'border-box',
        }}
        trackStyle={[
          {
            backgroundColor: disabled ? SLIDER_SECONDARY_COLOR : THEME_COLOR,
            height: 8,
            position: 'absolute',
          },
        ]}
        railStyle={{
          height: 8,
          position: 'absolute',
          width: '100%',
          borderRadius: 4,
          borderColor: SLIDER_SECONDARY_COLOR,
          borderWidth: 1,
          borderStyle: 'solid',
        }}
        handleStyle={[
          {
            backgroundColor: disabled ? SLIDER_SECONDARY_COLOR : THEME_COLOR,
            borderColor: disabled ? SLIDER_SECONDARY_COLOR : THEME_COLOR,
            boxShadow: '0px 0px 1px rgba(0,0,0,0.16)',
            height: 24,
            width: 24,
            marginTop: -8,
            position: 'absolute',
            cursor: 'pointer',
            borderRadius: 12,
          },
          {
            backgroundColor: disabled ? SLIDER_SECONDARY_COLOR : THEME_COLOR,
            borderColor: disabled ? SLIDER_SECONDARY_COLOR : THEME_COLOR,
            boxShadow: '0px 0px 1px rgba(0,0,0,0.16)',
            height: 24,
            width: 24,
            marginTop: -8,
            position: 'absolute',
            cursor: 'pointer',
            borderRadius: 12,
          },
        ]}
      />
      <SliderText>
        <Text fontSize={FONT_SIZE_SMALL} color={UNSELECTED_TEXT_COLOR}>
          {minRange}
        </Text>
        {values && values.length > 1 && <Text fontSize={FONT_SIZE_SMALL}>{selectedRange}</Text>}
        <Text fontSize={FONT_SIZE_SMALL} color={UNSELECTED_TEXT_COLOR}>
          {maxRange}
        </Text>
      </SliderText>
    </Slider>
  );
}

const Slider = styled(View)`
  margin: 12px;
  padding: 0 12px;
`;

const SliderText = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding: 0 12px;
  margin: 4px 0;
`;
