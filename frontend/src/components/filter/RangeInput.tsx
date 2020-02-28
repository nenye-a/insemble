import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

import { View, TextInput } from '../../core-ui';

type Props = ViewProps & {
  lowValue?: string;
  onLowRangeInputChange?: (value: string) => void;
};
export default function RangeInput(props: Props) {
  let { lowValue, highValue, onLowRangeInputChange, onHighRangeInputChange, ...otherProps } = props;
  return (
    <Container {...otherProps}>
      <TextInput
        placeholder="" // not that previous placeholder is "Low". In the short term, removing due to use for minumum.
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          onLowRangeInputChange && onLowRangeInputChange(e.target.value);
        }}
        value={lowValue}
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
