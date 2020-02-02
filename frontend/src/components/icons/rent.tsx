import React from 'react';
import { IconProps } from '../../types/types';
import { THEME_COLOR } from '../../constants/colors';

const SvgRent = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <g id="Group_130" data-name="Group 130" transform="translate(-299 -331)">
      <rect
        id="Rectangle_182"
        data-name="Rectangle 182"
        width="24"
        height="24"
        transform="translate(299 331)"
        fill="#fff"
        opacity="0"
      />
      <g id="Group_192" data-name="Group 192" transform="translate(303 334)">
        <path
          id="Path_56"
          data-name="Path 56"
          d="M10.027,0l-8,6.029V7.4l8-6.029,8,6.029V6.029Z"
          transform="translate(-2.027)"
          fill={props.fill || THEME_COLOR}
        />
        <path
          id="Path_57"
          data-name="Path 57"
          d="M13.543,7.974l-6.72,5.054v10.7h13.44v-10.7Zm.523,12.335v1.172h-.674V20.343a3,3,0,0,1-1.637-.5l.257-.755a2.75,2.75,0,0,0,1.541.485,1.145,1.145,0,0,0,1.273-1.1c0-.62-.417-1-1.209-1.342-1.091-.451-1.765-.969-1.765-1.95a1.813,1.813,0,0,1,1.616-1.815V12.225h.663v1.093a2.743,2.743,0,0,1,1.391.395l-.267.744a2.489,2.489,0,0,0-1.348-.383.994.994,0,0,0-1.134.969c0,.586.4.879,1.327,1.285,1.1.473,1.658,1.06,1.658,2.063A1.926,1.926,0,0,1,14.066,20.309Z"
          transform="translate(-5.543 -5.731)"
          fill={props.fill || THEME_COLOR}
        />
      </g>
    </g>
  </svg>
);

export default SvgRent;
