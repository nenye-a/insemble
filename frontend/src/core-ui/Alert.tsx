import React from 'react';
import styled from 'styled-components';

import View from './View';
import Text from './Text';
import { THEME_COLOR, ALERT_BACKGROUND_COLOR } from '../constants/colors';
import { FONT_SIZE_SMALL, DEFAULT_BORDER_RADIUS } from '../constants/theme';
import SvgInfo from '../components/icons/info';

type Props = ViewProps & {
  text: string;
  visible?: boolean;
};

export default function Alert(props: Props) {
  let { visible, text, ...otherProps } = props;
  if (visible) {
    return (
      <Container {...otherProps}>
        <SvgInfo />
        <Message color={THEME_COLOR} fontSize={FONT_SIZE_SMALL}>
          {text}
        </Message>
      </Container>
    );
  }
  return null;
}

const Container = styled(View)`
  border: 0.5px solid ${THEME_COLOR};
  flex-direction: row;
  padding: 9px 12px;
  background-color: ${ALERT_BACKGROUND_COLOR};
  border-radius: ${DEFAULT_BORDER_RADIUS};
`;

const Message = styled(Text)`
  margin-left: 8px;
`;
