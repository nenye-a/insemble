import React from 'react';
import styled from 'styled-components';
import { View, Text, Button, TouchableOpacity } from '../../core-ui';
import { FONT_SIZE_LARGE } from '../../constants/theme';
import { THEME_COLOR } from '../../constants/colors';
import SvgHeart from '../../components/icons/heart';

type Props = {
  isLiked: boolean;
  onLikePress: (isLiked: boolean) => void;
};

export default function PropertyDeepDiveHeader({ isLiked, onLikePress }: Props) {
  return (
    <Container>
      <View flex>
        <Text fontSize={FONT_SIZE_LARGE}>4027 Sepulveda Boulevard, Los Angeles, CA</Text>
        <Text>Mclaughlin, Culver City</Text>
      </View>
      <TouchableOpacity onPress={() => onLikePress(!isLiked)} style={{ marginRight: 14 }}>
        <SvgHeart fill={isLiked ? THEME_COLOR : 'transparent'} />
      </TouchableOpacity>
      <Button text="Connect" />
    </Container>
  );
}

const Container = styled(View)`
  flex-direction: row;
  padding: 16px;
  align-items: center;
`;
