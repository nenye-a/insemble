import React from 'react';
import { Range } from 'rc-slider';
import styled from 'styled-components';

import { View, Text } from '../../core-ui';
import { THEME_COLOR, UNSELECTED_TEXT_COLOR } from '../../constants/colors';
import { FONT_SIZE_SMALL } from '../../constants/theme';

type Props = {
  onSliderChange?: (values: Array<number>) => void;
  values?: Array<number>;
  maximum?: number;
  minimum?: number;
  postFix?: string;
};

export default function SliderFilter(props: Props) {
  let { values, maximum, minimum, onSliderChange, postFix = '' } = props;
  let minRange = values && values.length > 0 ? values[0].toString() + postFix : '';
  let maxRange = values && values.length > 1 ? values[1].toString() + postFix : '';

  let selectedRange = `${minRange} - ${maxRange}`;
  let handleStyle = {
    backgroundColor: THEME_COLOR,
    borderColor: THEME_COLOR,
    boxShadow: '0px 0px 1px rgba(0,0,0,0.16)',
    height: 24,
    width: 24,
    marginTop: -8,
  };
  return (
    <Slider>
      <Range
        defaultValue={values}
        max={maximum}
        min={minimum}
        allowCross={false}
        onChange={(value) => onSliderChange && onSliderChange(value)}
        trackStyle={[{ backgroundColor: THEME_COLOR, height: 8 }]}
        railStyle={{ height: 8 }}
        handleStyle={[handleStyle, handleStyle]}
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
