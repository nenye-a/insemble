import React from 'react';
import styled from 'styled-components';
import logo from '../../assets/images/insemble-logo.svg';

export default function InsembleLogo() {
  return <Image src={logo} alt="Insemble" />;
}

const Image = styled('img')`
  height: 36px;
  max-height: 100%;
`;
