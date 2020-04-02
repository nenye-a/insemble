import React, { useReducer, useState } from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/react-hooks';
import { CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';

import { Label, RadioButton, TextInput, Button, Modal, View } from '../../core-ui';
import {
  RegisterPaymentMethod,
  RegisterPaymentMethodVariables,
} from '../../generated/RegisterPaymentMethod';
import {
  REGISTER_PAYMENT_METHOD,
  GET_PAYMENT_METHOD_LIST,
} from '../../graphql/queries/server/billing';

import { NumberInput, ExpiryInput, CvcInput } from './CardInput';

let initialNewCardState = {
  name: '',
  address: '',
  address2: '',
  city: '',
  state: '',
  zipcode: '',
  phone: '',
};

type NewCardState = typeof initialNewCardState;
type NewCardAction =
  | {
      type: 'EDIT';
      key: keyof NewCardState;
      value: string;
    }
  | {
      type: 'RESET';
    };

function reducer(state: NewCardState, action: NewCardAction) {
  switch (action.type) {
    case 'EDIT':
      return { ...state, [action.key]: action.value };
    case 'RESET':
      return { ...initialNewCardState };
    default:
      return state;
  }
}

export default function AddNewCard() {
  let [isModalVisible, setModalVisibility] = useState(false);

  return (
    <>
      <AddNewCardModal isModalVisible={isModalVisible} onClose={() => setModalVisibility(false)} />
      <Button
        text="Add new card"
        mode="transparent"
        onPress={() => setModalVisibility(!isModalVisible)}
      />
    </>
  );
}

export function AddNewCardModal({
  isModalVisible,
  onClose,
  preventClosingOnSubmit,
}: {
  isModalVisible: boolean;
  onClose: () => void;
  preventClosingOnSubmit?: boolean;
}) {
  let [state, dispatch] = useReducer(reducer, initialNewCardState);
  let [isSaving, setSaving] = useState(false);
  let stripe = useStripe();
  let elements = useElements();

  let [registerPaymentMethod, { loading }] = useMutation<
    RegisterPaymentMethod,
    RegisterPaymentMethodVariables
  >(REGISTER_PAYMENT_METHOD, {
    refetchQueries: [
      {
        query: GET_PAYMENT_METHOD_LIST,
      },
    ],
    awaitRefetchQueries: true,
  });

  let disableSave = !stripe || !elements || isSaving || loading;

  let onSavePress = async () => {
    if (!stripe || !elements) {
      return;
    }
    let cardNumberEl = elements.getElement(CardNumberElement);
    if (cardNumberEl) {
      setSaving(true);
      let result = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberEl,
        billing_details: toBillingDetails(state),
      });
      setSaving(false);
      if (result.error || !result.paymentMethod) {
        // eslint-disable-next-line no-console
        console.log('Failed creating payment method', result.error);
        return;
      }

      await registerPaymentMethod({
        variables: {
          paymentMethodId: result.paymentMethod.id,
        },
      });

      !preventClosingOnSubmit && onClose();
      dispatch({ type: 'RESET' });
    }
  };
  return (
    <AddNewCardModalContainer visible={isModalVisible} onClose={onClose}>
      <Label text="Payment Method" />
      <PaymentsRowView>
        <RadioButton name="method" title="Credit Card" isSelected={true} onPress={() => {}} />
      </PaymentsRowView>
      <RowView>
        <TextInput
          label="Name on Card"
          placeholder="Name on card"
          value={state.name}
          onChange={(e) => dispatch({ type: 'EDIT', key: 'name', value: e.target.value })}
          containerStyle={{ ...inputRow, marginRight: 24 }}
        />
        <TextInput
          label="Billing Address"
          value={state.address}
          onChange={(e) => dispatch({ type: 'EDIT', key: 'address', value: e.target.value })}
          placeholder="Your address"
          containerStyle={inputRow}
        />
      </RowView>
      <RowView>
        <NumberInput />
        <TextInput
          label="Billing Address Line 2 (Optional)"
          value={state.address2}
          onChange={(e) => dispatch({ type: 'EDIT', key: 'address2', value: e.target.value })}
          placeholder="Ex: Building or Unit number"
          containerStyle={inputRow}
        />
      </RowView>
      <RowView>
        <InputRowView flex style={{ marginRight: 24 }}>
          <ExpiryInput />
          <CvcInput />
        </InputRowView>
        <InputRowView flex>
          <TextInput
            label="City"
            value={state.city}
            onChange={(e) => dispatch({ type: 'EDIT', key: 'city', value: e.target.value })}
            placeholder="City"
            containerStyle={inputRow}
          />
          <TextInput
            label="State"
            value={state.state}
            onChange={(e) => dispatch({ type: 'EDIT', key: 'state', value: e.target.value })}
            placeholder="CA"
            containerStyle={{ ...inputRow, maxWidth: '60px', margin: '0 12px' }}
          />
          <TextInput
            label="Zip Code"
            value={state.zipcode}
            onChange={(e) => dispatch({ type: 'EDIT', key: 'zipcode', value: e.target.value })}
            placeholder="12345"
            containerStyle={{ ...inputRow, maxWidth: '80px' }}
          />
        </InputRowView>
      </RowView>
      <RowView>
        <TextInput
          label="Phone Number"
          value={state.phone}
          onChange={(e) => dispatch({ type: 'EDIT', key: 'phone', value: e.target.value })}
          placeholder="Your phone number"
          containerStyle={{ ...inputRow, marginRight: 24 }}
        />
        <InputRowView flex style={{ justifyContent: 'flex-end' }}>
          <Button
            text="Save"
            onPress={onSavePress}
            loading={disableSave}
            style={{ marginTop: 24 }}
          />
        </InputRowView>
      </RowView>
    </AddNewCardModalContainer>
  );
}

function toBillingDetails(state: NewCardState) {
  return {
    ...(state.name ? { name: state.name } : undefined),
    ...(state.phone ? { phone: state.phone } : undefined),
    address: {
      ...(state.city ? { city: state.city } : undefined),
      ...(state.address ? { line1: state.address } : undefined),
      ...(state.address2 ? { line2: state.address2 } : undefined),
      ...(state.zipcode ? { postal_code: state.zipcode } : undefined),
      ...(state.state ? { state: state.state } : undefined),
    },
  };
}

let inputRow = {
  maxHeight: 90,
  height: 90,
};

const AddNewCardModalContainer = styled(Modal)`
  width: 640px;
  height: 480px;
  padding: 24px;
`;

const RowView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;

const PaymentsRowView = styled(RowView)`
  margin-bottom: 12px;
`;

const InputRowView = styled(RowView)`
  max-height: 90px;
  height: 90px;
`;
