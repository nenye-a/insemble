import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';

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
  LoadingIndicator,
} from '../../core-ui';
import OnboardingFooter from '../../components/layout/OnboardingFooter';
import { FONT_SIZE_NORMAL } from '../../constants/theme';
import { WHITE } from '../../constants/colors';
import { GET_CATEGORIES } from '../../graphql/queries/server/filters';
import { SERVICE_OPTIONS } from '../LandlordOnboardingPage/TenantConfirm';
import { Categories } from '../../generated/Categories';
import { Filter, ErrorComponent } from '../../components';
import { EDIT_PROPERTY, GET_PROPERTY } from '../../graphql/queries/server/properties';
import { EditProperty, EditPropertyVariables } from '../../generated/EditProperty';
import { Property, PropertyVariables } from '../../generated/Property';

const RELATION_TYPES = ['Owner', 'Representative Agent'];

export default function LandlordManageProperty() {
  let { paramsId: propertyId = '' } = useParams();
  let { data: propertyData, loading: propertyLoading, refetch: propertyRefetch } = useQuery<
    Property,
    PropertyVariables
  >(GET_PROPERTY, {
    variables: {
      propertyId: propertyId,
    },
  });
  let { data: categoriesData } = useQuery<Categories>(GET_CATEGORIES);
  let [
    editProperty,
    { data: editPropertyData, loading: editPropertyLoading, error: editPropertyError },
  ] = useMutation<EditProperty, EditPropertyVariables>(EDIT_PROPERTY);

  let [selectedRelationType, setSelectedRelationType] = useState<Array<string>>([]);
  let [existingCategorySelectionVisible, toggleExistingCategorySelectionVisible] = useState(false);
  let [selectedExistingCategories, setExistingSelectedCategories] = useState<Array<string>>([]);
  let [otherService, setOtherService] = useState('');
  let [selectedBusinessService, setSelectedBusinessService] = useState<Array<string>>([]);

  useEffect(() => {
    if (propertyData) {
      let { businessType, exclusive, userRelations } = propertyData.property;
      setSelectedRelationType(userRelations);
      setExistingSelectedCategories(exclusive);
      let otherSvc = businessType.find((service: string) => !SERVICE_OPTIONS.includes(service));
      if (otherSvc) {
        setOtherService(otherSvc);
      }
      let defaultBusinessType = otherSvc ? [...businessType, 'Other'] : businessType;
      setSelectedBusinessService(defaultBusinessType);
    }
  }, [propertyData]);

  let onSubmit = () => {
    if (propertyData && propertyId) {
      let { name, location } = propertyData.property;
      let { lat, lng, address } = location;
      let businessType = otherService
        ? [...selectedBusinessService.filter((svc) => svc !== 'Other'), otherService]
        : selectedBusinessService;
      let variables = {
        property: {
          name,
          location: { lat, lng, address },
          businessType,
          exclusive: selectedExistingCategories,
          userRelations: selectedRelationType,
        },
        propertyId,
      };
      editProperty({
        variables,
        refetchQueries: [
          {
            query: GET_PROPERTY,
            variables: {
              propertyId,
            },
          },
        ],
        awaitRefetchQueries: true,
      });
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Container>
        {propertyLoading ? (
          <LoadingIndicator />
        ) : propertyData ? (
          <>
            {<Alert visible={!!editPropertyData} text="Property succesfully updated" />}
            {<Alert visible={!!editPropertyError} text={editPropertyError?.message || ''} />}
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
                defaultValue={otherService}
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
          </>
        ) : (
          <ErrorComponent onRetry={propertyRefetch} />
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
  background-color: ${WHITE};
`;

const OtherTextInput = styled(TextInput)`
  margin: 9px 0 0 30px;
  width: 130px;
`;

const InputWrapper = styled(View)`
  padding: 12px 0;
`;
