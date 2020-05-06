import React, { useState } from 'react';
import styled from 'styled-components';
import { View, Text, Button } from '../../core-ui';
import { numberFormatter } from '../../utils';
import ContactModal from './ContactModal';
import { FONT_SIZE_LARGE, FONT_WEIGHT_MEDIUM } from '../../constants/theme';
import { PropertyMatches_propertyMatches_contacts as Contacts } from '../../generated/PropertyMatches';

type Props = {
  address: string;
  targetNeighborhood: string;
  brandId?: string;
  matchScore?: number;
  spaceId?: string;
  clickable?: boolean;
  showConnect?: boolean;
  contacts?: Contacts;
  sqft?: number;
  matchId?: string | null;
  brandName?: string;
  category?: string;
};

export default function PropertyDeepDiveHeader({
  address,
  targetNeighborhood,
  brandId,
  matchScore,
  spaceId,
  contacts,
  clickable = true,
  showConnect = true,
  sqft,
  matchId,
  brandName,
  category,
}: Props) {
  let [contactModalVisible, toggleContactModalVisibility] = useState(false);
  return (
    <Container>
      <View flex>
        <RowedView>
          <Text fontSize={FONT_SIZE_LARGE} fontWeight={FONT_WEIGHT_MEDIUM}>
            {address}
          </Text>
          {sqft && <Text fontSize={FONT_SIZE_LARGE}> &#183; {numberFormatter(sqft)} sqft</Text>}
        </RowedView>
        <Text>{targetNeighborhood}</Text>
      </View>
      {showConnect ? (
        <>
          <Button
            text="Connect"
            onPress={clickable ? () => toggleContactModalVisibility(true) : undefined}
          />
          {brandId && spaceId && contacts && (
            <ContactModal
              brandName={brandName}
              category={category}
              matchId={matchId}
              matchScore={matchScore}
              brandId={brandId}
              spaceId={spaceId}
              contacts={contacts}
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

const RowedView = styled(View)`
  flex-direction: row;
`;
