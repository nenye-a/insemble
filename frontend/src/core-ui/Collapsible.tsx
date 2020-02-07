import React, { ReactNode, CSSProperties } from 'react';
import styled, { css } from 'styled-components';

import View from './View';
import Text from './Text';
import TouchableOpacity from './TouchableOpacity';
import { WHITE, THEME_COLOR } from '../constants/colors';
import { FONT_WEIGHT_MEDIUM } from '../constants/theme';
import arrowicon from '../assets/images/arrow-down.svg';

type Props = {
  title: string;
  isCollapsed: boolean;
  onChange: () => void;
  children: ReactNode;
  containerStyle?: CSSProperties;
};

type ContentContainerProps = {
  isCollapsed: boolean;
};

type IconProps = {
  isCollapsed: boolean;
};

export default function Collapsible(props: Props) {
  let { isCollapsed, onChange, title, children, containerStyle } = props;
  return (
    <View style={containerStyle}>
      <TitleContainer onPress={onChange}>
        <Text color={THEME_COLOR} fontWeight={FONT_WEIGHT_MEDIUM}>
          {title}
        </Text>
        <Icon src={arrowicon} isCollapsed={isCollapsed} />
      </TitleContainer>
      <ContentContainer isCollapsed={isCollapsed}>{children}</ContentContainer>
    </View>
  );
}

const TitleContainer = styled(TouchableOpacity)`
  height: 43px;
  padding: 12px 24px;
  background-color: ${WHITE};
  flex-direction: row;
  justify-content: space-between;
`;

const ContentContainer = styled(View)<ContentContainerProps>`
  overflow: hidden;
  transition: all 0.5s ease-out;
  height: 100%;
  opacity: 1;
  ${(props) =>
    props.isCollapsed &&
    css`
      height: 0;
      opacity: 0;
    `}
`;

const Icon = styled.img<IconProps>`
  width: 24px;
  height: 24px;
  transform: ${(props) => (props.isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)')};
  transition-duration: 200ms;
`;
