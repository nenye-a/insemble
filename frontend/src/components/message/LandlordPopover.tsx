import React from 'react';
import styled from 'styled-components';

import { View, Text, PillButton } from '../../core-ui';
import { THEME_COLOR } from '../../constants/colors';
import { FONT_SIZE_MEDIUM } from '../../constants/theme';

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
  flex-flow: row wrap;
  padding: 0 4px;
`;

const PopoverText = styled(Text)`
  padding: 8px;
`;

const PopoverContainer = styled(View)`
  padding: 12px 8px;
  min-width: 300px;
  max-width: 500px;
`;

const Pill = styled(PillButton)`
  margin: 4px;
`;

const MatchTitle = styled(Text)`
  padding: 0px 8px;
  font-size: ${FONT_SIZE_MEDIUM};
  color: ${THEME_COLOR};
`;
