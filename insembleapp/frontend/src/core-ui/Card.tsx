import React, { ReactNode, ComponentProps } from 'react';
import styled, { css } from 'styled-components';
import View from './View';
import Text from './Text';
import { DEFAULT_BORDER_RADIUS } from '../constants/theme';
import { THEME_COLOR, WHITE, CARD_HEADER_BACKGROUND } from '../constants/colors';

type TextProps = ComponentProps<typeof Text>;
type ViewProps = ComponentProps<typeof View>;

type Props = ViewProps & {
  headerMode?: 'default' | 'purple';
  title?: string;
  children: ReactNode;
  titleContainerProps?: ViewProps;
  titleProps?: TextProps;
};

export default function Card(props: Props) {
  let { headerMode, title, children, titleContainerProps, titleProps, ...otherProps } = props;
  return (
    <StyledCard {...otherProps}>
      {title && (
        <TitleContainer headerMode={headerMode} {...titleContainerProps}>
          <Text {...titleProps}>{title}</Text>
        </TitleContainer>
      )}
      {children}
    </StyledCard>
  );
}

type TitleContainerProps = ComponentProps<typeof View>;

const StyledCard = styled(View)`
  border-radius: ${DEFAULT_BORDER_RADIUS};
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TitleContainer = styled(View)<TitleContainerProps>`
  background-color: ${CARD_HEADER_BACKGROUND};
  padding: 12px;
  ${(props) =>
    props.headerMode === 'purple' &&
    css`
      background-color: ${THEME_COLOR};
      ${Text} {
        color: ${WHITE};
      }
    `}
`;
