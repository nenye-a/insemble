import React from 'react';
import styled from 'styled-components';
import View from './View';
import { BAR_BACKGROUND, PROGRESS_BAR_BACKGROUND } from '../constants/colors';

type Props = {
  progress: number;
};

type BarProps = {
  width: string;
};

export default function ProgressBar(props: Props) {
  let { progress } = props;
  let progressPercentage = progress * 100 + '%';
  return (
    <Container>
      <Bar width={progressPercentage} />
    </Container>
  );
}

const Container = styled(View)`
  height: 8px;
  position: relative;
  background-color: ${PROGRESS_BAR_BACKGROUND};
  width: 100%;
`;

const Bar = styled(View)<BarProps>`
  height: 100%;
  width: ${(props) => props.width}
  background-color: ${BAR_BACKGROUND}
  overflow: hidden;
  border-radius: ${(props) => (props.width === '100%' ? '0' : '0 4px 4px 0')};
  transition: 0.4s linear;
  transition-property: width, background-color;
`;
