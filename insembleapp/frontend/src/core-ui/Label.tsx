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
    <Text as="label" fontSize={FONT_SIZE_SMALL} color={THEME_COLOR} htmlFor={id} {...otherProps}>
      {text}
    </Text>
  );
}
