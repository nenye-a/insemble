import React from 'react';
import styled from 'styled-components';
import loadingWhite from '../assets/images/loading-white.gif';
import loadingPurple from '../assets/images/loading-purple.gif';

type Props = {
  color: 'purple' | 'white';
  visible?: boolean;
};

export default function LoadingIndicator(props: Props) {
  let { color, visible = true } = props;

  if (visible) {
    return <Icon src={color === 'white' ? loadingWhite : loadingPurple} />;
  }
  return null;
}

const Icon = styled.img`
  object-fit: contain;
  width: 25px;
  height: 25px;
`;
