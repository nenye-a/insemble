import React from 'react';
import Text from './Text';

import { THEME_COLOR } from '../constants/colors';
import { FONT_SIZE_SMALL } from '../constants/theme';

type Props = TextProps & {
  text: string;
  id?: string;
};

export default function Label({ text, id, ...otherProps }: Props) {
  let asLabel = id ? { as: 'label' } : undefined;
  return (
    <Text fontSize={FONT_SIZE_SMALL} color={THEME_COLOR} htmlFor={id} {...asLabel} {...otherProps}>
      {text}
    </Text>
  );
}
