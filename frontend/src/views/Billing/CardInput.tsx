import React from 'react';
import styled from 'styled-components';
import { CardCvcElement, CardExpiryElement, CardNumberElement } from '@stripe/react-stripe-js';

import { View, Label } from '../../core-ui';
import { FONT_FAMILY_NORMAL, FONT_SIZE_NORMAL, DEFAULT_BORDER_RADIUS } from '../../constants/theme';
import {
  TEXT_COLOR,
  TEXT_INPUT_BORDER_COLOR,
  TEXT_INPUT_PLACEHOLDER_COLOR,
} from '../../constants/colors';

export function NumberInput() {
  return (
    <View flex style={{ ...inputStyle, marginRight: 8 }}>
      <InputLabel text="Card Number" />
      <StripeElementContainer>
        <CardNumberElement options={CARD_OPTIONS} />
      </StripeElementContainer>
    </View>
  );
}

export function ExpiryInput() {
  return (
    <View style={{ ...inputStyle, marginRight: 8 }}>
      <InputLabel text="Expiration Date" />
      <StripeElementContainer>
        <CardExpiryElement options={CARD_OPTIONS} />
      </StripeElementContainer>
    </View>
  );
}

export function CvcInput() {
  return (
    <View style={inputStyle}>
      <InputLabel text="CVC/CVV" />
      <StripeElementContainer>
        <CardCvcElement options={CARD_OPTIONS} />
      </StripeElementContainer>
    </View>
  );
}

let inputStyle = { paddingTop: 4, paddingBottom: 4 };
const CARD_OPTIONS = {
  style: {
    base: {
      'font-family': FONT_FAMILY_NORMAL,
      'font-size': FONT_SIZE_NORMAL,
      color: TEXT_COLOR,
      '::placeholder': {
        color: TEXT_INPUT_PLACEHOLDER_COLOR,
      },
    },
  },
};

const InputLabel = styled(Label)`
  margin-bottom: 8px;
  line-height: 18px;
`;

const StripeElementContainer = styled(View)`
  padding: 8px 12px;
  height: 36px;
  border: solid 1px ${TEXT_INPUT_BORDER_COLOR};
  border-radius: ${DEFAULT_BORDER_RADIUS};
  display: block;
  width: 100%;
  box-sizing: border-box;
`;
