import React from 'react';
import styled from 'styled-components';

import { View } from '../../core-ui';
import { BORDER_COLOR } from '../../constants/colors';

type Props = {
  images: Array<string>;
};

export default function PhotoGallery(props: Props) {
  let { images } = props;
  return (
    <Container flex>
      {images.map((item, index) => (
        <Photo key={index} src={item} alt={item} />
      ))}
    </Container>
  );
}

const Container = styled(View)`
  flex-wrap: wrap;
  flex-direction: row;
`;
const Photo = styled.img`
  height: 160px;
  width: 50%;
  object-fit: cover;
  border: 0.5px solid ${BORDER_COLOR};
  &:first-child {
    width: 100%;
    height: ;
  }
`;
