import { CSSProperties } from 'react';
import { FileWithPreview } from '../core-ui/Dropzone';

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

export type PhotoFile = FileWithPreview | null | string;

export type Credentials = {
  role: string;
  landlordToken: string;
  tenantToken: string;
};
