import React, { useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

import { TextInput, View, RadioGroup, Text, Label, Button } from '../../core-ui';
import { session } from '../../utils/storage';
import urlEncode from '../../utils/urlEncode';
import { useSelector } from '../../redux/helpers';
import { THEME_COLOR } from '../../constants/colors';
import { MAPS_IFRAME_URL_SEARCH, MAPS_IFRAME_URL_PLACE } from '../../constants/googleMaps';
import { FONT_SIZE_NORMAL } from '../../constants/theme';

export default function LocationConfirm() {
  let [selectedStatus, setSelectedStatus] = useState('');
  let [isDisabled, setIsDisabled] = useState(true);
  let [location, setLocation] = useState('');
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
        <RowedView>
          <TextInput
            label="Property Name"
            defaultValue={name}
            value={location}
            disabled={isDisabled}
            onChange={(event) => {
              setLocation(event.target.value);
            }}
          />
          <EditButton
            text="Edit"
            onPress={() => {
              setIsDisabled(!isDisabled);
            }}
          />
        </RowedView>
        <Label text="What is your relationship to this business?" />
        <RadioGroup
          name="Marketing Preference"
          options={[
            'Public — I want to publicly advertise my property to matching tenants.',
            'Private — I want to connect with matching tenants without publicly listing my property.',
          ]}
          selectedOption={selectedStatus}
          onSelect={(item) => {
            setSelectedStatus(item);
          }}
          radioItemProps={{ style: { marginTop: 9 } }}
        />
      </FormContainer>
    </>
  );
}

const Iframe = styled.iframe`
  display: block;
  width: 100%;
  height: 240px;
  border: none;
`;

const FormContainer = styled(View)`
  padding: 24px 48px;
`;

const RowedView = styled(View)`
  flex-direction: row;
  margin: 20px 0;
`;

const EditButton = styled(Button)`
  background-color: transparent;
  margin-left: 8px;
  margin-top: 20px;
  height: auto;
  ${Text} {
    color: ${THEME_COLOR};
    font-size: ${FONT_SIZE_NORMAL};
  }
`;
