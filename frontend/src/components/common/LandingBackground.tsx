import React from 'react';
import styled from 'styled-components';
import background from '../../assets/images/landlord-background.png';

export default function LandingBackground() {
  return <Image src={background} alt="Insemble" />;
}

const Image = styled('img')`
  height: 100%;
  width: 100%;
`;
