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
          initialCenter={{ lat: 34.0522, lng: -118.2437}}
        />
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'DELETED_GOOGLE_API_KEY'
})(MapContainer);
