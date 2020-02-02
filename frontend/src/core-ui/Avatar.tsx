import React from 'react';
import styled from 'styled-components';
import avatarImg from '../assets/images/profile-picture-placeholder.png';

type Props = ImageProps & {
  size?: Size;
  image?: string;
};

const SIZES = {
  small: '36px',
  medium: '48px',
  large: '120px',
};

type Size = keyof typeof SIZES;

export default function Avatar(props: Props) {
  let { image, size = 'medium' as Size } = props;
  return <Image src={image || avatarImg} width={SIZES[size]} height={SIZES[size]} />;
}

const Image = styled.img`
  border-radius: 50%;
  object-fit: cover;
`;
