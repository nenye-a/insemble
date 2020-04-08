import React from 'react';
import Text from './Text';

import { THEME_COLOR } from '../constants/colors';
import { FONT_SIZE_SMALL } from '../constants/theme';

export type LabelProps = TextProps & {
  text: string;
  id?: string;
  color?: string;
};

export default function Label({ text, id, color, ...otherProps }: LabelProps) {
  return (
    <Text
      fontSize={FONT_SIZE_SMALL}
      color={color ? color : THEME_COLOR}
      htmlFor={id}
      as={id ? 'label' : 'h5'}
      {...otherProps}
    >
      {text}
    </Text>
  );
}
