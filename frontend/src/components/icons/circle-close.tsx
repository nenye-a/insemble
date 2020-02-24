import React from 'react';
import { IconProps } from '../../types/types';

const SvgCircleClose = ({ ...otherProps }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    {...otherProps}
  >
    <g id="Group_398" data-name="Group 398" transform="translate(-486 -755)">
      <g
        id="Ellipse_49"
        data-name="Ellipse 49"
        transform="translate(486 755)"
        fill="#fff"
        stroke="#b2b2b2"
        strokeWidth="0.5"
      >
        <circle cx="12" cy="12" r="12" stroke="none" />
        <circle cx="12" cy="12" r="11.75" fill="none" />
      </g>
      <g id="close-24px_9_" data-name="close-24px (9)" transform="translate(489 758)">
        <path id="Path_3914" data-name="Path 3914" d="M0,0H18V18H0Z" fill="none" />
        <path
          id="Path_3915"
          data-name="Path 3915"
          d="M15.077,5.634a.747.747,0,0,0-1.057,0l-3.667,3.66L6.684,5.627A.748.748,0,0,0,5.627,6.684l3.668,3.668L5.627,14.019a.748.748,0,1,0,1.057,1.057l3.668-3.667,3.667,3.667a.748.748,0,1,0,1.057-1.057l-3.667-3.667,3.667-3.668A.752.752,0,0,0,15.077,5.634Z"
          transform="translate(-1.352 -1.352)"
          fill="#6749aa"
        />
      </g>
    </g>
  </svg>
);

export default SvgCircleClose;
