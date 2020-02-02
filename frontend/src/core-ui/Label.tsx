import React from 'react';
import Text from './Text';

import { THEME_COLOR } from '../constants/colors';
import { FONT_SIZE_SMALL } from '../constants/theme';

type Props = TextProps & {
  text: string;
  id?: string;
};

export default function Label({ text, id, ...otherProps }: Props) {
  return (
    <Text
      fontSize={FONT_SIZE_SMALL}
      color={THEME_COLOR}
      htmlFor={id}
      as={id ? 'label' : 'h5'}
      {...otherProps}
    >
      {text}
    </Text>
  );
}
