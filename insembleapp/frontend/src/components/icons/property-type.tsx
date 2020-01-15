import React from 'react';
import { IconProps } from '../../types/types';
import { THEME_COLOR } from '../../constants/colors';

const SvgPropertyType = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <g id="Group_132" data-name="Group 132" transform="translate(-344 -224)">
      <rect
        id="Rectangle_182"
        data-name="Rectangle 182"
        width="24"
        height="24"
        transform="translate(344 224)"
        fill="#fff"
        opacity="0"
      />
      <g id="Group_193" data-name="Group 193" transform="translate(353 227)">
        <path
          id="Path_60"
          data-name="Path 60"
          d="M320.96,86.07a2.818,2.818,0,1,1-3,2.812,2.912,2.912,0,0,1,3-2.812Zm0,12.376a2.818,2.818,0,1,1-3,2.812A2.912,2.912,0,0,1,320.96,98.446Zm0,2.3a.474.474,0,1,1,0-.947,1.514,1.514,0,0,1,1.558,1.46.507.507,0,0,1-1.01,0A.527.527,0,0,0,320.96,100.745Zm0-1.352a1.869,1.869,0,1,0,1.99,1.865A1.926,1.926,0,0,0,320.96,99.393Zm0-7.135a2.818,2.818,0,1,1-3,2.812A2.912,2.912,0,0,1,320.96,92.258Zm0,2.3a.474.474,0,1,1,0-.947,1.514,1.514,0,0,1,1.558,1.46.507.507,0,0,1-1.01,0A.526.526,0,0,0,320.96,94.557Zm0-1.352a1.869,1.869,0,1,0,1.99,1.865A1.926,1.926,0,0,0,320.96,93.205Zm0-4.836a.474.474,0,1,1,0-.947,1.514,1.514,0,0,1,1.558,1.46.507.507,0,0,1-1.01,0A.527.527,0,0,0,320.96,88.369Zm0-1.352a1.869,1.869,0,1,0,1.99,1.865A1.926,1.926,0,0,0,320.96,87.017Z"
          transform="translate(-317.96 -86.07)"
          fill={props.fill || THEME_COLOR}
          fill-rule="evenodd"
        />
      </g>
    </g>
  </svg>
);

export default SvgPropertyType;
