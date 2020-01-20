import React from 'react';
import { TouchableOpacity, View } from '.';
import styled from 'styled-components';
import SvgCheck from '../components/icons/check';
import { THEME_COLOR, SECONDARY_CHECKBOX, WHITE, CHECKBOX_BORDER } from '../constants/colors';

type Props = {
  isChecked: boolean;
  Type: 'primary' | 'secondary';
  onClick: () => void;
};

export default function Checkbox(props: Props) {
  let { isChecked, onClick, Type } = props;
  return (
    <Container onPress={onClick}>
      {isChecked ? (
        <CheckedBox
          style={
            Type === 'primary'
              ? { backgroundColor: THEME_COLOR }
              : { backgroundColor: SECONDARY_CHECKBOX }
          }
        >
          <SvgCheck />
        </CheckedBox>
      ) : (
        <UnCheckedBox />
      )}
    </Container>
  );
}

const Container = styled(TouchableOpacity)`
  width: 24px;
  height: 24px;
  background-color: ${WHITE};
  border-radius: 5px;
`;
const UnCheckedBox = styled(View)`
  border: solid;
  border-width: 1px;
  border-color: ${CHECKBOX_BORDER};
  border-radius: 5px;
  flex: 1;
`;
const CheckedBox = styled(View)`
  border-radius: 5px;
  flex: 1;
`;
