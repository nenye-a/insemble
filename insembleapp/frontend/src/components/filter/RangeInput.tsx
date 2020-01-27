import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

import { View, TextInput, Text } from '../../core-ui';

type Props = ViewProps & {
  lowValue?: string;
  highValue?: string;
  onLowRangeInputChange?: (value: string) => void;
  onHighRangeInputChange?: (value: string) => void;
};
export default function RangeInput(props: Props) {
  let { lowValue, highValue, onLowRangeInputChange, onHighRangeInputChange, ...otherProps } = props;
  return (
    <Container {...otherProps}>
      <TextInput
        placeholder="Low"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          onLowRangeInputChange && onLowRangeInputChange(e.target.value);
        }}
        value={lowValue}
      />
      <Dash>-</Dash>
      <TextInput
        placeholder="High"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          onHighRangeInputChange && onHighRangeInputChange(e.target.value);
        }}
        value={highValue}
      />
    </Container>
  );
}

const Container = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  width: '100%';
  align-items: center;
  margin: 4px 12px;
`;

const Dash = styled(Text)`
  margin: 0px 26px;
`;
