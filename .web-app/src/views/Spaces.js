import React from "react";
import { Container, Row, Col, ButtonGroup, Button } from "shards-react";
import MapContainer from "./MapContainer";
import Iframe from 'react-iframe'


const Spaces = () => (
  
  <Iframe url=    "https://www.google.com/maps/d/u/0/embed?mid=1qiZ6gGmV-pByhj4HCgnRUxQtvH8ONHcD"
      width="100%"
      height="750px"
      id="myId"
      className="mx-auto"
      display="initial"
      position="relative"/>
);

export default Spaces;
