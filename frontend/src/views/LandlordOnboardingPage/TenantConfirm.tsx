import React, { useState, Dispatch, useEffect } from 'react';
import styled from 'styled-components';

import { TextInput, View, Label, Checkbox, ClickAway, TouchableOpacity } from '../../core-ui';
import { FONT_SIZE_NORMAL } from '../../constants/theme';
import { useQuery } from '@apollo/react-hooks';
import { Categories } from '../../generated/Categories';
import { GET_CATEGORIES } from '../../graphql/queries/server/filters';
import { Filter } from '../../components';
import { Action, State as LandlordOnboardingState } from '../../reducers/landlordOnboardingReducer';

type Props = {
  dispatch: Dispatch<Action>;
  state: LandlordOnboardingState;
};

const SERVICE_OPTIONS = ['Retail', 'Restaurant', 'Fitness', 'Entertainment', 'Others'];

export default function TenantConfirm(props: Props) {
  let { dispatch, state } = props;
  let { confirmTenant } = state;
  let { data: categoriesData } = useQuery<Categories>(GET_CATEGORIES);
  let [selectedBusinessService, setSelectedBusinessService] = useState<Array<string>>(
    confirmTenant?.businessType || []
  );
  let [otherService, setOtherService] = useState(confirmTenant?.otherBussinessType || '');

  let [categorySelectionVisible, toggleCategorySelection] = useState(false);
  let [selectedCategories, setSelectedCategories] = useState<Array<string>>(
    confirmTenant?.selectedRetailCategories || []
  );

  let [existingCategorySelectionVisible, toggleExistingCategorySelectionVisible] = useState(false);
  let [selectedExistingCategories, setExistingSelectedCategories] = useState<Array<string>>(
    confirmTenant?.existingExclusives || []
  );

  let isValid = selectedBusinessService?.includes('Others') && otherService !== '';
  useEffect(() => {
    if (isValid) {
      dispatch({ type: 'ENABLE_NEXT_BUTTON' });
      dispatch({
        type: 'SAVE_CHANGES_CONFIRM_TENANT',
        values: {
          confirmTenant: {
            businessType: selectedBusinessService,
            selectedRetailCategories: selectedCategories,
            existingExclusives: selectedExistingCategories,
            otherBussinessType: otherService,
          },
        },
      });
    }
  }, [
    isValid,
    selectedBusinessService,
    otherService,
    selectedExistingCategories,
    selectedCategories,
    dispatch,
  ]);
  return (
    <>
      <FormContainer>
        <LabelText text="What type of business can your property serve?" />
        {SERVICE_OPTIONS.map((option, index) => {
          let isChecked = selectedBusinessService.includes(option);
          return (
            <Checkbox
              key={index}
              size="18px"
              title={option}
              titleProps={{ style: { fontSize: FONT_SIZE_NORMAL } }}
              isChecked={isChecked}
              onPress={() => {
                if (isChecked) {
                  let newSelectedService = selectedBusinessService.filter(
                    (item: string) => item !== option
                  );
                  setSelectedBusinessService(newSelectedService);
                } else {
                  setSelectedBusinessService([...selectedBusinessService, option]);
                }
              }}
              style={{ lineHeight: 2 }}
            />
          );
        })}
        <OtherTextInput
          placeholder="Coffee"
          disabled={!selectedBusinessService.includes(SERVICE_OPTIONS[SERVICE_OPTIONS.length - 1])}
          value={otherService}
          onChange={(event) => {
            setOtherService(event.target.value);
          }}
        />
        {categoriesData && (
          <>
            <LabelText text="Are you looking for any specific retail categories?" />
            <TouchableOpacity onPress={() => toggleCategorySelection(!categorySelectionVisible)}>
              <SelectCategories
                disabled
                placeholder="Select retailer categories"
                value={selectedCategories.join(', ')}
              />
            </TouchableOpacity>
            <ClickAway onClickAway={() => toggleCategorySelection(false)}>
              <FilterContainer
                search
                visible={categorySelectionVisible}
                selectedOptions={selectedCategories}
                allOptions={categoriesData.categories}
                onSelect={(category: string) => {
                  setSelectedCategories([...selectedCategories, category]);
                }}
                onUnSelect={(category: string) => {
                  let newSelectedCategories = selectedCategories.filter(
                    (el: string) => !el.includes(category)
                  );
                  setSelectedCategories(newSelectedCategories);
                }}
                onDone={() => toggleCategorySelection(false)}
                onClear={() => setSelectedCategories([])}
              />
            </ClickAway>
            <LabelText text="Do you have any existing exclusives?" />
            <TouchableOpacity
              onPress={() =>
                toggleExistingCategorySelectionVisible(!existingCategorySelectionVisible)
              }
            >
              <SelectCategories
                disabled
                placeholder="Select retailer categories"
                value={selectedExistingCategories.join(', ')}
              />
            </TouchableOpacity>
            <ClickAway onClickAway={() => toggleExistingCategorySelectionVisible(false)}>
              <FilterContainer
                search
                visible={existingCategorySelectionVisible}
                selectedOptions={selectedExistingCategories}
                allOptions={categoriesData.categories}
                onSelect={(category: string) => {
                  setExistingSelectedCategories([...selectedExistingCategories, category]);
                }}
                onUnSelect={(category: string) => {
                  let newSelectedCategories = selectedExistingCategories.filter(
                    (el: string) => !el.includes(category)
                  );
                  setExistingSelectedCategories(newSelectedCategories);
                }}
                onDone={() => toggleExistingCategorySelectionVisible(false)}
                onClear={() => setExistingSelectedCategories([])}
              />
            </ClickAway>
          </>
        )}
      </FormContainer>
    </>
  );
}

const FormContainer = styled(View)`
  padding: 24px 48px;
`;
const FilterContainer = styled(Filter)`
  position: absolute;
  z-index: 2;
`;

const LabelText = styled(Label)`
  margin-top: 24px;
`;
const OtherTextInput = styled(TextInput)`
  margin: 9px 0 9px 30px;
  width: 130px;
`;

const SelectCategories = styled(TextInput)`
  &::placeholder {
    font-style: italic;
  }
`;
