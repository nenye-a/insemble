import React, { ReactNode, ComponentProps } from 'react';
import styled from 'styled-components';
import View from './View';
import Text from './Text';
import { DEFAULT_BORDER_RADIUS, FONT_SIZE_SMALL } from '../constants/theme';
import { THEME_COLOR, WHITE, CARD_GREY_HEADER } from '../constants/colors';

type TextProps = ComponentProps<typeof Text>;
type ViewProps = ComponentProps<typeof View>;

type Props = ViewProps & {
  titleBackground?: 'default' | 'purple' | 'grey';
  title?: string;
  subTitle?: string;
  children: ReactNode;
  titleContainerProps?: ViewProps;
  titleProps?: TextProps;
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
    ...otherProps
  } = props;
  return (
    <StyledCard {...otherProps}>
      {title && (
        <TitleContainer titleBackground={titleBackground} {...titleContainerProps}>
          <View flex>
            <Title {...titleProps}>{title}</Title>
            <SubTitle>{subTitle}</SubTitle>
          </View>
        </TitleContainer>
      )}
      {children}
    </StyledCard>
  );
}

type TitleContainerProps = ViewProps & {
  titleBackground: string;
};

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
`;
const Title = styled(Text)`
  color: ${WHITE};
`;
const SubTitle = styled(Text)`
  color: ${WHITE};
  font-size: ${FONT_SIZE_SMALL};
`;
