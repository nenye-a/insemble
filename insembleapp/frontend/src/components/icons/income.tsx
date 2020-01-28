import React from 'react';
import { IconProps } from '../../types/types';
import { THEME_COLOR } from '../../constants/colors';

const SvgIncome = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <g id="Group_120" data-name="Group 120" transform="translate(-299 -331)">
      <rect
        id="Rectangle_182"
        data-name="Rectangle 182"
        width="24"
        height="24"
        transform="translate(299 331)"
        fill="#fff"
        opacity="0"
      />
      <g id="noun_dollar_918969" transform="translate(302 334)">
        <g id="Group_37" data-name="Group 37" transform="translate(0 0)">
          <path
            id="Path_39"
            data-name="Path 39"
            d="M18,1001.362a9,9,0,1,0,9,9A9,9,0,0,0,18,1001.362Zm0,2.571a.857.857,0,0,1,.857.857v.536a3.846,3.846,0,0,1,2.451,1.728.859.859,0,0,1-1.473.884,2.2,2.2,0,0,0-1.835-1,2.049,2.049,0,0,0-1.286.388,1.061,1.061,0,0,0-.429.9c.005.751,1.254,1.028,2.036,1.339a11.193,11.193,0,0,1,1.888.79,2.568,2.568,0,0,1,1.219,2.156,2.864,2.864,0,0,1-1.058,2.223,3.485,3.485,0,0,1-1.513.7v.509a.857.857,0,0,1-1.714,0v-.536a3.873,3.873,0,0,1-2.451-1.741.859.859,0,0,1,1.473-.884A2.212,2.212,0,0,0,18,1013.791a2.05,2.05,0,0,0,1.286-.4,1.037,1.037,0,0,0,.429-.884c-.005-.766-1.249-1.04-2.036-1.353a11.183,11.183,0,0,1-1.888-.79,2.544,2.544,0,0,1-1.219-2.143,2.891,2.891,0,0,1,1.058-2.236,3.421,3.421,0,0,1,1.513-.683v-.509A.857.857,0,0,1,18,1003.933Z"
            transform="translate(-9 -1001.362)"
            fill={props.fill || THEME_COLOR}
          />
        </g>
      </g>
    </g>
  </svg>
);

export default SvgIncome;
