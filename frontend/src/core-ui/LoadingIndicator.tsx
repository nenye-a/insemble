import React from 'react';
import styled from 'styled-components';
import loadingWhite from '../assets/images/loading-white.gif';
import loadingPurple from '../assets/images/loading-purple.gif';

type Props = {
  color: 'purple' | 'white';
};

export default function LoadingIndicator(props: Props) {
  let { color } = props;
  return <Icon src={color === 'white' ? loadingWhite : loadingPurple} />;
}

const Icon = styled.img`
  object-fit: contain;
  width: 25px;
  height: 25px;
`;
