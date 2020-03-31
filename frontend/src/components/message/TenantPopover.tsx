import React from 'react';
import styled from 'styled-components';

import { View, Text } from '../../core-ui';
import { THEME_COLOR, BACKGROUND_COLOR, DARK_TEXT_COLOR } from '../../constants/colors';
import { FONT_WEIGHT_MEDIUM, FONT_SIZE_SMALL } from '../../constants/theme';
import { Conversations_conversations_property_space as Space } from '../../generated/Conversations';

type Props = {
  mainPhoto: string;
  address: string;
  propertySpace: Array<Space>;
  matchScore: number;
};

export default function TenantPopover({ mainPhoto, address, propertySpace, matchScore }: Props) {
  return (
    <>
      <Popoverimage src={mainPhoto} />
      <AddressContainer>
        <Text>{address}</Text>
        <SpaceText>{propertySpace.length} Space</SpaceText>
      </AddressContainer>
      <MatchContainer>
        <MatchTitle>{matchScore}% Match</MatchTitle>
      </MatchContainer>
    </>
  );
}

const Popoverimage = styled.img`
  object-fit: cover;
  height: 90px;
`;

const AddressContainer = styled(View)`
  padding: 16px;
  background-color: ${BACKGROUND_COLOR};
`;

const MatchContainer = styled(View)`
  padding: 16px;
`;

const SpaceText = styled(Text)`
  font-size: ${FONT_SIZE_SMALL};
  color: ${DARK_TEXT_COLOR};
`;

const MatchTitle = styled(Text)`
  font-size: 18px;
  color: ${THEME_COLOR};
  font-weight: ${FONT_WEIGHT_MEDIUM};
`;
