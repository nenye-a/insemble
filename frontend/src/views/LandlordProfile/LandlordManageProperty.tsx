import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';

import {
  View,
  TextInput,
  Label,
  Form,
  Button,
  Checkbox,
  TouchableOpacity,
  ClickAway,
} from '../../core-ui';
import OnboardingFooter from '../../components/layout/OnboardingFooter';
import { FONT_SIZE_NORMAL } from '../../constants/theme';
import { WHITE } from '../../constants/colors';
import { GET_CATEGORIES } from '../../graphql/queries/server/filters';
import { SPACES_TYPE } from '../../constants/spaces';
import { SERVICE_OPTIONS } from '../LandlordOnboardingPage/TenantConfirm';
import { Categories } from '../../generated/Categories';
import { Filter } from '../../components';

type Props = {
  spaceId: string;
};

export default function LandlordManageProperty() {
  let [selectedType, setSelectedType] = useState<Array<string>>([]);
  let [selectedBusinessService, setSelectedBusinessService] = useState<Array<string>>([]);
  let { data: categoriesData } = useQuery<Categories>(GET_CATEGORIES);
  let [categorySelectionVisible, toggleCategorySelection] = useState(false);
  let [selectedCategories, setSelectedCategories] = useState<Array<string>>([]);
  let [existingCategorySelectionVisible, toggleExistingCategorySelectionVisible] = useState(false);
  let [selectedExistingCategories, setExistingSelectedCategories] = useState<Array<string>>([]);

  return (
    <Form>
      <Container>
        <LabelText text="What type of property is this?" />
        {SPACES_TYPE.map((option, index) => {
          let isChecked = selectedType.includes(option);
          return (
            <Checkbox
              key={index}
              size="18px"
              title={option}
              titleProps={{ style: { fontSize: FONT_SIZE_NORMAL } }}
              isChecked={isChecked}
              onPress={() => {
                if (isChecked) {
                  let newSelectedType = selectedType.filter((item: string) => item !== option);
                  setSelectedType(newSelectedType);
                } else {
                  setSelectedType([...selectedType, option]);
                }
              }}
              style={{ lineHeight: 2 }}
            />
          );
        })}

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
      </Container>
      <OnboardingFooter>
        <Button text="Done" type="submit" />
      </OnboardingFooter>
    </Form>
  );
}
const Container = styled(View)`
  padding: 12px 24px;
  z-index: 1;
  background-color: ${WHITE};
`;

const LabelText = styled(Label)`
  margin: 12px 0 8px 0;
`;

const SelectCategories = styled(TextInput)`
  &::placeholder {
    font-style: italic;
  }
`;

const FilterContainer = styled(Filter)`
  position: absolute;
  z-index: 3;
`;
