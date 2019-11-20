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
    this.setState({ markers: [], heats: []})
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

    // 'api/tmatches/address="1101 W 23rd St, Los Angeles, CA 90007f"

    fetch('/api/pair')
    .then(res => res.json())
    .then(data => {
      this.setState({ markers: data });

    });

    fetch('/api/lmatches/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         address: '1101 W 23rd St, Los Angeles, CA 90007',
      }),
    }).then(res => res.json())
    .then(data => {
      this.setState({ heats: data });
      console.log(this.state.heats)
      console.log("printed responses")

    });

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

export default Spaces;
