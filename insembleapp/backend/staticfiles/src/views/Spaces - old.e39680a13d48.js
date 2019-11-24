import React from "react";
import { Container, Row, Col, ButtonGroup, Button } from "shards-react";
import { Map, HeatMap, GoogleApiWrapper, Marker } from 'google-maps-react';
import MapContainer from "./MapContainer";
import Iframe from 'react-iframe'


const Spaces = () => (
  
  <Container fluid className="main-content-container m-0">
    <Row>
      <MapContainer/>
    </Row>
  </Container>


);

export default Spaces;
