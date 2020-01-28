import React from 'react';
import { IconProps } from '../../types/types';
import { THEME_COLOR } from '../../constants/colors';

const SvgGender = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <g id="Group_121" data-name="Group 121" transform="translate(-344 -224)">
      <g id="noun_gender_77645" transform="translate(348 227)">
        <path
          id="Path_38"
          data-name="Path 38"
          d="M22.1,0H17.959V1.424H21.1L18.577,3.836a4.657,4.657,0,0,0-5.687.314,4.721,4.721,0,0,0-.8-.069A4.393,4.393,0,0,0,7.6,8.366a4.352,4.352,0,0,0,3.747,4.227v1.962H9.9v1.422h1.441V18h1.491V15.978h1.473V14.555H12.833V12.593a4.565,4.565,0,0,0,2.3-1.075,4.74,4.74,0,0,0,.8.069A4.393,4.393,0,0,0,20.426,7.3a4.131,4.131,0,0,0-.807-2.449L22.1,2.482V5.5H23.6V0ZM14.633,9.878a2.858,2.858,0,0,1-1.7-2.577,2.747,2.747,0,0,1,.457-1.511,2.858,2.858,0,0,1,1.7,2.577A2.746,2.746,0,0,1,14.633,9.878Zm-2.545,1.353a2.939,2.939,0,0,1-3-2.864A2.925,2.925,0,0,1,11.85,5.514,4.105,4.105,0,0,0,11.441,7.3a4.238,4.238,0,0,0,2.049,3.6A3.1,3.1,0,0,1,12.088,11.231Zm4.083-1.077a4.1,4.1,0,0,0,.409-1.787,4.239,4.239,0,0,0-2.049-3.6,3.1,3.1,0,0,1,1.4-.334,2.939,2.939,0,0,1,3,2.864A2.925,2.925,0,0,1,16.171,10.154Z"
          transform="translate(-7.595 0)"
          fill={props.fill || THEME_COLOR}
        />
      </g>
      <rect
        id="Rectangle_182"
        data-name="Rectangle 182"
        width="24"
        height="24"
        transform="translate(344 224)"
        fill="#fff"
        opacity="0"
      />
    </g>
  </svg>
);

export default SvgGender;
