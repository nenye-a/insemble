import React, { useState } from 'react';
import styled from 'styled-components';
import { View, Text } from '../../core-ui';
import ContactModal from './ContactModal';
import { FONT_SIZE_LARGE } from '../../constants/theme';

type Props = {
  isLiked: boolean;
  onLikePress: (isLiked: boolean) => void;
  address: string;
  targetNeighborhood: string;
};

export default function PropertyDeepDiveHeader({
  // isLiked,
  // onLikePress,
  address,
  targetNeighborhood,
}: Props) {
  let [contactModalVisible, toggleContactModalVisibility] = useState(false);

  return (
    <Container>
      <View flex>
        <Text fontSize={FONT_SIZE_LARGE}>{address}</Text>
        <Text>{targetNeighborhood}</Text>
      </View>
      {/* <TouchableOpacity onPress={() => onLikePress(!isLiked)} style={{ marginRight: 14 }}>
        <SvgHeart fill={isLiked ? THEME_COLOR : 'transparent'} />
      </TouchableOpacity> */}
      {/* enable this when landlord is done */}
      {/* <Button text="Connect" onPress={() => toggleContactModalVisibility(true)} /> */}
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
