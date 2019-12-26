import React from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { MAPS_IFRAME_URL_SEARCH, MAPS_IFRAME_URL_PLACE } from '../constants/googleMaps';
import { session } from '../utils/storage';
import urlEncode from '../utils/urlEncode';
import useSelector from '../redux/useSelector';

const Container = styled.div`
  flex-grow: 1;
  position: relative;
`;
const Card = styled.div`
  position: absolute;
  top: 60%;
  left: 50%;
  border: 3px solid #634fa2;
  border-radius: 10px;
  padding: 16px;
  background-color: white;
`;
const Title = styled.h4`
  color: #3d5170;
  font-size: 25px;
  font-weight: 500;
  line-height: 32px;
  margin-bottom: 12px;
`;
const ButtonRow = styled.div`
  display: flex;
  justify-content: space-around;
`;
const LinkButton = styled(Link)`
  color: #3d5170;
  background-color: white;
  line-height: 12px;
  padding: 9px 16px;
  border: 1px solid #e1e5eb;
  border-radius: 16px;
  &:hover {
    text-decoration: none;
    box-shadow: 0 0.125rem 0.625rem rgba(129, 142, 163, 0.2),
      0 0.0625rem 0.125rem rgba(129, 142, 163, 0.3);
  }
`;
const LinkButtonPrimary = styled(LinkButton)`
  color: white;
  background-color: #634fa2;
  border-color: #634fa2;
  &:hover {
    color: white;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05), 0 4px 10px rgba(99, 79, 162, 0.25);
  }
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

function Verify() {
  let { placeID } = useParams();
  let place;
  if (placeID != null) {
    place = session.get('place', placeID);
  }
  let name;
  let address;
  if (place != null) {
    name = place.name;
    address = place.formatted_address;
  } else {
    name = session.get('sessionStoreName') || '';
    address = useSelector((state) => state.space.location && state.space.location.address) || '';
  }

  let mapURL = place
    ? MAPS_IFRAME_URL_PLACE + '&q=place_id:' + place.place_id
    : MAPS_IFRAME_URL_SEARCH + '&q=' + urlEncode(name + ', ' + address);

  return (
    <Container>
      <Iframe src={mapURL} />
      <Card>
        <Title>Is this your store?</Title>
        <ButtonRow>
          <LinkButton to="/existing">No</LinkButton>
          <LinkButtonPrimary to="/spaces">Yes</LinkButtonPrimary>
        </ButtonRow>
      </Card>
    </Container>
  );
}

export default Verify;
