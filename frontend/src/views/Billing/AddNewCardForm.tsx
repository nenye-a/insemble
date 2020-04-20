import React, { Dispatch } from 'react';
import styled from 'styled-components';

import { View, TextInput } from '../../core-ui';
import { NumberInput, ExpiryInput, CvcInput } from './CardInput';
import { NewCardState, NewCardAction } from '../../reducers/addNewCardReducer';

type Props = {
  onFinishCreatingPaymentMethod?: () => void;
  state: NewCardState;
  dispatch: Dispatch<NewCardAction>;
};

export default function AddNewCardForm(props: Props) {
  let { state, dispatch } = props;

  return (
    <View>
      <RowView>
        <NumberInput />
        <ExpiryInput />
        <CvcInput />
      </RowView>
      <RowView>
        <TextInput
          label="Name on Card"
          placeholder="Name on card"
          value={state.name}
          onChange={(e) => dispatch({ type: 'EDIT', key: 'name', value: e.target.value })}
          containerStyle={inputRow}
        />
      </RowView>
      <RowView>
        <TextInput
          label="Billing Address"
          value={state.address}
          onChange={(e) => dispatch({ type: 'EDIT', key: 'address', value: e.target.value })}
          placeholder="Your address"
          containerStyle={inputRow}
        />
        <TextInput
          label="Apt., suite, etc."
          value={state.address2}
          onChange={(e) => dispatch({ type: 'EDIT', key: 'address2', value: e.target.value })}
          placeholder="Ex: Building or Unit number"
          containerStyle={{ ...inputRow, marginLeft: 8, maxWidth: '30%' }}
        />
      </RowView>
      <RowView>
        <TextInput
          label="City"
          value={state.city}
          onChange={(e) => dispatch({ type: 'EDIT', key: 'city', value: e.target.value })}
          placeholder="City"
          containerStyle={{ ...inputRow, maxWidth: '150px' }}
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
      </RowView>
    </View>
  );
}

let inputRow = {
  paddingTop: 4,
  paddingBottom: 4,
  flex: 1,
};

const RowView = styled(View)`
  flex-direction: row;
`;
