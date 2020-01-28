import React from 'react';
import { IconProps } from '../../types/types';
import { THEME_COLOR } from '../../constants/colors';

const SvgSqft = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <g id="Group_131" data-name="Group 131" transform="translate(-344 -224)">
      <rect
        id="Rectangle_182"
        data-name="Rectangle 182"
        width="24"
        height="24"
        transform="translate(344 224)"
        fill="#fff"
        opacity="0"
      />
      <g id="noun_size_1748445" transform="translate(348 227)">
        <g id="Group_48" data-name="Group 48" transform="translate(0 0)">
          <rect
            id="Rectangle_71"
            data-name="Rectangle 71"
            width="11.417"
            height="13.779"
            transform="translate(4.482 4.221)"
            fill={props.fill || THEME_COLOR}
          />
          <path
            id="Path_58"
            data-name="Path 58"
            d="M34.312,5.22l-.824-.776h8.643l-.824.776.543.511,1.769-1.666L41.849,2.4l-.543.511.824.776H33.487l.824-.776L33.769,2.4,32,4.066l1.769,1.666Zm8.2-1.136Z"
            transform="translate(-27.618 -2.4)"
            fill={props.fill || THEME_COLOR}
          />
          <path
            id="Path_59"
            data-name="Path 59"
            d="M13.195,26.777l.543-.511L11.969,24.6,10.2,26.266l.543.511L11.567,26V37.016l-.8-.795-.543.511L11.989,38.4l1.769-1.666-.563-.511-.824.795V26Zm-1.206,10.6Z"
            transform="translate(-10.2 -20.398)"
            fill={props.fill || THEME_COLOR}
          />
        </g>
      </g>
    </g>
  </svg>
);

export default SvgSqft;
