import React, { useState, Dispatch, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
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
} from '../../core-ui';
import { Filter } from '../../components';
import { BUTTON_TRANSPARENT_TEXT_COLOR, RED_TEXT } from '../../constants/colors';
import { MAPS_IFRAME_URL_SEARCH } from '../../constants/googleMaps';
import { FONT_SIZE_SMALL } from '../../constants/theme';
import { GET_CATEGORIES, GET_AUTOPOPULATE_FILTER } from '../../graphql/queries/server/filters';
import { Categories } from '../../generated/Categories';
import { Action, State as OnboardingState } from '../../reducers/tenantOnboardingReducer';
import {
  AutoPopulateFilter,
  AutoPopulateFilterVariables,
} from '../../generated/AutoPopulateFilter';
import { LocationState } from './types';
import OnboardingFooter from '../../components/layout/OnboardingFooter';

type Props = {
  dispatch: Dispatch<Action>;
  state: OnboardingState;
};

export default function ConfirmBusinessDetail(props: Props) {
  let { dispatch, state: onboardingState } = props;
  let { confirmBusinessDetail } = onboardingState;

  let { register, errors, watch, handleSubmit } = useForm();
  let name = watch('businessName');
  let { data: categoriesData } = useQuery<Categories>(GET_CATEGORIES);
  let { data: autopopulateData, loading: autopopulateLoading } = useQuery<
    AutoPopulateFilter,
    AutoPopulateFilterVariables
  >(GET_AUTOPOPULATE_FILTER, {
    variables: {
      address: confirmBusinessDetail.location?.address || '',
      brandName: name,
    },
    skip: !confirmBusinessDetail.location?.address || !confirmBusinessDetail.name,
  });
  let [selectedBusinessRelation, setBussinesRelation] = useState(
    confirmBusinessDetail.userRelation || ''
  );
  let [categorySelectionVisible, toggleCategorySelection] = useState(false);
  let [selectedCategories, setSelectedCategories] = useState<Array<string>>(
    confirmBusinessDetail.categories || []
  );
  let [isSubmitted, setSubmitted] = useState(false);
  let history = useHistory<LocationState>();

  let iframeSource =
    confirmBusinessDetail.location?.lat && confirmBusinessDetail.location?.lng
      ? MAPS_IFRAME_URL_SEARCH +
        '&q=' +
        confirmBusinessDetail.location?.lat +
        ', ' +
        confirmBusinessDetail.location?.lng
      : '';

  useEffect(() => {
    if (autopopulateData?.autoPopulateFilter.categories) {
      setSelectedCategories(autopopulateData.autoPopulateFilter.categories);
    }
  }, [autopopulateData]);

  let saveFormState = (fieldValues: FieldValues) => {
    dispatch({
      type: 'SAVE_CHANGES_CONFIRM_BUSINESS_DETAIL',
      values: {
        confirmBusinessDetail: {
          ...onboardingState.confirmBusinessDetail,
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
          defaultValue={confirmBusinessDetail.name}
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
          <ClickAway onClickAway={() => toggleCategorySelection(false)}>
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
            defaultValue={onboardingState.confirmBusinessDetail.otherUserRelation}
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
