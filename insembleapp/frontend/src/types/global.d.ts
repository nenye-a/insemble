declare global {
  import { ComponentProps } from 'react';
  import { View, Text } from '../core-ui';

  type ViewProps = ComponentProps<typeof View>;
  type TextProps = ComponentProps<typeof Text>;
  export { ViewProps, TextProps };
}
export {};
