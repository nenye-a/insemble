import React from 'react';
import { IconProps } from '../../types/types';
import { THEME_COLOR } from '../../constants/colors';

const SvgCommute = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <g id="Group_124" data-name="Group 124" transform="translate(-344 -224)">
      <rect
        id="Rectangle_182"
        data-name="Rectangle 182"
        width="24"
        height="24"
        transform="translate(344 224)"
        fill="#fff"
        opacity="0"
      />
      <g id="noun_Car_699376" transform="translate(347 231)">
        <g id="Group_39" data-name="Group 39" transform="translate(0 0)">
          <path
            id="Path_41"
            data-name="Path 41"
            d="M7.059,23.944a.8.8,0,1,1,.794.833A.814.814,0,0,1,7.059,23.944Zm2.647,0A1.9,1.9,0,0,0,7.853,22a1.947,1.947,0,0,0,0,3.889A1.9,1.9,0,0,0,9.706,23.944Zm7.676,0a.8.8,0,1,1,.794.833A.814.814,0,0,1,17.382,23.944Zm2.647,0a1.855,1.855,0,1,0-1.853,1.944A1.9,1.9,0,0,0,20.029,23.944Z"
            transform="translate(-4.412 -15.889)"
            fill={props.fill || THEME_COLOR}
            fillRule="evenodd"
          />
          <path
            id="Path_42"
            data-name="Path 42"
            d="M5.824,16.722h5.559a2.385,2.385,0,1,1,4.765,0h1.324A.543.543,0,0,0,18,16.167V12.556A.543.543,0,0,0,17.471,12H4.235a.5.5,0,0,0-.075.006l-3.706.556a.548.548,0,0,0-.455.55v3.056a.543.543,0,0,0,.529.556h.529a2.443,2.443,0,0,1,2.382-2.5,2.443,2.443,0,0,1,2.382,2.5Z"
            transform="translate(0 -8.667)"
            fill={props.fill || THEME_COLOR}
            fillRule="evenodd"
          />
          <path
            id="Path_43"
            data-name="Path 43"
            d="M22.514,1.111,24.471,4.2a.514.514,0,0,0,.734.154.573.573,0,0,0,.147-.77L23.235.247A.523.523,0,0,0,22.794,0H16.176a.52.52,0,0,0-.407.2L13.123,3.533a.575.575,0,0,0,.068.782.512.512,0,0,0,.746-.071l2.489-3.134Z"
            transform="translate(-9.559 0)"
            fill={props.fill || THEME_COLOR}
            fillRule="evenodd"
          />
        </g>
      </g>
    </g>
  </svg>
);

export default SvgCommute;
