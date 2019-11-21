import React from "react"; 
const { compose, withProps, withHandlers } = require("recompose");
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import PropTypes from 'prop-types'; 
import { NavLink } from "react-router-dom";
import { Redirect } from 'react-router-dom'

const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");
import HeatMapLayer from 'react-google-maps/lib/components/visualization/HeatmapLayer';
import SearchBox from 'react-google-maps/lib/components/places/SearchBox'

class MapWithAMarkerClusterer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {redirect: false}
    this.handleMarkerClustererClick = this.handleMarkerClustererClick.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
  }

  componentWillMount() {
    this.setState({ marker: []})
  }

  componentDidMount() {
    this.setState({ marker: [] });
  }


  handleMarkerClustererClick (markerClusterer) {
    const clickedMarkers = markerClusterer.getMarkers()
    console.log(`Current clicked markers length: ${clickedMarkers.length}`)
    console.log(clickedMarkers)
  }

  handleMarkerClick (marker) {
      console.log('Go to the marker post page')
      this.setState({redirect: true, marker: marker})
    }
  
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to = {{pathname: "/location-deep-dive-demo", match: this.state.marker}} />
    }
  }

  render(){
    const markers = this.props.markers.markers
    const heats = this.props.markers.heats
    console.log("these are the props")
    // console.log(positions)
    // const points = [
    //   {lat: 34.0622, lng: -118.2437, weight: 2},
    //   {lat: 34.0522, lng: -118.2437, weight: 3},
    //   {lat: 34.0422, lng: -118.2437, weight: 1},
    //   {lat: 34.0222, lng: -118.2437, weight: 2},
    //   {lat: 34.0122, lng: -118.2437, weight: 3},
    //   {lat: 34.0722, lng: -118.2437, weight: 1},
    //   ]
    // const data = points.map(({lat, lng, weight}) => (
    //   {location: new google.maps.LatLng(lat, lng),
    //   weight: weight}))
    const data = heats.map(({lat, lng, map_rating}) => (
        {location: new google.maps.LatLng(lat, lng),
        weight: map_rating}))
    
    //console.log("loaded 2")
    // console.log(Object.values(markers))
    // console.log(markers)

    return (
      <GoogleMap
        defaultZoom={10}
        defaultCenter={{ lat: 34.0522, lng: -118.2437 }}
      >
        {this.renderRedirect()}
        {/* Just markers */}
        {Object.values(markers).map(marker => (
            <Marker 
              onClick={()=>this.handleMarkerClick(marker)}
              key={marker._id}
              // icon= {require("../images/logos/marker.png")}
              position={{ lat: marker.lat, lng: marker.lng }}
            />
          ))}
        {/* <MarkerClusterer
          onClick={this.handleMarkerClustererClick}
          averageCenter
          enableRetinaIcons
          gridSize={60}
        >
          {Object.values(markers).map(marker => (
            <Marker 
              onClick={()=>this.handleMarkerClick(marker)}
              key={marker._id}
              icon= {require("../images/logos/marker.png")}
              position={{ lat: marker.lat, lng: marker.lng }}
            />
          ))}
        </MarkerClusterer> */}
        <HeatMapLayer
          data= {data}
          options={{radius:20}}
          opacity={1}
          />
      </GoogleMap>
    );
  }
}

const MapComponent = withScriptjs(withGoogleMap(MapWithAMarkerClusterer))

export default (markers) => (
  <MapComponent
    // googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCJjsXi3DbmlB1soI9kHzANRqVkiWj3P2U&v=3.exp&libraries=places,visualization"

    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCJjsXi3DbmlB1soI9kHzANRqVkiWj3P2U&v=3.exp&libraries=geometry,drawing,places,visualization"
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: "700px", width: "100%" }} />}
    mapElement={<div style={{ height: `100%` }} />}
    markers={markers}
  />

)