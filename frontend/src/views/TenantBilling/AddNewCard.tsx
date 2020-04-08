import React, { useState } from 'react';
import styled from 'styled-components';
import { Label as BaseLabel, RadioButton, Button, Modal, View } from '../../core-ui';
import AddNewCardForm from '../Billing/AddNewCardForm';

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
  let onFinishCreatingPaymentMethod = () => {
    !preventClosingOnSubmit && onClose();
  };
  return (
    <AddNewCardModalContainer visible={isModalVisible} onClose={onClose}>
      <Label text="Payment Method" />
      <PaymentsRowView>
        <RadioButton name="method" title="Credit Card" isSelected={true} onPress={() => {}} />
      </PaymentsRowView>
      <AddNewCardForm onFinishCreatingPaymentMethod={onFinishCreatingPaymentMethod} />
    </AddNewCardModalContainer>
  );
}

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

const Label = styled(BaseLabel)`
  padding-bottom: 8px;
`;
