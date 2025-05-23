import React from 'react';
import { IconProps } from '../../types/types';
import { TEXT_COLOR } from '../../constants/colors';

const SvgLock = ({ fill, ...otherProps }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="10.357"
    height="13.316"
    viewBox="0 0 10.357 13.316"
    {...otherProps}
  >
    <g id="noun_Lock_317686" transform="translate(-359 -317)">
      <path
        id="Path_4006"
        data-name="Path 4006"
        d="M23.877,10.178V6.48A1.422,1.422,0,0,0,22.472,5H18.092A1.6,1.6,0,0,0,16.48,6.48v3.7A1.484,1.484,0,0,0,15,11.658v5.178a1.484,1.484,0,0,0,1.48,1.48h7.4a1.484,1.484,0,0,0,1.48-1.48V11.658A1.484,1.484,0,0,0,23.877,10.178Zm-2.959,5.178a.74.74,0,1,1-1.48,0V13.137a.74.74,0,1,1,1.48,0Zm1.48-5.178H17.959V6.48H22.4Z"
        transform="translate(344 312)"
        fill={fill || TEXT_COLOR}
      />
    </g>
  </svg>
);

export default SvgLock;
