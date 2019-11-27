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

  static PropTypes = {
    hasLocation: PropTypes.bool.isRequired,
    location: PropTypes.object,

    mapIsLoading: PropTypes.bool.isRequired,
    mapLoaded: PropTypes.bool.isRequired,
    heatMap: PropTypes.object
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

    // wait for map to complete loading or fail, load once complete. May want to wait and load async
    
    // if(this.props.mapLoaded) {
    //   this.setState({ heats: this.props.heatMap })
    // } else {
    //   console.log("Failed to load heat map!")
    // }
    
    // fetch('/api/lmatches/', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //      address: this.props.location.match.address,
    //   }),
    // }).then(res => res.json())
    // .then(data => {
    //   this.setState({ heats: data });
    //   console.log(this.state.heats)
    //   console.log("printed heats")

    // });

    // const response = await fetch('/api/lmatches/', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //      address: 'data',
    //   }),
    // })
    // console.log(await response.json())
    // console.log("printed responses")

  }

  render() {
    // console.log(this.state.markers)
    // console.log("loaded")
    return (
      <Container fluid className="main-content-container m-0">
        <Row>
          <MapComponent {...this.state}/>
        </Row>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  // heat map props
  mapIsLoading: state.space.mapIsLoading,
  mapLoaded: state.space.mapLoaded,
  heatMap: state.space.heatmap,

  // location props
  hasLocation: state.space.hasLocation,
  location: state.space.location
})


export default withRouter(connect(mapStateToProps)(Spaces));
