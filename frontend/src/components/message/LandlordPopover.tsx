import React from 'react';
import styled from 'styled-components';

import { View, Text, PillButton } from '../../core-ui';
import { THEME_COLOR } from '../../constants/colors';
import { FONT_WEIGHT_MEDIUM, FONT_SIZE_MEDIUM } from '../../constants/theme';

type Props = {
  matchScore: number;
  brandCategories: Array<string>;
};

export default function LandlordPopover({ matchScore, brandCategories }: Props) {
  return (
    <PopoverContainer>
      <MatchTitle>{matchScore}% match</MatchTitle>
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
    </PopoverContainer>
  );
}

const Row = styled(View)`
  flex-wrap: row wrap;
`;

const PopoverText = styled(Text)`
  margin: 8px 0;
`;

const PopoverContainer = styled(View)`
  padding: 20px;
  max-width: 300px;
`;

const Pill = styled(PillButton)`
  margin-right: 8px;
`;

const MatchTitle = styled(Text)`
  font-size: ${FONT_SIZE_MEDIUM};
  color: ${THEME_COLOR};
  font-weight: ${FONT_WEIGHT_MEDIUM};
`;
