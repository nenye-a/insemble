import { ButtonProps } from './../core-ui/Button';
import { CardProps } from '../core-ui/Card';

export enum VIEWPORT_TYPE {
  MOBILE,
  TABLET,
  DESKTOP,
}

export type ViewPropsWithViewport = ViewProps & {
  isDesktop: boolean;
};

export type CardPropsWithViewport = CardProps & {
  isDesktop: boolean;
};

export type ButtonPropsWithViewport = ButtonProps & {
  isDesktop: boolean;
};
