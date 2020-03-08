import React from 'react';
import styled from 'styled-components';

import { View, Text, TouchableOpacity } from '../../core-ui';

import { BLACK, WHITE } from '../../constants/colors';

export default function Footer() {
  return (
    <Container>
      {/* TODO: redirect on press */}
      <TouchableOpacity href="">
        <WhiteText>Contact us!</WhiteText>
      </TouchableOpacity>
      <View>
        <WhiteText>@2020 Insemble</WhiteText>
        <WhiteText> Insemble Inc. All Rights Reserved.</WhiteText>
      </View>
    </Container>
  );
}

const Container = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${BLACK};
  padding: 20px 5vw;
  height: 160px;
`;

const WhiteText = styled(Text)`
  color: ${WHITE};
`;
