import React from 'react';
import { IconProps } from '../../types/types';
import { THEME_COLOR } from '../../constants/colors';

const SvgHeart = ({ fill, ...otherProps }: IconProps) => (
  <svg
    id="favorite-24px_3_"
    data-name="favorite-24px (3)"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    {...otherProps}
  >
    <path id="Path_3943" data-name="Path 3943" d="M0,0H24V24H0Z" fill="none" />
    <path
      id="heard-filled"
      d="M13.35,20.13a2,2,0,0,1-2.69-.01l-.11-.1C5.3,15.27,1.87,12.16,2,8.28A5.459,5.459,0,0,1,4.34,3.99,5.8,5.8,0,0,1,12,5.09a5.784,5.784,0,0,1,7.66-1.1A5.459,5.459,0,0,1,22,8.28c.14,3.88-3.3,6.99-8.55,11.76l-.1.09Z"
      fill={fill || THEME_COLOR}
    />
    <path
      id="heart-border"
      d="M19.66,3.99A5.8,5.8,0,0,0,12,5.09a5.784,5.784,0,0,0-7.66-1.1A5.472,5.472,0,0,0,2,8.28c-.14,3.88,3.3,6.99,8.55,11.76l.1.09a2,2,0,0,0,2.69-.01l.11-.1C18.7,15.26,22.13,12.15,22,8.27a5.468,5.468,0,0,0-2.34-4.28ZM12.1,18.55l-.1.1-.1-.1C7.14,14.24,4,11.39,4,8.5A3.418,3.418,0,0,1,7.5,5a3.909,3.909,0,0,1,3.57,2.36h1.87A3.885,3.885,0,0,1,16.5,5,3.418,3.418,0,0,1,20,8.5C20,11.39,16.86,14.24,12.1,18.55Z"
      fill={THEME_COLOR}
    />
  </svg>
);

export default SvgHeart;
