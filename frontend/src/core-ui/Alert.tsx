import React from 'react';
import styled from 'styled-components';

import View from './View';
import Text from './Text';
import { THEME_COLOR, ALERT_BACKGROUND_COLOR } from '../constants/colors';
import { FONT_SIZE_SMALL, DEFAULT_BORDER_RADIUS } from '../constants/theme';
import SvgInfo from '../components/icons/info';
import { formatGraphQLError } from '../utils';
import SvgClose from '../components/icons/close';
import TouchableOpacity from './TouchableOpacity';

type Props = ViewProps & {
  text: string;
  visible?: boolean;
  onClose?: () => void;
};

export default function Alert(props: Props) {
  let { visible, text, onClose, ...otherProps } = props;
  // TODO: Discuss and change the fix regarding this issue https://github.com/apollographql/apollo-feature-requests/issues/46
  let formattedText = formatGraphQLError(text);
  if (visible) {
    return (
      <Container {...otherProps}>
        <Row>
          <SvgInfo />
          <Message color={THEME_COLOR} fontSize={FONT_SIZE_SMALL}>
            {formattedText}
          </Message>
        </Row>
        {onClose ? (
          <TouchableOpacity onPress={onClose}>
            <SvgClose fill={THEME_COLOR} style={{ height: 18, width: 18 }} />
          </TouchableOpacity>
        ) : null}
      </Container>
    );
  }
  return null;
}

const Container = styled(View)`
  border: 1px solid ${THEME_COLOR};
  flex-direction: row;
  padding: 9px 12px;
  background-color: ${ALERT_BACKGROUND_COLOR};
  border-radius: ${DEFAULT_BORDER_RADIUS};
  justify-content: space-between;
`;

const Row = styled(View)`
  flex-direction: row;
`;

const Message = styled(Text)`
  margin-left: 8px;
`;
