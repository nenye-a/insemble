import React from 'react';
import Text from './Text';

import { THEME_COLOR, RED_TEXT } from '../constants/colors';
import { FONT_SIZE_SMALL } from '../constants/theme';

export type LabelProps = TextProps & {
  text: string;
  id?: string;
  isError?: boolean;
};

export default function Label({ text, id, isError, ...otherProps }: LabelProps) {
  return (
    <Text
      fontSize={FONT_SIZE_SMALL}
      color={isError ? RED_TEXT : THEME_COLOR}
      htmlFor={id}
      as={id ? 'label' : 'h5'}
      {...otherProps}
    >
      {text}
    </Text>
  );
}
