import React, { useState } from 'react';
import styled from 'styled-components';
import { View, Text, TouchableOpacity, Button } from '../../core-ui';
import ContactModal from './ContactModal';
import { FONT_SIZE_LARGE } from '../../constants/theme';
import { THEME_COLOR } from '../../constants/colors';
import SvgHeart from '../../components/icons/heart';

type Props = {
  isLiked?: boolean;
  onLikePress?: (isLiked: boolean) => void;
  address: string;
  targetNeighborhood: string;
  brandId?: string;
  matchScore?: number;
  clickable?: boolean;
  showConnect?: boolean;
};

export default function PropertyDeepDiveHeader({
  isLiked,
  onLikePress,
  address,
  targetNeighborhood,
  brandId,
  matchScore,
  clickable = true,
  showConnect = true,
}: Props) {
  let [contactModalVisible, toggleContactModalVisibility] = useState(false);

  return (
    <Container>
      <View flex>
        <Text fontSize={FONT_SIZE_LARGE}>{address}</Text>
        <Text>{targetNeighborhood}</Text>
      </View>
      {showConnect ? (
        <>
          <TouchableOpacity
            onPress={() => onLikePress && onLikePress(!isLiked)}
            style={{ marginRight: 14 }}
          >
            <SvgHeart fill={isLiked ? THEME_COLOR : 'transparent'} />
          </TouchableOpacity>
          <Button
            text="Connect"
            onPress={clickable ? () => toggleContactModalVisibility(true) : undefined}
          />
          {brandId && (
            <ContactModal
              matchScore={matchScore}
              brandId={brandId}
              visible={contactModalVisible}
              onClose={() => toggleContactModalVisibility(false)}
            />
          )}
        </>
      ) : null}
    </Container>
  );
}

const Container = styled(View)`
  flex-direction: row;
  padding: 16px;
  align-items: center;
`;
