import React from 'react';
import styled from 'styled-components';

import { PillButton } from '../../core-ui';

type Props = {
  allCategories: Array<string>;
  selectedCategories: Array<string>;
  onUnselect: (tag: string) => void;
  onSelect: (tag: string) => void;
};

const TagContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: left;
`;

export default (props: Props) => {
  let { allCategories, selectedCategories, onSelect, onUnselect } = props;
  let availableCategories = allCategories.filter((el) => !selectedCategories.includes(el));

  return (
    <>
      <TagContainer>
        {selectedCategories.map((tag, idx) => {
          return (
            <PillButton primary key={idx} onClick={() => onUnselect(tag)}>
              {tag}
            </PillButton>
          );
        })}
      </TagContainer>
      <TagContainer>
        {availableCategories.map((tag, idx) => {
          return (
            <PillButton key={idx} onClick={() => onSelect(tag)}>
              {tag}
            </PillButton>
          );
        })}
      </TagContainer>
    </>
  );
};
