import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-fetching-library';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import { View, TouchableOpacity, ContainedTextInput, ClickAway } from '../../core-ui';
import { Filter } from '../../components';
import { loadMap } from '../../redux/actions/space';

type Props = {
  loadMap: (hasLocation: boolean, income: number, selectedCategories: Array<string>) => void;
};

function CategoriesInput(props: Props) {
  let history = useHistory();
  let { loading, payload } = useQuery({
    method: 'GET',
    endpoint: '/api/category/',
  });
  let [income, setIncome] = useState('');
  let [categoryListOpen, toggleCategoryList] = useState(false);
  let [selectedCategories, setSelectedCategories] = useState<Array<string>>([]);

  return (
    <>
      <Container flex>
        <TouchableOpacity onPress={() => toggleCategoryList(!categoryListOpen)}>
          <ContainedTextInput
            disabled
            placeholder={loading ? 'Loading' : 'Enter store categories'}
            value={selectedCategories.join(', ')}
          />
        </TouchableOpacity>
        <TargetIncomeContainer flex>
          <ContainedTextInput
            placeholder="Enter target househould income categories"
            buttonText="Find Locations"
            value={income}
            onChange={(e) => {
              setIncome(e.target.value);
            }}
            onSubmit={() => {
              // TODO: validate input
              props.loadMap(false, Number(income), selectedCategories);
              history.push('/map', { targetIncome: income, selectedCategories });
            }}
          />
        </TargetIncomeContainer>
      </Container>
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mapStateToProps = (state: any) => ({
  hasLocation: state.space.hasLocation,
});

export default connect(mapStateToProps, { loadMap })(CategoriesInput);

const Container = styled(View)`
  flex-direction: row;
  width: 100%;
`;

const TargetIncomeContainer = styled(View)`
  margin-left: 8px;
`;

const FilterContainer = styled(Filter)`
  margin: 8px 0;
`;
