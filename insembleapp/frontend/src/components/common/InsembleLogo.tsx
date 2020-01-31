import React from 'react';
import styled from 'styled-components';
import logo from '../../assets/images/insemble-logo.svg';
import whitelogo from '../../assets/images/insemble-logo-white.svg';

type Props = {
  color: 'white' | 'purple';
};

export default function InsembleLogo(props: Props) {
  let { color } = props;
  return <Image src={color === 'white' ? whitelogo : logo} alt="Insemble" />;
}

const Image = styled('img')`
  height: 36px;
  max-height: 100%;
`;
