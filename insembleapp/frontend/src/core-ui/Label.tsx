import React from 'react';
import Text from './Text';

import { THEME_COLOR } from '../constants/colors';
import { FONT_SIZE_SMALL } from '../constants/theme';

type Props = {
  text: string;
  id?: string;
};

export default function Label({ text, id }: Props) {
  return (
    <Text as="label" fontSize={FONT_SIZE_SMALL} color={THEME_COLOR} htmlFor={id}>
      {text}
    </Text>
  );
}
