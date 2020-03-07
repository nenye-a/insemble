import { CSSProperties } from 'react';
import { FileWithPreview } from '../core-ui/Dropzone';

export type IconProps = {
  fill?: string;
  style?: CSSProperties;
  x?: string | number;
  y?: string | number;
};

export enum Role {
  TENANT = 'Tenant',
  LANDLORD = 'Landlord',
}

export type PhotoFile = FileWithPreview | null | string;
