import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { View } from '../../core-ui';
import { BACKGROUND_COLOR } from '../../constants/colors';
import { DEFAULT_BORDER_RADIUS } from '../../constants/theme';

type Props = {
  children?: ReactNode;
};
export default function OnboardingFooter({ children }: Props) {
  return <Footer>{children}</Footer>;
}

const Footer = styled(View)`
  height: 60px;
  flex-direction: row;
  padding: 20px;
  justify-content: flex-end;
  align-items: center;
  background-color: ${BACKGROUND_COLOR};
  border-radius: 0 0 ${DEFAULT_BORDER_RADIUS} ${DEFAULT_BORDER_RADIUS};
`;
