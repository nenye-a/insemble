import React from 'react';
import { Container, Row } from 'shards-react';
import MapComponent from './MapContainer';

import LoadingOverlay from 'react-loading-overlay';

import useSelector from '../redux/useSelector';

function Spaces() {
  // let { markers, heats } = this.state;
  let markers: Array<any> = [];
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
          <MapComponent markers={markers} heats={heats} />
        </Row>
      </Container>
    </LoadingOverlay>
  );
}

export default Spaces;
