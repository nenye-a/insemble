import React from "react";
import { Container, Row, Col, ButtonGroup, Button } from "shards-react";
import MapContainer from "./MapContainer";

const Spaces = () => (
  <Container fluid className="main-content-container">
    <MapContainer className="mx-auto align-items-center"/>

  </Container>
);

export default Spaces;
