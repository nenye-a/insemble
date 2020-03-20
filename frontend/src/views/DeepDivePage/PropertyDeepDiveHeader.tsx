import React, { useState } from 'react';
import styled from 'styled-components';
import { View, Text, Button } from '../../core-ui';
import ContactModal from './ContactModal';
import { FONT_SIZE_LARGE } from '../../constants/theme';

type Props = {
  address: string;
  targetNeighborhood: string;
  brandId?: string;
  matchScore?: number;
  spaceId?: string;
  clickable?: boolean;
  showConnect?: boolean;
};

export default function PropertyDeepDiveHeader({
  address,
  targetNeighborhood,
  brandId,
  matchScore,
  spaceId,
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
          <Button
            text="Connect"
            onPress={clickable ? () => toggleContactModalVisibility(true) : undefined}
          />
          {brandId && spaceId && (
            <ContactModal
              matchScore={matchScore}
              brandId={brandId}
              spaceId={spaceId}
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
