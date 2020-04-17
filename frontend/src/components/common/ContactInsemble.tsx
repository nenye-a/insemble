import React from 'react';

import { Text } from '../../core-ui';
import { FONT_WEIGHT_LIGHT, FONT_SIZE_SMALL } from '../../constants/theme';
import { SUPPORT_EMAIL } from '../../constants/app';

export default function ContactInsemble() {
  return (
    <Text fontWeight={FONT_WEIGHT_LIGHT} fontSize={FONT_SIZE_SMALL}>
      Questions? Email {SUPPORT_EMAIL}
    </Text>
  );
}
