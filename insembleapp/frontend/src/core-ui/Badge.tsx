import React, { ComponentProps } from 'react';
import styled from 'styled-components';
import View from './View';
import Text from './Text';
import { BADGE_COLOR, WHITE } from '../constants/colors';
import { FONT_SIZE_XSMALL } from '../constants/theme';

type Props = ComponentProps<typeof View> & {
  text: string;
};

export default function Badge(props: Props) {
  let { text, ...otherProps } = props;
  return (
    <Container {...otherProps}>
      <Content fontSize={FONT_SIZE_XSMALL}>{text}</Content>
    </Container>
  );
}

const Container = styled(View)`
  height: 14px;
  min-width: 14px;
  padding: 0px 4px;
  background-color: ${BADGE_COLOR};
  border-radius: 7px;
  justify-content: center;
  align-items: center;
`;

const Content = styled(Text)`
  color: ${WHITE};
`;
