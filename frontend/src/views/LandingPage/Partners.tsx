import React from 'react';
import styled from 'styled-components';
import { View } from '../../core-ui';

import tacolicious from '../../assets/images/tacolicious.png';
import sportclips from '../../assets/images/sportclips.png';
import ross from '../../assets/images/ross.png';
import planetFitness from '../../assets/images/planet-fitness.png';
import mcdonalds from '../../assets/images/mcdonalds.png';
import dunkinBrands from '../../assets/images/dunkin-brands.png';
import { BLACK } from '../../constants/colors';

const PARTNERS = [mcdonalds, tacolicious, ross, dunkinBrands, sportclips, planetFitness];
export default function Partners() {
  // TODO: map logos
  return (
    <Container>
      {PARTNERS.map((logo, index) => (
        <Image key={index} src={logo} />
      ))}
    </Container>
  );
}

const Container = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 140px;
  background-color: ${BLACK};
  overflow-x: scroll;
`;

const Image = styled.img`
  height: 50px;
  width: 150px;
  object-fit: contain;
  margin: 0 25px;
`;
