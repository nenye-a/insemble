import React, { ComponentProps } from 'react';
import styled, { css } from 'styled-components';
import { PRIMARY, LIGHTEST_GREY, GREY, LIGHT_GREY } from '../../constants/colors';

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
  justify-content: space-between;

  &::after {
    content: '';
    -webkit-box-flex: 10;
    flex: 10 1 auto;
  }
`;

const PillButton = styled(Button)`
  flex: 1 1 auto;
  margin-right: 0.25rem;
  margin-bottom: 0.5rem;
  padding: 0.375rem 0.5rem;
  font-size: 75%;
  line-height: 1;

  text-align: center;
  text-transform: uppercase;

  border: 1px solid;
  border-radius: 0.375rem;
  border-color: ${LIGHT_GREY};

  background: ${LIGHTEST_GREY};
  color: ${GREY};

  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:hover {
    color: ${PRIMARY};
    border-color: ${PRIMARY};
    box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.075);
  }
`;

const SelectedPill = styled(PillButton)`
  background: ${PRIMARY};
  color: ${LIGHTEST_GREY};

  border-color: ${PRIMARY};

  &:hover {
    color: ${LIGHTEST_GREY};
    box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.125);
  }
`;

export default (props: Props) => {
  let { allCategories, selectedCategories, onSelect, onUnselect } = props;
  let availableCategories = allCategories.filter((el) => selectedCategories.includes(el));

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
