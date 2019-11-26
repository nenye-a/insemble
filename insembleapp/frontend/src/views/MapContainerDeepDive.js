import React from "react"; 
import {
  Row, 
  Container, 
  Col
} from "shards-react"; 
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Circle,
  InfoWindow
} from "react-google-maps";
import { Redirect } from 'react-router-dom'

import HeatMapLayer from 'react-google-maps/lib/components/visualization/HeatmapLayer';
import SearchBox from 'react-google-maps/lib/components/places/SearchBox'
const _ = require("lodash");

class MapWithAMarkerClusterer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {redirect: false, isMarkerShown: false, markerPosition: null, markerAddress: null}
    this.handleMarkerClustererClick = this.handleMarkerClustererClick.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
  }

  componentWillMount() {
    const refs = {}

    this.setState({
      //bounds: new google.maps.LatLngBounds(new google.maps.LatLng(33.7036519, -118.6681759), new google.maps.LatLng(34.3373061, -118.1552891)),
      bounds: null,
      center: {
        lat: this.props.markers.lat, lng: this.props.markers.lng
      },
      markers: [],
      onMapMounted: ref => {
        refs.map = ref;
        if (refs.map){
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
          })
        }
        console.log('state set')
      },
      onBoundsChanged: () => {
        this.setState({
          bounds: refs.map.getBounds(),
          center: refs.map.getCenter(),
        })
      },
      onSearchBoxMounted: ref => {
        refs.searchBox = ref;
      },
      onPlacesChanged: () => {
        const places = refs.searchBox.getPlaces();
        const bounds = new google.maps.LatLngBounds();

        places.forEach(place => {
          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport)
          } else {
            bounds.extend(place.geometry.location)
          }
        });
        const nextMarkers = places.map(place => ({
          position: place.geometry.location,
        }));
        const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

        this.setState({
          center: nextCenter,
          markers: nextMarkers,
        });
        refs.map.fitBounds(bounds);
      },
      onMapClick: (e) => {
        console.log(e.latLng.lat().toString().split(".").join(""))
        console.log("stringed")
        console.log('api/location/lat='+e.latLng.lat().toString().split(".").join("")+'&lng='+e.latLng.lng().toString().split(".").join(""))
        fetch('api/location/lat='+e.latLng.lat().toString().split(".").join("")+'&lng='+e.latLng.lng().toString().split(".").join("")+'&radius=1')
        .then(res => res.json())
        .then(data => {
          console.log(data)
          console.log("request made")
          this.setState({markerPosition: e.latLng, isMarkerShown:true, marker: data})});

        console.log(this.state.marker)
        console.log("pressed")
      },


    })
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

  handleSearchClick (marker) {
    console.log(marker)
    console.log('Go to the marker post page')
    // fetch('api/location/lat=34.0522795&lng=-118.3089333')
    // .then(res => res.json())
    // .then(data => {
    //   console.log(data)
    //   console.log("going to marker page actually")
    //   this.setState({redirect: true, marker: data})});

    // });
    // this.setState({redirect: true, marker: marker})
  }
  
  renderRedirect = () => {
    if (this.state.redirect) {
      
      return <Redirect to = {{pathname: "/location-deep-dive-demo", match: this.state.marker}} />
    }
  }

  render(){
    const lat = this.props.markers.lat
    const lng = this.props.markers.lng

    return (
      <GoogleMap
        ref={this.state.onMapMounted}
        defaultZoom={13}
        defaultCenter={{ lat: lat, lng: lng }}
        defaultOptions={{
          minZoom: 7, 
        }}
        onClick={this.state.onMapClick}
        onBoundsChanged={this.state.onBoundsChanged}
        
      >
        {this.renderRedirect()}
        {/* icons from https://sites.google.com/site/gmapsdevelopment/ */}
        <Marker position={{ lat: lat, lng: lng }} icon={{url: "http://maps.google.com/mapfiles/kml/paddle/purple-circle.png"}}> 
        </Marker> 
        {/* Should map this to condense */}
        <Circle
          defaultCenter={{
            lat: lat,
            lng: lng
          }}
          radius={1609.34}
          options={{
            strokeColor: '#634FA2',
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: '#634FA2',
            fillOpacity: 0.1,
          }}
        />
        <Circle
          defaultCenter={{
            lat: lat,
            lng: lng
          }}
          radius={4828.03}
          options={{
            strokeColor: '#634FA2',
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: '#634FA2',
            fillOpacity: 0.1,
          }}
        />
        <Circle
          defaultCenter={{
            lat: lat,
            lng: lng
          }}
          radius={8046.72}
          options={{
            strokeColor: '#634FA2',
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: '#634FA2',
            fillOpacity: 0.1,
          }}
        />

        <SearchBox
          ref={this.state.onSearchBoxMounted}
          bounds={this.state.bounds}
          controlPosition={google.maps.ControlPosition.TOP}
          onPlacesChanged={this.state.onPlacesChanged}
        >
          <input
            type="text"
            placeholder="Search for nearby retailers"
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `300px`,
              height: `32px`,
              marginTop: `17px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
            }}
          />
        </SearchBox>
        {this.state.markers.map((marker, index) =>
          <Marker onClick={()=>this.handleSearchClick(marker)} key={index} position={marker.position} />
        )}
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
    containerElement={<div style={{ height: "400px", width: "100%" }} />}
    mapElement={<div style={{ height: `100%` }} />}
    markers={markers}
  />

)