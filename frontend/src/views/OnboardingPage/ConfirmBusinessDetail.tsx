import React, { useState, Dispatch, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

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
import { Categories } from '../../generated/categories';
import {
  Action,
  ConfirmBusinessDetail as ConfirmBusinessDetailType,
  State as OnboardingState,
} from '../../reducers/tenantOnboardingReducer';

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
  let { data: categoriesData } = useQuery<Categories>(GET_CATEGORIES);
  let [selectedBusinessRelation, setBussinesRelation] = useState(
    onboardingState.confirmBusinessDetail.userRelation || ''
  );
  let [categorySelectionVisible, toggleCategorySelection] = useState(false);
  let [selectedCategories, setSelectedCategories] = useState<Array<string>>(
    onboardingState.confirmBusinessDetail.categories || []
  );

  let { placeID } = useParams();
  let history = useHistory<LocationState>();
  let { state: landingState } = history.location;
  let { name } = landingState;
  let mapURL = MAPS_IFRAME_URL_PLACE + '&q=place_id:' + placeID;

  useEffect(() => {
    let allValid = selectedBusinessRelation && selectedCategories.length > 0 && name;
    if (allValid) {
      dispatch({ type: 'ENABLE_NEXT_BUTTON' });
      dispatch({
        type: 'SAVE_CHANGES',
        values: ({
          confirmBusinessDetail: {
            name,
            categories: selectedCategories,
            userRelation: selectedBusinessRelation,
          },
        } as unknown) as ConfirmBusinessDetailType,
      });
    }
  }, [selectedBusinessRelation, selectedCategories, name, dispatch]);

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
        <RowWrap>
          {selectedCategories.map((category, index) => (
            <PillButton primary key={index} style={{ marginRight: 4, marginTop: 4 }}>
              {category}
            </PillButton>
          ))}
        </RowWrap>
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
        <OtherTextInput placeholder="Landlord" />
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
