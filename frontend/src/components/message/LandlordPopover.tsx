import React from 'react';
import styled from 'styled-components';

import { View, Text, PillButton } from '../../core-ui';
import { THEME_COLOR } from '../../constants/colors';
import { FONT_WEIGHT_MEDIUM } from '../../constants/theme';
import { Conversations_conversations_brand_nextLocations as NextLocations } from '../../generated/Conversations';

type Props = {
  matchScore: number;
  brandCategories: Array<string>;
  nextLocations: Array<NextLocations> | null;
  locationCount: number | null;
};

export default function LandlordPopover({
  matchScore,
  brandCategories,
  nextLocations,
  locationCount,
}: Props) {
  return (
    <PopoverContainer>
      <MatchTitle>{matchScore}% customer match</MatchTitle>
      {brandCategories.length > 0 && (
        <>
          <PopoverText>Categories:</PopoverText>
          <Row>
            {brandCategories.map((category, idx) => (
              <Pill disabled key={idx} primary>
                {category}
              </Pill>
            ))}
          </Row>
        </>
      )}

      {nextLocations && (
        <>
          <PopoverText>Expanding in:</PopoverText>
          <Row>
            {nextLocations.map((location, idx) => (
              <Pill disabled key={idx} primary>
                {location.address}
              </Pill>
            ))}
          </Row>
        </>
      )}

      {/* <PopoverText>Years in business:</PopoverText> */}
      {locationCount ? (
        <Row>
          <PopoverText># of existing locations: </PopoverText>
          <LocationCount>{locationCount}</LocationCount>
        </Row>
      ) : null}
    </PopoverContainer>
  );
}

const Row = styled(View)`
  flex-direction: row;
`;

const PopoverText = styled(Text)`
  margin: 8px 0;
`;

const PopoverContainer = styled(View)`
  padding: 20px;
`;

const Pill = styled(PillButton)`
  margin-right: 8px;
`;

const LocationCount = styled(PopoverText)`
  color: ${THEME_COLOR};
`;

const MatchTitle = styled(Text)`
  font-size: 16px;
  color: ${THEME_COLOR};
  font-weight: ${FONT_WEIGHT_MEDIUM};
`;
