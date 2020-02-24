import React from 'react';
import styled from 'styled-components';

import { View } from '../../core-ui';
import { BORDER_COLOR } from '../../constants/colors';
import Placeholder from '../../assets/images/image-placeholder.jpg';
type Props = {
  images: Array<string | null>;
};

export default function PhotoGallery(props: Props) {
  let { images } = props;
  if (images.length < 5) {
    images.push(null);
  }
  return (
    <Container flex>
      {images.map((item, index) => (
        <Photo key={index} src={item == null ? Placeholder : item} alt={item || ''} />
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
