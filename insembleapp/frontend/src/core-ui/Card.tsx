import React, { ReactNode, ComponentProps } from 'react';
import styled from 'styled-components';
import View from './View';
import Text from './Text';
import { DEFAULT_BORDER_RADIUS } from '../constants/theme';
import { THEME_COLOR, WHITE } from '../constants/colors';

type TextProps = ComponentProps<typeof Text>;
type ViewProps = ComponentProps<typeof View>;

type Props = ViewProps & {
  mode?: 'default' | 'with-title';
  title?: string;
  children: ReactNode;
  titleContainerProps?: ViewProps;
  titleProps?: TextProps;
};

export default function Card(props: Props) {
  let { mode, title, children, titleContainerProps, titleProps } = props;
  return (
    <StyledCard>
      {mode === 'with-title' && (
        <TitleContainer {...titleContainerProps}>
          <Title {...titleProps}>{title}</Title>
        </TitleContainer>
      )}
      {children}
    </StyledCard>
  );
}

const StyledCard = styled(View)`
  border-radius: ${DEFAULT_BORDER_RADIUS};
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TitleContainer = styled(View)`
  background-color: ${THEME_COLOR};
  padding: 12px;
`;

const Title = styled(Text)`
  color: ${WHITE};
`;
