import { CSSProperties } from 'react';

export type IconProps = {
  fill?: string;
  style?: CSSProperties;
  x?: string | number;
  y?: string | number;
};

export enum Role {
  TENANT = 'TENANT',
  LANDLORD = 'LANDLORD',
}
