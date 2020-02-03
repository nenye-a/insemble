import React, { useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

import { TextInput, View, RadioGroup, Text, Label, Button, ClickAway } from '../../core-ui';
import { Filter } from '../../components';
import { session } from '../../utils/storage';
import urlEncode from '../../utils/urlEncode';
import { useSelector } from '../../redux/helpers';
import { BUTTON_TRANSPARENT_TEXT_COLOR } from '../../constants/colors';
import { MAPS_IFRAME_URL_SEARCH, MAPS_IFRAME_URL_PLACE } from '../../constants/googleMaps';
import { FONT_SIZE_SMALL } from '../../constants/theme';

export default function ConfirmBusinessDetail() {
  let [selectedBusinessRelation, setBussinesRelation] = useState('');
  let [categorySelectionVisible, toggleCategorySelection] = useState(false);
  let { placeID } = useParams();
  let fallbackAddress = useSelector((state) =>
    state.space.location && typeof state.space.location.address === 'string'
      ? state.space.location.address
      : ''
  );

  let place;
  if (placeID != null) {
    place = session.get('place', placeID);
  }
  let name = '';
  let address = '';
  if (place != null) {
    name = place.name;
    address = place.formatted_address || '';
  } else {
    name = session.get('sessionStoreName') || '';
    address = fallbackAddress;
  }

  let mapURL = place
    ? MAPS_IFRAME_URL_PLACE + '&q=place_id:' + place.place_id
    : MAPS_IFRAME_URL_SEARCH + '&q=' + urlEncode(name + ', ' + address);

  return (
    <>
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
          {/* TODO: fetch categories */}
          <FilterContainer
            search
            visible={categorySelectionVisible}
            selectedOptions={[]}
            allOptions={[]}
            onSelect={() => {}}
            onUnSelect={() => {}}
          />
        </ClickAway>
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
    </>
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
  margin: 20px 0;
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
