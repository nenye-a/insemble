import React from "react";
import { Container, Row, Col, ButtonGroup, Button } from "shards-react";
import { Map, HeatMap, GoogleApiWrapper, Marker } from 'google-maps-react';
import MapContainer from "./MapContainer";
import MapWithAMarkerClusterer from "./MapContainer"
import MapComponent from "./MapContainer"
import Iframe from 'react-iframe'

import { withRouter } from "react-router";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const fetch = require("isomorphic-fetch");

class Spaces extends React.PureComponent {
  constructor(props) {
    super(props);

  }

  componentWillMount() {
    this.setState({ markers: [], heats: []})
  }

  componentDidMount() {
    const url = [
      // Length issue
      `https://gist.githubusercontent.com`,
      `/farrrr/dfda7dd7fccfec5474d3`,
      `/raw/DELETED_LONG_HEX_STRING/data.json`
    ].join("")
  }

  render() {
    return (
      <Container fluid className="main-content-container m-0">
        <Row>
          <MapComponent {...this.state}/>
        </Row>
      </Container>
    )
  }
}

export default withRouter(Spaces);
