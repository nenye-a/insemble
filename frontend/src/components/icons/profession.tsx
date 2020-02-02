import React from 'react';
import { IconProps } from '../../types/types';
import { THEME_COLOR } from '../../constants/colors';

const SvgProfession = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <g id="Group_125" data-name="Group 125" transform="translate(-344 -224)">
      <rect
        id="Rectangle_182"
        data-name="Rectangle 182"
        width="24"
        height="24"
        transform="translate(344 224)"
        fill="#fff"
        opacity="0"
      />
      <g id="noun_Suitcase_2415780" transform="translate(347 228)">
        <g id="Layer_2" data-name="Layer 2" transform="translate(0 0)">
          <path
            id="Path_44"
            data-name="Path 44"
            d="M17.4,5.462H13.95V4.514A1.5,1.5,0,0,0,12.474,3H8.226A1.5,1.5,0,0,0,6.75,4.514v.948H3.3a1.975,1.975,0,0,0-1.95,2V9.615h18V7.462A1.975,1.975,0,0,0,17.4,5.462ZM7.95,4.514a.28.28,0,0,1,.276-.283h4.248a.28.28,0,0,1,.276.283v.948H7.95Z"
            transform="translate(-1.35 -3)"
            fill={props.fill || THEME_COLOR}
          />
          <path
            id="Path_45"
            data-name="Path 45"
            d="M1.35,21.9a1.975,1.975,0,0,0,1.95,2H17.4a1.975,1.975,0,0,0,1.95-2V15.75h-18Z"
            transform="translate(-1.35 -7.904)"
            fill={props.fill || THEME_COLOR}
          />
        </g>
      </g>
    </g>
  </svg>
);

export default SvgProfession;
