import React from 'react';
import { IconProps } from '../../types/types';
import { THEME_COLOR } from '../../constants/colors';

const SvgPropertyLocation = ({ fill, ...otherProps }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    {...otherProps}
  >
    <g id="Group_156" data-name="Group 156" transform="translate(-5818 -1211)">
      <path
        id="address"
        d="M7.988,17.914V19.94l-.49-.4a32.837,32.837,0,0,1-3.7-3.62C1.277,13.033,0,10.437,0,8.209V7.988a7.988,7.988,0,0,1,15.977,0v.221c0,.187-.01.377-.028.569L14.386,7.353a6.43,6.43,0,0,0-12.828.635v.221C1.559,11.973,6.409,16.53,7.988,17.914Zm4.793-1.12h2.338V14.457H12.781ZM7.988,4.676A3.312,3.312,0,1,1,4.676,7.988,3.316,3.316,0,0,1,7.988,4.676Zm0,1.559A1.754,1.754,0,1,0,9.742,7.988,1.755,1.755,0,0,0,7.988,6.235Zm10.961,9.5-.438-.4v2.5A2.116,2.116,0,0,1,16.4,19.951H11.463A2.116,2.116,0,0,1,9.35,17.838v-2.5l-.438.4-1.05-1.151,6.069-5.537L20,14.584Zm-2-1.822-3.022-2.757-3.022,2.757v3.924a.555.555,0,0,0,.555.555H16.4a.555.555,0,0,0,.555-.555Zm0,0"
        transform="translate(5820 1213)"
        fill={fill || THEME_COLOR}
      />
      <rect
        id="Rectangle_182"
        data-name="Rectangle 182"
        width="24"
        height="24"
        transform="translate(5818 1211)"
        fill={fill || THEME_COLOR}
        opacity="0"
      />
    </g>
  </svg>
);

export default SvgPropertyLocation;
