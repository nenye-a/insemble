import React from 'react';
import styled from 'styled-components';
import View from './View';
import {
  FRAGMENTED_PROGRESS_BAR_BACKGROUND,
  FRAGMENTED_PROGRESS_BAR_SECONDARY_COLOR,
  FRAGMENTED_PROGRESS_BAR_PRIMARY_COLOR,
} from '../constants/colors';
import { DEFAULT_BORDER_RADIUS } from '../constants/theme';

type Props = ViewProps & {
  progress: number | undefined; // in percentage value
  width?: number;
};

const LEFT_BAR_VALUE = 70;
const SPACING_WIDTH = 8;
const NUMBER_OF_SMALL_RIGHT_BARS = 3;

/**
 *  --------------------   ----   ----   ----
 * |    left bar 70     | | 10 | | 10 | | 10 |
 *  --------------------   ----   ----   ----
 */

export default function FragmentedProgressBar(props: Props) {
  // TODO: supports other partition, e.g left bar 60 or left bar 90 when necessary

  let { progress, width = 320, ...otherProps } = props;

  let spacesWidth = SPACING_WIDTH * NUMBER_OF_SMALL_RIGHT_BARS;
  let barsWidth = width - spacesWidth;
  let leftBarWidth = (LEFT_BAR_VALUE * barsWidth) / 100;
  let rightBarWidth = (barsWidth - leftBarWidth) / NUMBER_OF_SMALL_RIGHT_BARS;
  let remainingValuesForRightBars = progress && progress - LEFT_BAR_VALUE;

  return (
    <RowedView {...otherProps}>
      <BarContainer style={{ width: leftBarWidth.toString() + 'px' }}>
        <Bar
          style={{
            width:
              remainingValuesForRightBars && remainingValuesForRightBars > 0
                ? '100%'
                : ((progress as number) * 100) / LEFT_BAR_VALUE + '%',
          }}
        />
      </BarContainer>
      {Array.from({ length: NUMBER_OF_SMALL_RIGHT_BARS }, (_, idx) => {
        let fullWidth =
          remainingValuesForRightBars && remainingValuesForRightBars - (idx + 1) * 10 >= 0;
        let isEmpty = remainingValuesForRightBars && remainingValuesForRightBars - idx * 10 < 0;
        let progressWidth = fullWidth
          ? '100%'
          : isEmpty
          ? '0%'
          : ((((remainingValuesForRightBars as number) % 10) * 100) / 10).toString() + '%';
        return (
          <RowedView key={idx}>
            <Spacing />
            <BarContainer style={{ width: rightBarWidth.toString() + 'px' }}>
              <FragmentedBar
                style={{
                  width: progressWidth,
                }}
              />
            </BarContainer>
          </RowedView>
        );
      })}
    </RowedView>
  );
}

const RowedView = styled(View)`
  flex-direction: row;
`;

const BarContainer = styled(View)`
  height: 13px;
  background-color: ${FRAGMENTED_PROGRESS_BAR_BACKGROUND};
  border-radius: ${DEFAULT_BORDER_RADIUS};
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
`;

const Bar = styled(View)`
  height: 100%;
  background-color: ${FRAGMENTED_PROGRESS_BAR_SECONDARY_COLOR};
  overflow: hidden;
  border-radius: ${DEFAULT_BORDER_RADIUS};
`;

const Spacing = styled(View)`
  width: ${SPACING_WIDTH.toString() + 'px'};
`;

const FragmentedBar = styled(Bar)`
  background-color: ${FRAGMENTED_PROGRESS_BAR_PRIMARY_COLOR};
`;
