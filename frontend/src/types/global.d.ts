import { ComponentProps } from 'react';
import { View, Text } from '../core-ui';

declare global {
  type ViewProps = ComponentProps<typeof View>;
  type TextProps = ComponentProps<typeof Text>;
  type ImageProps = ComponentProps<'img'>;

  export { ViewProps, TextProps, ImageProps };
}
export {};
