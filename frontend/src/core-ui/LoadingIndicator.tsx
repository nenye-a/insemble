import React from 'react';
import styled from 'styled-components';
import loadingWhite from '../assets/images/loading-white.gif';
import loadingPurple from '../assets/images/loading-purple.gif';

type Props = {
  color: 'purple' | 'white';
  visible?: boolean;
  size?: keyof typeof ICON_SIZES;
};

type IconProps = {
  size: string;
};

export default function LoadingIndicator(props: Props) {
  let { color, visible = true, size = 'small' as keyof typeof ICON_SIZES } = props;

  if (visible) {
    return <Icon src={color === 'white' ? loadingWhite : loadingPurple} size={ICON_SIZES[size]} />;
  }
  return null;
}

const ICON_SIZES = {
  small: '25px',
  large: '100px',
};

const Icon = styled.img<IconProps>`
  object-fit: contain;
  width: ${(props) => props.size};
  height: ${(props) => props.size};
`;
