import React from 'react';
import { Container, Row } from 'shards-react';
import LoadingOverlay from 'react-loading-overlay';

import MapContainer from './MapContainer';
import { useSelector } from '../redux/helpers';

type LatLngLiteral = google.maps.LatLngLiteral;

function Spaces() {
  let markers: Array<LatLngLiteral> = [];
  let heats: Array<any> = [];
  let mapIsLoading = useSelector((state) => state.space.mapIsLoading);
  return (
    <LoadingOverlay
      active={mapIsLoading}
      spinner
      text="Evaluating thousands of locations to find your matches. May take a couple minutes..."
    >
      <Container fluid className="main-content-container m-0">
        <Row>
          <MapContainer markers={markers} heats={heats} />
        </Row>
      </Container>
    </LoadingOverlay>
  );
}

export default Spaces;
