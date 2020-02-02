import React, { useState } from 'react';
import styled from 'styled-components';
import { View, Text, Button, TouchableOpacity } from '../../core-ui';
import ContactModal from './ContactModal';
import { FONT_SIZE_LARGE } from '../../constants/theme';
import { THEME_COLOR } from '../../constants/colors';
import SvgHeart from '../../components/icons/heart';

type Props = {
  isLiked: boolean;
  onLikePress: (isLiked: boolean) => void;
};

export default function PropertyDeepDiveHeader({ isLiked, onLikePress }: Props) {
  let [contactModalVisible, toggleContactModalVisibility] = useState(false);

  return (
    <Container>
      <View flex>
        <Text fontSize={FONT_SIZE_LARGE}>4027 Sepulveda Boulevard, Los Angeles, CA</Text>
        <Text>Mclaughlin, Culver City</Text>
      </View>
      <TouchableOpacity onPress={() => onLikePress(!isLiked)} style={{ marginRight: 14 }}>
        <SvgHeart fill={isLiked ? THEME_COLOR : 'transparent'} />
      </TouchableOpacity>
      <Button text="Connect" onPress={() => toggleContactModalVisibility(true)} />
      <ContactModal
        visible={contactModalVisible}
        onClose={() => toggleContactModalVisibility(false)}
      />
    </Container>
  );
}

const Container = styled(View)`
  flex-direction: row;
  padding: 16px;
  align-items: center;
`;
