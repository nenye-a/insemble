import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { Card, ProgressBar, Text, View, Button } from '../../core-ui';
import { THEME_COLOR } from '../../constants/colors';

type Props = {
  title: string;
  children: ReactNode;
  progress: number;
  buttons?: Array<Button>;
};

type Button = {
  text: string;
  onPress: () => void;
};

export default function OnboardingCard(props: Props) {
  let { title, children, progress, buttons } = props;
  return (
    <Container
      titleBackground="purple"
      title={title}
      titleProps={{ style: { textAlign: 'center' } }}
    >
      <ProgressBar progress={progress} />
      {children}
      {buttons && buttons.length > 0 && (
        <Footer flex>
          {buttons.map(({ onPress, text }, index) => {
            return index === 0 ? (
              <TransparentButton key={index} text={text} onPress={onPress} />
            ) : (
              <Button key={index} text={text} onPress={onPress} />
            );
          })}
        </Footer>
      )}
    </Container>
  );
}

const Container = styled(Card)`
  width: min(100vw, 720px);
`;

const Footer = styled(View)`
  height: 60px;
  flex-direction: row;
  padding: 20px;
  justify-content: flex-end;
  align-items: center;
`;

const TransparentButton = styled(Button)`
  background-color: transparent;
  margin-right: 8px;
  ${Text} {
    font-style: italic;
    color: ${THEME_COLOR};
  }
`;
