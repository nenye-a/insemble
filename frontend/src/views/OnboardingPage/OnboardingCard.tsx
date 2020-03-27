import React, { ReactNode, ComponentProps } from 'react';
import styled, { css } from 'styled-components';

import { Card, ProgressBar, Text, View, Button } from '../../core-ui';
import { useViewport } from '../../utils';
import { THEME_COLOR, BACKGROUND_COLOR } from '../../constants/colors';
import { DEFAULT_BORDER_RADIUS } from '../../constants/theme';

type Props = ViewProps & {
  title: string;
  children: ReactNode;
  progress: number;
  buttons?: Array<Button>;
  canPressNext?: boolean;
};

type Button = {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export default function OnboardingCard(props: Props) {
  let { title, children, progress, buttons, canPressNext, ...otherProps } = props;
  let { isDesktop } = useViewport();

  return (
    <Container
      titleBackground="purple"
      title={title}
      titleProps={{ style: { textAlign: 'center' } }}
      isDesktop={isDesktop}
      titleContainerProps={{
        style: isDesktop
          ? {
              borderTopLeftRadius: DEFAULT_BORDER_RADIUS,
              borderTopRightRadius: DEFAULT_BORDER_RADIUS,
            }
          : { borderRadius: 0 },
      }}
      {...otherProps}
    >
      <ProgressBar progress={progress} />
      <View flex style={{ zIndex: 1 }}>
        {children}
      </View>
      {buttons && buttons.length > 1 && (
        <Footer>
          {buttons.map(({ onPress, text, loading }, index) => {
            return index === 0 ? (
              <TransparentButton key={index} text={text} onPress={onPress} />
            ) : (
              <Button
                key={index}
                text={text}
                onPress={onPress}
                disabled={!canPressNext}
                loading={loading}
              />
            );
          })}
        </Footer>
      )}
    </Container>
  );
}

type ContainerProps = ComponentProps<typeof Card> & {
  isDesktop: boolean;
};

const Container = styled(Card)<ContainerProps>`
  ${({ isDesktop }) =>
    isDesktop
      ? css`
          width: 720px;
          border-radius: ${DEFAULT_BORDER_RADIUS};
          min-height: 80vh;
        `
      : css`
          width: 100vw;
          border-radius: 0px;
          min-height: 100%;
        `}
  overflow: visible;
`;

const Footer = styled(View)`
  height: 60px;
  flex-direction: row;
  padding: 20px;
  justify-content: flex-end;
  align-items: center;
  background-color: ${BACKGROUND_COLOR};
`;

const TransparentButton = styled(Button)`
  background-color: transparent;
  margin-right: 8px;
  ${Text} {
    font-style: italic;
    color: ${THEME_COLOR};
  }
`;
