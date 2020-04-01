import React from 'react';
import { IconProps } from '../../types/types';
import { THEME_COLOR } from '../../constants/colors';

const SvgEdit = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 383.947 383.947">
    <g>
      <g>
        <g>
          <polygon
            points="0,303.947 0,383.947 80,383.947 316.053,147.893 236.053,67.893"
            fill={props.fill || THEME_COLOR}
          />
          <path
            d="M377.707,56.053L327.893,6.24c-8.32-8.32-21.867-8.32-30.187,0l-39.04,39.04l80,80l39.04-39.04
        C386.027,77.92,386.027,64.373,377.707,56.053z"
            fill={props.fill || THEME_COLOR}
          />
        </g>
      </g>
    </g>
  </svg>
);

export default SvgEdit;
