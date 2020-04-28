import React, { ReactNode, ComponentProps } from 'react';
import styled, { css } from 'styled-components';

import View from './View';
import Text from './Text';
import {
  DEFAULT_BORDER_RADIUS,
  FONT_SIZE_SMALL,
  FONT_WEIGHT_MEDIUM,
  FONT_SIZE_MEDIUM,
} from '../constants/theme';
import { THEME_COLOR, WHITE, CARD_GREY_HEADER, TEXT_COLOR } from '../constants/colors';
import UpgradeButton from '../components/UpgradeButton';
import { Role } from '../types/types';

type TextProps = ComponentProps<typeof Text>;
type ViewProps = ComponentProps<typeof View>;

type CardMode = 'primary' | 'secondary';

type Props = ViewProps & {
  titleBackground?: 'purple' | 'white' | 'grey';
  title?: string;
  subTitle?: string;
  children?: ReactNode;
  titleContainerProps?: ViewProps;
  titleProps?: TextProps;
  rightTitleComponent?: ReactNode;
  mode?: CardMode;
  role?: Role;
};

export default function Card(props: Props) {
  let {
    title,
    subTitle,
    THEME_COLOR,
    children,
    titleContainerProps,
    titleProps,
    titleBackground,
    rightTitleComponent,
    isLocked = false,
    mode = 'primary',
    role,
    ...otherProps
  } = props;

  let titleContent = (
    <>
      <Title mode={mode} {...titleProps}>
        {title}
      </Title>
      <SubTitle>{subTitle}</SubTitle>
    </>
  );

  return (
    <StyledCard {...otherProps}>
      {title && (
        <TitleContainer
          mode={mode}
          titleBackground={mode === 'secondary' ? 'purple' : titleBackground}
          {...titleContainerProps}
        >
          <RowedView flex>
            {isLocked ? (
              <Row flex>
                {titleContent}
                <UpgradeButton role={role} />
              </Row>
            ) : (
              <View flex>{titleContent}</View>
            )}
            {rightTitleComponent}
          </RowedView>
        </TitleContainer>
      )}
      {children}
    </StyledCard>
  );
}

type TitleContainerProps = ViewProps & {
  titleBackground: string;
  mode: CardMode;
};

type TitleProps = TextProps & {
  mode: CardMode;
};

const Title = styled(Text)<TitleProps>`
  ${({ mode }) =>
    mode === 'secondary'
      ? css`
          font-size: ${FONT_SIZE_MEDIUM};
        `
      : css`
          font-weight: ${FONT_WEIGHT_MEDIUM};
        `}
`;

const StyledCard = styled(View)`
  border-radius: ${DEFAULT_BORDER_RADIUS};
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
  background-color: ${WHITE};
  overflow: hidden;
  background-color: ${WHITE};
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
  ${({ mode }) =>
    mode === 'secondary' &&
    css`
      text-align: center;
      height: 54px;
      justify-content: center;
    `}
`;

const SubTitle = styled(Text)`
  font-size: ${FONT_SIZE_SMALL};
`;

const Row = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const RowedView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
