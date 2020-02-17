import React, { useState, Dispatch, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { useForm, FieldError } from 'react-hook-form';

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
import { MAPS_IFRAME_URL_PLACE } from '../../constants/googleMaps';
import { FONT_SIZE_SMALL } from '../../constants/theme';
import { GET_CATEGORIES } from '../../graphql/queries/server/filters';
import { Categories } from '../../generated/Categories';
import { Action, State as OnboardingState } from '../../reducers/tenantOnboardingReducer';

type Props = {
  dispatch: Dispatch<Action>;
  state: OnboardingState;
};

type LocationState = {
  placeID: string;
  name: string;
  formattedAddress: string;
  lat: number;
  lng: number;
};

export default function ConfirmBusinessDetail(props: Props) {
  let { dispatch, state: onboardingState } = props;
  let { confirmBusinessDetail } = onboardingState;

  let { data: categoriesData } = useQuery<Categories>(GET_CATEGORIES);

  let [selectedBusinessRelation, setBussinesRelation] = useState(
    confirmBusinessDetail.userRelation || ''
  );
  let [categorySelectionVisible, toggleCategorySelection] = useState(false);
  let [selectedCategories, setSelectedCategories] = useState<Array<string>>(
    confirmBusinessDetail.categories || []
  );

  let { register, errors, watch } = useForm();
  let otherBusinessRelation = watch('otherBusinessRelation');

  let { placeID } = useParams();
  let history = useHistory<LocationState>();
  let { state: landingState } = history.location;
  let { name, lat, lng } = landingState;
  let mapURL = MAPS_IFRAME_URL_PLACE + '&q=place_id:' + placeID;

  let businessRelationValid =
    selectedBusinessRelation || (selectedBusinessRelation === 'Other' && otherBusinessRelation);
  let allValid = businessRelationValid && selectedCategories.length > 0 && name;
  useEffect(() => {
    if (allValid) {
      dispatch({ type: 'ENABLE_NEXT_BUTTON' });
      dispatch({
        type: 'SAVE_CHANGES_CONFIRM_BUSINESS_DETAIL',
        values: {
          confirmBusinessDetail: {
            name,
            categories: selectedCategories,
            userRelation: selectedBusinessRelation,
            otherUserRelation: otherBusinessRelation,
            location: {
              lat: lat.toString(),
              lng: lng.toString(),
              name,
            },
          },
        },
      });
    } else {
      dispatch({ type: 'DISABLE_NEXT_BUTTON' });
    }
  }, [
    selectedBusinessRelation,
    selectedCategories,
    name,
    dispatch,
    allValid,
    lat,
    lng,
    otherBusinessRelation,
  ]);

  return (
    <Form>
      <Iframe src={mapURL} />
      <FormContainer>
        <TextInput label="Business Name" defaultValue={name} disabled />
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
        {selectedCategories.length === 0 && <ErrorText>Please Select Categories</ErrorText>}
        <Label text="What is your relationship to this business?" />
        <RadioGroup
          name="business-relationship"
          options={[
            'I am the owner of this business',
            'I operate this business location',
            'I am an agent representing this business',
            'Other',
          ]}
          selectedOption={selectedBusinessRelation}
          onSelect={(item) => {
            setBussinesRelation(item);
          }}
          radioItemProps={{ style: { marginTop: 9 } }}
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
