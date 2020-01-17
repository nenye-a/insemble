import React, { ReactNode, ComponentProps } from 'react';
import styled from 'styled-components';
import View from './View';
import Text from './Text';
import { DEFAULT_BORDER_RADIUS } from '../constants/theme';
import { THEME_COLOR, WHITE } from '../constants/colors';
import { FONT_SIZE_SMALL } from '../constants/theme';

type TextProps = ComponentProps<typeof Text>;
type ViewProps = ComponentProps<typeof View>;

type Props = ViewProps & {
  mode?: 'default' | 'with-title';
  title?: string;
  subTitle?: string;
  children: ReactNode;
  titleContainerProps?: ViewProps;
  titleProps?: TextProps;
};

export default function Card(props: Props) {
  let { mode, title, subTitle, children, titleContainerProps, titleProps, ...otherProps } = props;
  return (
    <StyledCard {...otherProps}>
      {mode === 'with-title' && (
        <TitleContainer {...titleContainerProps}>
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

const StyledCard = styled(View)`
  border-radius: ${DEFAULT_BORDER_RADIUS};
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
  background-color: ${WHITE};
  overflow: hidden;
  background-color: ${WHITE};
`;

const TitleContainer = styled(View)`
  flex-direction: row;
  background-color: ${THEME_COLOR};
  padding: 12px;
`;
const Title = styled(Text)`
  color: ${WHITE};
`;
const SubTitle = styled(Text)`
  color: ${WHITE};
  font-size: ${FONT_SIZE_SMALL};
`;
