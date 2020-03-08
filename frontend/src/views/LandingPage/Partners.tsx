import React from 'react';
import styled from 'styled-components';
import partnersImg from '../../assets/images/partners.png';

export default function Partners() {
  // TODO: map logos
  return <Image src={partnersImg} />;
}

const Image = styled.img`
  width: 100%;
`;
