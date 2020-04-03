import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useForm, FieldError, FieldValues } from 'react-hook-form';

import {
  TextInput,
  View,
  RadioGroup,
  Text,
  Label,
  Button,
  ClickAway,
  Form,
  PillButton,
  LoadingIndicator,
} from '../../core-ui';
import { Filter } from '../../components';
import { BUTTON_TRANSPARENT_TEXT_COLOR, RED_TEXT } from '../../constants/colors';
import { MAPS_IFRAME_URL_SEARCH } from '../../constants/googleMaps';
import { FONT_SIZE_SMALL } from '../../constants/theme';
import { GET_CATEGORIES, GET_AUTOPOPULATE_FILTER } from '../../graphql/queries/server/filters';
import { Categories } from '../../generated/Categories';
import {
  AutoPopulateFilter,
  AutoPopulateFilterVariables,
} from '../../generated/AutoPopulateFilter';
import { LocationState } from './types';
import OnboardingFooter from '../../components/layout/OnboardingFooter';
import {
  GET_TENANT_ONBOARDING_STATE,
  UPDATE_TENANT_ONBOARDING,
} from '../../graphql/queries/client/tenantOnboarding';
import { TenantOnboardingState } from '../../graphql/localState';
import { LocationInput } from '../../generated/globalTypes';

export default function ConfirmBusinessDetail() {
  let { register, errors, handleSubmit } = useForm();
  let { data: categoriesData } = useQuery<Categories>(GET_CATEGORIES);
  let [
    getAutopopulateData,
    { data: autopopulateData, loading: autopopulateLoading, error: apError },
  ] = useLazyQuery<AutoPopulateFilter, AutoPopulateFilterVariables>(GET_AUTOPOPULATE_FILTER);
  let { data: onboardingStateData, loading: onboardingStateLoading } = useQuery<
    TenantOnboardingState
  >(GET_TENANT_ONBOARDING_STATE);
  let [updateTenantOnboarding] = useMutation(UPDATE_TENANT_ONBOARDING);
  let [selectedBusinessRelation, setBussinesRelation] = useState('');
  let [categorySelectionVisible, toggleCategorySelection] = useState(false);
  let [selectedCategories, setSelectedCategories] = useState<Array<string>>([]);
  let [selectedLocation, setSelectedLocation] = useState<LocationInput | null>(null);
  let [isSubmitted, setSubmitted] = useState(false);
  let history = useHistory<LocationState>();

  let iframeSource =
    selectedLocation?.lat && selectedLocation?.lng
      ? MAPS_IFRAME_URL_SEARCH + '&q=' + selectedLocation.lat + ', ' + selectedLocation.lng
      : '';

  useEffect(() => {
    if (autopopulateData?.autoPopulateFilter.categories) {
      setSelectedCategories(autopopulateData.autoPopulateFilter.categories);
    }
  }, [autopopulateData]);

  useEffect(() => {
    if (onboardingStateData) {
      let {
        name,
        location: { lat, lng, address },
        categories,
        userRelation,
      } = onboardingStateData.tenantOnboardingState.confirmBusinessDetail;
      setBussinesRelation(userRelation);
      setSelectedCategories(categories);
      setSelectedLocation({ lat, lng, address });
      if (address && name) {
        getAutopopulateData({
          variables: {
            address: address,
            brandName: name,
          },
        });
      }
    }
  }, [onboardingStateData, getAutopopulateData]);

  let saveFormState = (fieldValues: FieldValues) => {
    updateTenantOnboarding({
      variables: {
        confirmBusinessDetail: {
          name: fieldValues.businessName,
          categories: selectedCategories,
          userRelation: fieldValues.businessRelationship,
          otherUserRelation: fieldValues.otherBusinessRelation,
        },
      },
    });
  };

  let onSubmit = (fieldValues: FieldValues) => {
    let allValid = Object.keys(errors).length === 0 && selectedCategories.length > 0;

    if (allValid) {
      saveFormState(fieldValues);
      history.push('/verify/step-2');
    }
  };

  if (!onboardingStateLoading && onboardingStateData) {
    let {
      name,
      otherUserRelation,
    } = onboardingStateData.tenantOnboardingState.confirmBusinessDetail;
    return (
      <Form
        style={{ flex: 1 }}
        onSubmit={() => {
          if (!isSubmitted) {
            setSubmitted(true);
          }
          handleSubmit(onSubmit)();
        }}
      >
        {iframeSource && <Iframe src={iframeSource} />}
        <FormContainer>
          <TextInput
            label="Business Name"
            defaultValue={name}
            name="businessName"
            ref={register({
              required: 'Business Name should not be empty',
            })}
            errorMessage={(errors?.businessName as FieldError)?.message || ''}
            containerStyle={{ paddingBottom: 12 }}
          />
          <CategoryInput>
            <RowedView>
              <Label text="Categories" />
              <EditButton
                text="Edit"
                onPress={() => toggleCategorySelection(!categorySelectionVisible)}
              />
            </RowedView>
            <ClickAway onClickAway={() => toggleCategorySelection(false)} style={{ zIndex: 1 }}>
              {categoriesData && (
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
                  loading={autopopulateLoading}
                />
              )}
            </ClickAway>
            <RowWrap>
              {selectedCategories.map((category, index) => (
                <PillButton primary key={index} style={{ marginRight: 4, marginTop: 4 }}>
                  {category}
                </PillButton>
              ))}
            </RowWrap>
            {isSubmitted && selectedCategories.length === 0 && (
              <ErrorText>Please Select Categories</ErrorText>
            )}
          </CategoryInput>

          <LabelText text="What is your relationship to this business?" />
          <RadioGroup
            name="businessRelationship"
            options={[
              'I am the owner of this business',
              'I am a development manager',
              'I am an agent representing this business',
              'Other',
            ]}
            selectedOption={selectedBusinessRelation}
            onSelect={(item) => {
              setBussinesRelation(item);
            }}
            radioItemProps={{
              style: { marginBottom: 8 },
              ref: register({
                required: 'Please select your relation to this business',
              }),
            }}
            errorMessage={(errors?.businessRelationship as FieldError)?.message || ''}
          />
          {/* TODO: put to constants */}
          {selectedBusinessRelation === 'Other' && (
            <OtherTextInput
              placeholder="Landlord"
              ref={register({
                required: 'Input should not be empty',
              })}
              name="otherBusinessRelation"
              errorMessage={(errors?.otherBusinessRelation as FieldError)?.message || ''}
              defaultValue={otherUserRelation}
            />
          )}
        </FormContainer>
        <OnboardingFooter>
          <TransparentButton
            text="Not My Address"
            mode="transparent"
            type="submit"
            onPress={() => history.goBack()}
          />
          <Button text="Next" type="submit" />
        </OnboardingFooter>
      </Form>
    );
  } else if (onboardingStateLoading) {
    return <LoadingIndicator />;
  } else {
    return null;
  }
}

