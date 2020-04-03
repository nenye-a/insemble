import React, { ReactNode, ComponentProps } from 'react';
import styled, { css } from 'styled-components';
import View from './View';
import Text from './Text';
import { DEFAULT_BORDER_RADIUS, FONT_SIZE_SMALL, FONT_WEIGHT_BOLD } from '../constants/theme';
import { THEME_COLOR, WHITE, CARD_GREY_HEADER, TEXT_COLOR } from '../constants/colors';
import { useViewport } from '../utils';
import { ViewPropsWithViewport } from '../constants/viewports';

type TextProps = ComponentProps<typeof Text>;
type ViewProps = ComponentProps<typeof View>;

export type CardProps = ViewProps & {
  titleBackground?: 'purple' | 'white' | 'grey';
  title?: string;
  subTitle?: string;
  children?: ReactNode;
  titleContainerProps?: ViewProps;
  titleProps?: TextProps;
  rightTitleComponent?: ReactNode;
};

export default function Card(props: CardProps) {
  let {
    title,
    subTitle,
    THEME_COLOR,
    children,
    titleContainerProps,
    titleProps,
    titleBackground,
    rightTitleComponent,
    ...otherProps
  } = props;
  let { isDesktop } = useViewport();
  let content = (
    <StyledCard isDesktop={isDesktop} {...otherProps}>
      {title && (
        <TitleContainer titleBackground={titleBackground} {...titleContainerProps}>
          <RowedView flex>
            <View flex>
              <Text fontWeight={FONT_WEIGHT_BOLD} {...titleProps}>
                {title}
              </Text>
              <SubTitle>{subTitle}</SubTitle>
            </View>
            {rightTitleComponent}
          </RowedView>
        </TitleContainer>
      )}
      {children}
    </StyledCard>
  );

  return isDesktop ? content : <MobileContainer>{content}</MobileContainer>;
}

type TitleContainerProps = ViewProps & {
  titleBackground: string;
};

const MobileContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
`;

const StyledCard = styled(View)<ViewPropsWithViewport>`
  border-radius: ${DEFAULT_BORDER_RADIUS};
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
  background-color: ${WHITE};
  overflow: hidden;
  background-color: ${WHITE};
  ${({ isDesktop }) =>
    !isDesktop &&
    css`
      width: 85vw;
      flex: 1;
    `}
`;

const TitleContainer = styled(View)<TitleContainerProps>`
  flex-direction: row;
  background-color: ${({ titleBackground }) =>
    titleBackground === 'purple'
      ? THEME_COLOR
      : titleBackground === 'grey'
      ? CARD_GREY_HEADER
      : WHITE};
  padding: 12px;
  ${Text} {
    color: ${({ titleBackground }) => (titleBackground === 'purple' ? WHITE : TEXT_COLOR)};
  }
`;

const SubTitle = styled(Text)`
  font-size: ${FONT_SIZE_SMALL};
`;

const RowedView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
