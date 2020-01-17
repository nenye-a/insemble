import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { Card, Text, Button, View } from '../core-ui';
import { MAPS_IFRAME_URL_SEARCH, MAPS_IFRAME_URL_PLACE } from '../constants/googleMaps';
import { session } from '../utils/storage';
import urlEncode from '../utils/urlEncode';
import { useSelector } from '../redux/helpers';
import { THEME_COLOR } from '../constants/colors';

function Verify() {
  let { placeID } = useParams();
  let history = useHistory();

  let place;
  if (placeID != null) {
    place = session.get('place', placeID);
  }
  let name: string = '';
  let address: string = '';
  if (place != null) {
    name = place.name;
    address = place.formatted_address as string;
  } else {
    name = session.get('sessionStoreName') || '';
    address = useSelector(
      (state: any): string => (state.space.location && state.space.location.address) || ''
    );
  }

  let mapURL = place
    ? MAPS_IFRAME_URL_PLACE + '&q=place_id:' + place.place_id
    : MAPS_IFRAME_URL_SEARCH + '&q=' + urlEncode(name + ', ' + address);

  return (
    <View flex>
      {/* TODO: change to react google map and utilize InfoWindow so the popup position is more precise */}
      <Iframe src={mapURL} />
      <CardContainer>
        <Title fontSize="28px">Is this your location?</Title>
        <MarginContainer>
          <Text color={THEME_COLOR}>Brand Name:</Text>
          <Text>{name}</Text>
        </MarginContainer>
        <MarginContainer>
          <Text color={THEME_COLOR}>Address:</Text>
          <Text>{address.toString()}</Text>
        </MarginContainer>
        <RowedView>
          <Button
            text="Yes"
            onPress={() => {
              history.push('/spaces');
            }}
            style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
          />
          <View style={{ width: 5 }}></View>
          <Button
            mode="secondary"
            text="No"
            onPress={() => {
              history.push('/existing');
            }}
            style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
          />
        </RowedView>
      </CardContainer>
    </View>
  );
}

const RowedView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;

const Title = styled(Text)`
  font-size: 28px;
  margin-bottom: 12px;
`;

const MarginContainer = styled(View)`
  margin-bottom: 20px;
`;

const CardContainer = styled(Card)`
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 21px;
  background-color: white;
  width: 300px;
`;

const Iframe = styled.iframe`
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  border: none;
`;

export default Verify;
