import React from 'react';
import { View, TextInput, Text, Button } from '../../core-ui';
import styled from 'styled-components';
import { WHITE, SECONDARY_COLOR } from '../../constants/colors';
import { FONT_SIZE_XLARGE, FONT_SIZE_SMALL, FONT_WEIGHT_BOLD } from '../../constants/theme';
import InsembleLogo from '../../components/common/InsembleLogo';

export default function OnBoardingSignUp() {
  return (
    <Container>
      <Form>
        <Input label={'Email Address'} placeholder={'Your Email Address'} />
        <RowView>
          <FlexView style={{ marginRight: 10 }}>
            <Input label={'First Name'} placeholder={'Your First Name'} />
          </FlexView>
          <FlexView style={{ marginLeft: 10 }}>
            <Input label={'Last Name'} placeholder={'Your Last Name'} />
          </FlexView>
        </RowView>
        <Input label={'Company'} placeholder={'Your Company'} />
        <Input label={'Password'} placeholder={'Enter Password'} />
        <Input label={'Confrim Password'} placeholder={'Re-enter Password'} />
        <SubmitButton text="Create and Submit" onSubmit={() => {}} />
        <RowView>
          <Text>Already have an account? </Text>
          <Button mode="transparent" text="Log in here" />
        </RowView>
      </Form>
      <Description>
        <InsembleLogo color="white" />
        <DescriptionLargeText>Find the next best location for your business</DescriptionLargeText>
        <DescriptionSmallText>
          Insemble is the world’s first smart listing service. We find & connect you to the best
          locations for your business. And we cut through the clutter, presenting the pre- qualified
          properties that matter the most.
        </DescriptionSmallText>
      </Description>
    </Container>
  );
}

const Container = styled(View)`
  flex: 1;
  flex-direction: row;
`;

const RowView = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const Form = styled(View)`
  flex: 2;
  background-color: ${WHITE};
  padding: 10px 50px 0 50px;
`;

const Description = styled(View)`
  flex: 2;
  background-color: ${SECONDARY_COLOR};
  padding: 40px 40px 0 40px;
`;
const Input = styled(TextInput)`
  margin: 0 0 10px 0;
`;

const SubmitButton = styled(Button)`
  margin: 15px 0 30px 0;
`;

const FlexView = styled(View)`
  flex: 1;
`;

const DescriptionLargeText = styled(Text)`
  color: ${WHITE};
  font-size: ${FONT_SIZE_XLARGE};
  font-weight: ${FONT_WEIGHT_BOLD};
  margin: 30px 0 0 0;
`;
const DescriptionSmallText = styled(Text)`
  color: ${WHITE};
  font-size: ${FONT_SIZE_SMALL};
  margin: 30px 0 0 0;
`;
