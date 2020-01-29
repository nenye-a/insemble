import React from 'react';
import styled from 'styled-components';

import {
  Card,
  Text,
  Button,
  TextInput as BaseTextInput,
  View,
  TextArea as BaseTextArea,
} from '../../core-ui';
import { THEME_COLOR } from '../../constants/colors';
import { FONT_SIZE_LARGE, FONT_WEIGHT_BOLD } from '../../constants/theme';

export default function BasicProfile() {
  let textInputContainerStyle = { marginTop: 12, marginBottom: 12 };
  return (
    <Container flex>
      <RowedView>
        <Title>Profile</Title>
        <Button text="Edit Your Profile" mode="transparent" />
      </RowedView>
      <TextInput containerStyle={textInputContainerStyle} label="Email Address" />
      <RowedView>
        <TextInput containerStyle={textInputContainerStyle} label="First Name" />
        <Spacing />
        <TextInput containerStyle={textInputContainerStyle} label="Last Name" />
      </RowedView>
      <RowedView>
        <TextInput containerStyle={textInputContainerStyle} label="Company" />
        <Spacing />
        <TextInput containerStyle={textInputContainerStyle} label="Title" />
      </RowedView>
      <Title>Public Profile</Title>
      <TextInput containerStyle={textInputContainerStyle} label="Phone Number" />
      <TextArea values="" label="About" />
      <RowedView>
        <Title>Password</Title>
        <Button text="Change your password" mode="transparent" />
      </RowedView>
      <TextInput
        containerStyle={textInputContainerStyle}
        label="Current Password"
        placeholder="Enter Your Current Password"
      />
      <TextInput
        containerStyle={textInputContainerStyle}
        label="New Password"
        placeholder="Enter Your New Password"
      />
      <TextInput
        containerStyle={{ marginTop: 12, marginBottom: 12 }}
        label="Confirm New Password"
        placeholder="Re-Enter Your New Password"
      />
      <SaveButton text="Save Changes" />
    </Container>
  );
}

const Container = styled(Card)`
  padding: 12px 24px;
`;

const RowedView = styled(View)`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const TextInput = styled(BaseTextInput)`
  // margin: 12px 0;
`;

const TextArea = styled(BaseTextArea)`
  margin: 12px 0;
`;
const Title = styled(Text)`
  color: ${THEME_COLOR};
  font-size: ${FONT_SIZE_LARGE};
  font-weight: ${FONT_WEIGHT_BOLD};
  margin: 12px 0;
`;

const Spacing = styled(View)`
  width: 24px;
`;
const SaveButton = styled(Button)`
  align-self: flex-end;
  margin: 12px 0;
`;
