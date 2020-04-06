import React from 'react';
import { IconProps } from '../../types/types';
import { THEME_COLOR } from '../../constants/colors';

const SvgAmenities = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" {...props}>
    <g id="Group_1326" data-name="Group 1326" transform="translate(-44 -512)">
      <g id="Group_1324" data-name="Group 1324" transform="translate(-1.695 476.056)">
        <path
          id="Path_4009"
          data-name="Path 4009"
          d="M51.56,43.551h1.024V41.23H65.765v2.321h1.024V54.9H51.56Zm2.218,0H64.571V42.424H53.778Zm.36,4.732H64.212v4.038H54.138Zm2.925.625h4.223v.917H57.063Zm6.121,6.738h2.026v1.236H63.185Zm-10.046,0h2.026v1.236H53.138Zm12.009-8.3v5.908H53.2V47.348Z"
          fill={props.fill || THEME_COLOR}
          fillRule="evenodd"
        />
      </g>
      <rect
        id="Rectangle_1557"
        data-name="Rectangle 1557"
        width="26"
        height="26"
        transform="translate(44 512)"
        fill="rgba(255,255,255,0)"
      />
    </g>
  </svg>
);

export default SvgAmenities;
