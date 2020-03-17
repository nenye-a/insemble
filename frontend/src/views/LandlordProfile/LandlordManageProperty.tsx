import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useParams, useHistory } from 'react-router-dom';

import {
  View,
  TextInput,
  Label,
  Form,
  Button,
  Checkbox,
  TouchableOpacity,
  ClickAway,
  Alert,
} from '../../core-ui';
import OnboardingFooter from '../../components/layout/OnboardingFooter';
import { FONT_SIZE_NORMAL } from '../../constants/theme';
import { WHITE } from '../../constants/colors';
import { GET_CATEGORIES } from '../../graphql/queries/server/filters';
import { SPACES_TYPE } from '../../constants/spaces';
import { SERVICE_OPTIONS } from '../LandlordOnboardingPage/TenantConfirm';
import { Categories } from '../../generated/Categories';
import { Filter } from '../../components';
import { EDIT_PROPERTY } from '../../graphql/queries/server/properties';
import { EditProperty, EditPropertyVariables } from '../../generated/EditProperty';
import { MarketingPreference, LocationInput } from '../../generated/globalTypes';
import omitTypename from '../../utils/omitTypename';

type Props = {
  spaceId: string;
};

const RELATION_TYPES = ['Owner', 'Representative Agent'];

type PropertyState = {
  property: {
    name: string;
    categories: Array<string>;
    location: LocationInput;
    businessType: Array<string>;
    propertyType: Array<string>;
    exclusive: Array<string>;
    marketingPreference: MarketingPreference;
    userRelations: Array<string>;
  };
};

export default function LandlordManageProperty() {
  let { paramsId } = useParams();
  let history = useHistory<PropertyState>();
  let { property } = history.location.state;
  let { data: categoriesData, error, loading } = useQuery<Categories>(GET_CATEGORIES);
  let [
    editProperty,
    { data: editPropertyData, loading: editPropertyLoading, error: editPropertyError },
  ] = useMutation<EditProperty, EditPropertyVariables>(EDIT_PROPERTY);
  let [selectedType, setSelectedType] = useState<Array<string>>(property.propertyType || []);
  let [selectedBusinessService, setSelectedBusinessService] = useState<Array<string>>(
    property.businessType || []
  );
  let [selectedRelationType, setSelectedRelationType] = useState<Array<string>>(
    property.userRelations || []
  );
  let [categorySelectionVisible, toggleCategorySelection] = useState(false);
  let [selectedCategories, setSelectedCategories] = useState<Array<string>>(
    property.categories || []
  );
  let [existingCategorySelectionVisible, toggleExistingCategorySelectionVisible] = useState(false);
  let [selectedExistingCategories, setExistingSelectedCategories] = useState<Array<string>>([]);
  let [otherService, setOtherService] = useState(
    property.businessType.find((service: string) => !SERVICE_OPTIONS.includes(service)) || ''
  );

  let onSubmit = () => {
    let { name, location, marketingPreference } = property;
    if (paramsId) {
      editProperty({
        variables: {
          property: {
            name,
            categories: selectedCategories,
            location: omitTypename(location) as LocationInput,
            businessType: selectedBusinessService,
            propertyType: selectedType,
            exclusive: selectedExistingCategories,
            marketingPreference,
            userRelations: selectedRelationType,
          },
          propertyId: paramsId,
        },
      });
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      {editPropertyData && <Alert text="Property succesfully updated" />}
      {editPropertyError && <Alert text={editPropertyError.message || ''} />}
      <Container>
        <InputWrapper>
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
        </InputWrapper>
        <InputWrapper>
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
            disabled={
              !selectedBusinessService.includes(SERVICE_OPTIONS[SERVICE_OPTIONS.length - 1])
            }
            value={otherService}
            onChange={(event) => {
              setOtherService(event.target.value);
            }}
          />
        </InputWrapper>
        <InputWrapper>
          <LabelText text="What is your relationship to this property?" />
          {RELATION_TYPES.map((option, index) => {
            let isChecked = selectedRelationType.includes(option);
            return (
              <Checkbox
                key={index}
                size="18px"
                title={option}
                isChecked={isChecked}
                onPress={() => {
                  if (isChecked) {
                    let newSelectedType = selectedRelationType.filter(
                      (item: string) => item !== option
                    );
                    setSelectedRelationType(newSelectedType);
                  } else {
                    setSelectedRelationType([...selectedRelationType, option]);
                  }
                }}
                style={{ lineHeight: 2 }}
              />
            );
          })}
        </InputWrapper>
        {categoriesData && (
          <>
            <InputWrapper>
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
            </InputWrapper>
            <InputWrapper>
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
            </InputWrapper>
          </>
        )}
      </Container>
      <OnboardingFooter>
        <Button text="Done" type="submit" loading={editPropertyLoading} />
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

const OtherTextInput = styled(TextInput)`
  margin: 9px 0 0 30px;
  width: 130px;
`;

const InputWrapper = styled(View)`
  padding: 12px 0;
`;
