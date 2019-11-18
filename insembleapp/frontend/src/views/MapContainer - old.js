import React from "react";
import { Map, GoogleApiWrapper, Marker, HeatMap } from 'google-maps-react';

const mapStyles = {
  height: '95%',
  width: '100%'
};

const data2 = [{lat: 47.49855629475769, lng: -122.14184416996333, weight: 7},
{lat: 47.359423, lng: -122.021071, weight: 7},
{lat: 47.2052192687988, lng: -121.988426208496, weight: 7},
{lat: 47.6307081, lng: -122.1434325, weight: 1},
{lat: 47.3084488, lng: -122.2140121, weight: 1},
{lat: 47.5524695, lng: -122.0425407, weight: 1}]; 

class MapContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stores: [{lat: 47.49855629475769, lng: -122.14184416996333},
              {latitude: 47.359423, longitude: -122.021071},
              {latitude: 47.2052192687988, longitude: -121.988426208496},
              {latitude: 47.6307081, longitude: -122.1434325},
              {latitude: 47.3084488, longitude: -122.2140121},
              {latitude: 47.5524695, longitude: -122.0425407}]
    }
  }

  displayMarkers = () => {
    return this.state.stores.map((store, index) => {
      return <Marker key={index} id={index} position={{
       lat: store.latitude,
       lng: store.longitude
     }}
     onClick={() => console.log("You clicked me!")} />
    })
  }

  render() {
    return (
        <Map
          google={this.props.google}
          zoom={10}
          style={mapStyles}
          initialCenter={{ lat: 34.0522, lng: -118.2437}}
        >
          <HeatMap 
            positions={data2}
            radius={250}
            opacity={0.8}
          >
          </HeatMap>
          </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'DELETED_GOOGLE_API_KEY',
  libraries: ['visualization']
})(MapContainer);
