import React, { ComponentProps } from 'react';
import styled from 'styled-components';
import {TEXT_COLOR, THEME_COLOR, WHITE} from '../../constants/colors';

type Props = {
  allCategories: Array<string>;
  selectedCategories: Array<string>;
  onUnselect: (tag: string) => void;
  onSelect: (tag: string) => void;
};

function Button(props: ComponentProps<'button'>) {
  return <button {...props} type="button" />;
}

const TagContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: left;
`;

const PillButton = styled(Button)`
  flex: 0 1 auto;
  margin: 0.35rem 0.25rem;
  padding: 0.5rem 0.5rem;
  line-height: 1;

  text-align: center;

  /* So the size doesn't slightly change when purple border shows up when highlighted */
  border: 1px solid;
  border-color: ${WHITE};

  border-radius: 0.375rem;
  box-shadow: 0 0 0.35rem rgba(0, 0, 0, 0.15);

  background: ${WHITE};
  color: ${TEXT_COLOR};

  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:hover {
    color: ${THEME_COLOR};
    border-color: ${THEME_COLOR};
  }
`;

const SelectedPill = styled(PillButton)`
  background: ${THEME_COLOR};
  color: ${WHITE};

  border-color: ${THEME_COLOR};

  &:hover {
    color: ${WHITE};
  }
`;

export default (props: Props) => {
  let { allCategories, selectedCategories, onSelect, onUnselect } = props;
  let availableCategories = allCategories.filter((el) => !selectedCategories.includes(el));

  return (
    <>
      <TagContainer>
        {selectedCategories.map((tag, idx) => {
          return (
            <SelectedPill key={idx} onClick={() => onUnselect(tag)}>
              {tag}
            </SelectedPill>
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
