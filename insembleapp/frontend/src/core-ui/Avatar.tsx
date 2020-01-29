import React from 'react';
import styled from 'styled-components';
import avatarImg from '../assets/images/profile-picture-placeholder.png';

type Props = ImageProps & {
  size?: Sizes;
  image?: string;
};

type Sizes = 'small' | 'medium' | 'large';

const SIZES: { [key in Sizes]: string } = {
  small: '36px',
  medium: '48px',
  large: '120px',
};

export default function Avatar(props: Props) {
  let { image, size = 'medium' as Sizes } = props;
  return <Image src={image || avatarImg} width={SIZES[size]} height={SIZES[size]} />;
}

const Image = styled.img`
  border-radius: 50%;
`;
