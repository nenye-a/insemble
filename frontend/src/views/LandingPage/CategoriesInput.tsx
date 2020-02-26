import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import { ContainedTextInput, ClickAway } from '../../core-ui';
import { Filter } from '../../components';
import { GET_CATEGORIES } from '../../graphql/queries/server/filters';
import { Categories } from '../../generated/Categories';

function CategoriesInput() {
  let history = useHistory();
  let { loading, data } = useQuery<Categories>(GET_CATEGORIES);
  let [categoryListOpen, toggleCategoryList] = useState(false);
  let [selectedCategories, setSelectedCategories] = useState<Array<string>>([]);

  return (
    <>
      <ContainedTextInput
        placeholder={loading ? 'Loading' : 'Enter store categories'}
        buttonText="Find Locations"
        value={selectedCategories.join(', ')}
        onFocus={() => toggleCategoryList(true)}
        onSubmit={() => {
          history.push('/verify', {
            categories: selectedCategories,
          });
        }}
      />
      {categoryListOpen && data && (
        <ClickAway onClickAway={() => toggleCategoryList(false)}>
          <FilterContainer
            visible
            search
            selectedOptions={selectedCategories}
            allOptions={data.categories}
            onUnSelect={(tag: string) => {
              let newTagList = selectedCategories.filter((item) => item !== tag);
              setSelectedCategories(newTagList);
            }}
            onSelect={(tag: string) => {
              let newTagList = [...selectedCategories, tag];
              setSelectedCategories(newTagList);
            }}
            onDone={() => toggleCategoryList(false)}
            onClear={() => setSelectedCategories([])}
          />
        </ClickAway>
      )}
    </>
  );
}

export default CategoriesInput;

const FilterContainer = styled(Filter)`
  margin: 8px 0;
`;
