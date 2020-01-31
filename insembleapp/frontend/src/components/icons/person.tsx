import React from 'react';
import { IconProps } from '../../types/types';

const SvgPerson = (props: IconProps) => (
  <svg
    id="person-24px"
    data-name="person-24px"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    {...props}
  >
    <path id="Path_82" data-name="Path 82" d="M0,0H24V24H0Z" fill="none" />
    <path
      id="Path_83"
      data-name="Path 83"
      d="M12,12A4,4,0,1,0,8,8,4,4,0,0,0,12,12Zm0,2c-2.67,0-8,1.34-8,4v1a1,1,0,0,0,1,1H19a1,1,0,0,0,1-1V18C20,15.34,14.67,14,12,14Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgPerson;
