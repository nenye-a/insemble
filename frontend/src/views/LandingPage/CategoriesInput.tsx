import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-fetching-library';
import { useHistory } from 'react-router-dom';

import { TouchableOpacity, ContainedTextInput, ClickAway } from '../../core-ui';
import { Filter } from '../../components';

function CategoriesInput() {
  let history = useHistory();
  let { loading, payload } = useQuery({
    method: 'GET',
    endpoint: '/api/category/',
  });
  let [categoryListOpen, toggleCategoryList] = useState(false);
  let [selectedCategories, setSelectedCategories] = useState<Array<string>>([]);

  return (
    <>
      <TouchableOpacity onPress={() => toggleCategoryList(!categoryListOpen)}>
        <ContainedTextInput
          placeholder={loading ? 'Loading' : 'Enter store categories'}
          buttonText="Find Locations"
          value={selectedCategories.join(', ')}
          onSubmit={() => {
            history.push('/verify', { categories: selectedCategories });
          }}
        />
      </TouchableOpacity>
      {categoryListOpen && payload && (
        <ClickAway onClickAway={() => toggleCategoryList(false)}>
          <FilterContainer
            visible
            search
            selectedOptions={selectedCategories}
            allOptions={payload}
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
