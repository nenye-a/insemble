import React from "react";
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const mapStyles = {
  width: '100%',
  height: '100%',
};

class MapContainer extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
        <Map
          google={this.props.google}
          zoom={8}
          style={mapStyles}
          initialCenter={{ lat: 47.444, lng: -122.176}}
        />
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCJjsXi3DbmlB1soI9kHzANRqVkiWj3P2U'
})(MapContainer);
