import React from 'react';
import { IconProps } from '../../types/types';
import { THEME_COLOR } from '../../constants/colors';

const SvgEducation = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <g id="Group_126" data-name="Group 126" transform="translate(-344 -224)">
      <rect
        id="Rectangle_182"
        data-name="Rectangle 182"
        width="24"
        height="24"
        transform="translate(344 224)"
        fill="#fff"
        opacity="0"
      />
      <g id="noun_education_2300707" transform="translate(346 229)">
        <path
          id="Path_46"
          data-name="Path 46"
          d="M33.1,54.631l-.276-.122-4.644-2.053v2.758c0,1.474,2.2,2.669,4.92,2.669s4.92-1.195,4.92-2.669V52.456l-4.644,2.053Z"
          transform="translate(-24.097 -45.883)"
          fill={props.fill || THEME_COLOR}
        />
        <path
          id="Path_47"
          data-name="Path 47"
          d="M19.079,24.3l-9,3.978,9,3.979L24,30.08l4.08-1.8Z"
          transform="translate(-10.079 -24.298)"
          fill="#674ca7"
        />
        <rect
          id="Rectangle_69"
          data-name="Rectangle 69"
          width="0.703"
          height="5.448"
          transform="translate(16.669 3.783)"
          fill={props.fill || THEME_COLOR}
        />
        <path
          id="Path_48"
          data-name="Path 48"
          d="M84.364,62.207c0,.2-.223.367-.5.367h0c-.275,0-.5-.164-.5-.367v-.892c0-.2.223-.367.5-.367h0c.275,0,.5.164.5.367Z"
          transform="translate(-66.846 -52.393)"
          fill={props.fill || THEME_COLOR}
        />
      </g>
    </g>
  </svg>
);

export default SvgEducation;
