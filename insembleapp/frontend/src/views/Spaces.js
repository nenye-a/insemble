import React from "react";
import { Container, Row, Col, ButtonGroup, Button } from "shards-react";
import { Map, HeatMap, GoogleApiWrapper, Marker } from 'google-maps-react';
import MapContainer from "./MapContainer";
import MapWithAMarkerClusterer from "./MapContainer"
import MapComponent from "./MapContainer"
import Iframe from 'react-iframe'
const fetch = require("isomorphic-fetch");

class Spaces extends React.PureComponent {
  componentWillMount() {
    this.setState({ markers: [] })
  }

  componentDidMount() {
    const url = [
      // Length issue
      `https://gist.githubusercontent.com`,
      `/farrrr/dfda7dd7fccfec5474d3`,
      `/raw/758852bbc1979f6c4522ab4e92d1c92cba8fb0dc/data.json`
    ].join("")

    // fetch(url)
    //   .then(res => res.json())
    //   .then(data => {
    //     this.setState({ markers: data.photos });
    //   });

      fetch('/api/pair')
      .then(res => res.json())
      .then(data => {
        this.setState({ markers: data });

      });

    // const response = await fetch('/api/lmatches', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //      address: 'data',
    //   }),
    // })
    // console.log(await response.json())

  }

  render() {
    console.log(this.state.markers)
    // console.log("loaded")
    return (
      <Container fluid className="main-content-container m-0">
        <Row>
          <MapComponent {...this.state.markers}/>
        </Row>
      </Container>
    )
  }
}

export default Spaces;