const Iframe = styled.iframe`
  display: block;
  width: 100%;
  height: 152px;
  border: none;
`;

const FormContainer = styled(View)`
  padding: 24px 48px;
  z-index: 1;
  flex: 1;
`;

const RowedView = styled(View)`
  flex-direction: row;
`;

const FilterContainer = styled(Filter)`
  position: absolute;
  z-index: 2;
`;
const EditButton = styled(Button)`
  background-color: transparent;
  font-style: italic;
  margin-left: 8px;
  height: auto;
  padding: 0;
  ${Text} {
    color: ${BUTTON_TRANSPARENT_TEXT_COLOR};
    font-size: ${FONT_SIZE_SMALL};
  }
`;
const OtherTextInput = styled(TextInput)`
  margin: 9px 24px;
  width: 130px;
`;

const ErrorText = styled(Text)`
  font-size: ${FONT_SIZE_SMALL};
  color: ${RED_TEXT};
`;

const RowWrap = styled(View)`
  flex-flow: row wrap;
`;

const TransparentButton = styled(Button)`
  margin-right: 8px;
  padding: 0 12px;
`;

const CategoryInput = styled(View)`
  padding: 12px 0;
  z-index: 2;
`;

const LabelText = styled(Label)`
  padding-top: 12px;
  padding-bottom: 8px;
`;
