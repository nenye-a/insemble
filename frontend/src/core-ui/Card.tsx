import React, { ReactNode, ComponentProps } from 'react';
import styled from 'styled-components';

import View from './View';
import Text from './Text';
import { DEFAULT_BORDER_RADIUS, FONT_SIZE_SMALL, FONT_WEIGHT_BOLD } from '../constants/theme';
import { THEME_COLOR, WHITE, CARD_GREY_HEADER, TEXT_COLOR } from '../constants/colors';
import UpgradeButton from '../components/UpgradeButton';

type TextProps = ComponentProps<typeof Text>;
type ViewProps = ComponentProps<typeof View>;

type Props = ViewProps & {
  titleBackground?: 'purple' | 'white' | 'grey';
  title?: string;
  subTitle?: string;
  children?: ReactNode;
  titleContainerProps?: ViewProps;
  titleProps?: TextProps;
  rightTitleComponent?: ReactNode;
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
    ...otherProps
  } = props;
  return (
    <StyledCard {...otherProps}>
      {title && (
        <TitleContainer titleBackground={titleBackground} {...titleContainerProps}>
          <TitleComponents flex>
            <Row>
              <View flex>
                <Text fontWeight={FONT_WEIGHT_BOLD} {...titleProps}>
                  {title}
                </Text>
                <SubTitle>{subTitle}</SubTitle>
              </View>
              {isLocked ? <UpgradeButton /> : null}
            </Row>
            {rightTitleComponent}
          </TitleComponents>
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
  ${Text} {
    color: ${({ titleBackground }) => (titleBackground === 'purple' ? WHITE : TEXT_COLOR)};
  }
`;

const SubTitle = styled(Text)`
  font-size: ${FONT_SIZE_SMALL};
`;

const Row = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const TitleComponents = styled(Row)`
  justify-content: space-between;
`;
