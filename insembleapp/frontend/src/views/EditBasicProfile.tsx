import React, { useState } from 'react';
import styled from 'styled-components';

import { Card, Text, Button, TextInput, View, TextArea as BaseTextArea } from '../core-ui';
import { THEME_COLOR } from '../constants/colors';
import { FONT_SIZE_LARGE, FONT_WEIGHT_BOLD } from '../constants/theme';

export default function BasicProfile() {
  let [profileEditable, setProfileEditable] = useState(false);
  let [passwordEditable, setPasswordEditable] = useState(false);
  let textInputContainerStyle = { marginTop: 12, marginBottom: 12 };
  return (
    <Container flex>
      <RowedView>
        <Title>Profile</Title>
        <Button
          text="Edit Your Profile"
          mode="transparent"
          onPress={() => setProfileEditable(true)}
        />
      </RowedView>
      <TextInput
        label="Email Address"
        placeholder="Email"
        disabled={!profileEditable}
        containerStyle={textInputContainerStyle}
      />
      <RowedView>
        <TextInput
          label="First Name"
          placeholder="First Name"
          disabled={!profileEditable}
          containerStyle={textInputContainerStyle}
        />
        <Spacing />
        <TextInput
          label="Last Name"
          placeholder="Last Name"
          disabled={!profileEditable}
          containerStyle={textInputContainerStyle}
        />
      </RowedView>
      <RowedView>
        <TextInput
          label="Company"
          placeholder="Company"
          disabled={!profileEditable}
          containerStyle={textInputContainerStyle}
        />
        <Spacing />
        <TextInput
          label="Title"
          placeholder="Job Title"
          disabled={!profileEditable}
          containerStyle={textInputContainerStyle}
        />
      </RowedView>
      <Title>Public Profile</Title>
      <TextInput
        label="Phone Number"
        placeholder="Phone Number"
        disabled={!profileEditable}
        containerStyle={{
          ...textInputContainerStyle,
          width: `calc(50% - ${(SPACING_WIDTH / 2).toString() + 'px'})`,
        }}
      />
      <TextArea
        values=""
        label="About"
        disabled={!profileEditable}
        containerStyle={textInputContainerStyle}
      />
      <RowedView>
        <Title>Password</Title>
        <Button
          text="Change your password"
          mode="transparent"
          onPress={() => setPasswordEditable(true)}
        />
      </RowedView>
      <TextInput
        label="Current Password"
        placeholder="Enter Your Current Password"
        disabled={!passwordEditable}
        type="password"
        containerStyle={textInputContainerStyle}
      />
      <TextInput
        label="New Password"
        placeholder="Enter Your New Password"
        disabled={!passwordEditable}
        type="password"
      />
      <TextInput
        label="Confirm New Password"
        placeholder="Re-Enter Your New Password"
        disabled={!passwordEditable}
        type="password"
        containerStyle={textInputContainerStyle}
      />
      <SaveButton text="Save Changes" />
    </Container>
  );
}

const SPACING_WIDTH = 24;
const Container = styled(Card)`
  padding: 12px 24px;
`;

const RowedView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TextArea = styled(BaseTextArea)`
  height: 74px;
`;

const Title = styled(Text)`
  color: ${THEME_COLOR};
  font-size: ${FONT_SIZE_LARGE};
  font-weight: ${FONT_WEIGHT_BOLD};
  margin: 12px 0;
`;

const Spacing = styled(View)`
  width: ${SPACING_WIDTH.toString() + 'px'};
`;

const SaveButton = styled(Button)`
  align-self: flex-end;
  margin: 12px 0;
`;
