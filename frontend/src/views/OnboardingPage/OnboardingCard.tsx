import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { Card, ProgressBar, Text, View, Button } from '../../core-ui';
import { THEME_COLOR, BACKGROUND_COLOR } from '../../constants/colors';
import { DEFAULT_BORDER_RADIUS } from '../../constants/theme';

type Props = {
  title: string;
  children: ReactNode;
  progress: number;
  buttons: Array<Button>;
  canPressNext?: boolean;
};

type Button = {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export default function OnboardingCard(props: Props) {
  let { title, children, progress, buttons, canPressNext } = props;

  return (
    <Container
      titleBackground="purple"
      title={title}
      titleProps={{ style: { textAlign: 'center' } }}
    >
      <ProgressBar progress={progress} />
      <View flex style={{ zIndex: 1 }}>
        {children}
      </View>
      {buttons.length > 1 && (
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

const Container = styled(Card)`
  width: min(100vw, 720px);
  min-height: 80vh;
  overflow: visible;
  border-radius: ${DEFAULT_BORDER_RADIUS};
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
