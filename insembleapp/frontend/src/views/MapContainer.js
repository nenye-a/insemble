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


// const MapWithAMarkerClusterer = compose(
//   withProps({
//     googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCJjsXi3DbmlB1soI9kHzANRqVkiWj3P2U&v=3.exp&libraries=geometry,drawing,places",
//     loadingElement: <div style={{ height: `100%` }} />,
//     containerElement: <div style={{ height: "95vh", width: "100%" }} />,
//     mapElement: <div style={{ height: `100%` }} />,
//   }),
//   withHandlers({
//     onMarkerClustererClick: () => (markerClusterer) => {
//       const clickedMarkers = markerClusterer.getMarkers()
//       console.log(`Current clicked markers length: ${clickedMarkers.length}`)
//       console.log(clickedMarkers)
//     },
//     onMarkerClick: () => (marker) => {
//       // link to post view page
//       //
//       //
//       //
//       //
//       //
//       console.log('Go to the marker post page')
//       return to = "/location-deep-dive" 
//       window.location = '/location-deep-dive'
//     }
//   }),
//   withScriptjs,
//   withGoogleMap
// )(props =>
//   <GoogleMap
//     defaultZoom={3}
//     defaultCenter={{ lat: 25.0391667, lng: 121.525 }}
//   >
//     <MarkerClusterer
//       onClick={props.onMarkerClustererClick}
//       averageCenter
//       enableRetinaIcons
//       gridSize={60}
//     >
//       {props.markers.map(marker => (
//         <Marker 
//           onClick={props.onMarkerClick}
//           {...marker}
//           key={marker.photo_id}
//           position={{ lat: marker.latitude, lng: marker.longitude }}
//         />
//       ))}
//     </MarkerClusterer>
//   </GoogleMap>
// );
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
      // link to post view page
      //
      //
      //
      //
      //
      console.log('Go to the marker post page')
      this.setState({redirect: true, marker: marker})
      
      // return to = "/location-deep-dive" 
      // window.location = '/location-deep-dive'
    }
  
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to = {{pathname: "/location-deep-dive-demo", match: this.state.marker}} />
    }
  }

  render(){
    const markers = this.props.markers
    const positions = Object.values(markers).map(marker => { return { "lat": marker.lat, "lng": marker.lng}});
    console.log(positions)
    const points = [
      {lat: 34.0622, lng: -118.2437, weight: 2},
      {lat: 34.0522, lng: -118.2437, weight: 3},
      {lat: 34.0422, lng: -118.2437, weight: 1},
      {lat: 34.0222, lng: -118.2437, weight: 2},
      {lat: 34.0122, lng: -118.2437, weight: 3},
      {lat: 34.0722, lng: -118.2437, weight: 1},
      ]
    const data = points.map(({lat, lng, weight}) => (
      {location: new google.maps.LatLng(lat, lng),
      weight: weight}))
    
    //console.log("loaded 2")
    // console.log(Object.values(markers))
    // console.log(markers)

    return (
      <GoogleMap
        defaultZoom={10}
        defaultCenter={{ lat: 34.0522, lng: -118.2437 }}
        // yesIWantToUseGoogleMapApiInternals
        // onGoogleApiLoaded={({map, maps}) => {
        //   console.log(points[0]);
        //   console.log("logged points")
        //   const heatmap = new maps.visualization.HeatmapLayer({
        //     data: points.map(point => (
        //       {location: new maps.LatLng(point['location'][1], point['location'][0]),
        //       weight: point['weight']}))
        //   });
        //   heatmap.setMap(map);
        // }}
      >
        {this.renderRedirect()}
        <MarkerClusterer
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
        </MarkerClusterer>
        <HeatMapLayer
          // data={positions}
          // options={{radius:20}}
          data= {data}
          opacity={1}
          radius={20}
          />
      </GoogleMap>
    );
  }
}

const MapComponent = withScriptjs(withGoogleMap(MapWithAMarkerClusterer))

// MapWithAMarkerClusterer.defaultProps = {
//   googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCJjsXi3DbmlB1soI9kHzANRqVkiWj3P2U&v=3.exp&libraries=geometry,drawing,places",
//   loadingElement: <div style={{ height: `100%` }} />,
//   containerElement: <div style={{ height: "95vh", width: "100%" }} />,
//   mapElement: <div style={{ height: `100%` }} />,
// }

// MapWithAMarkerClusterer.propTypes = {
//   googleMapURL: PropTypes.string,
//   loadingElement: PropTypes.element,
//   containerElement: PropTypes.element,
//   mapElement: PropTypes.element
// }

export default (markers) => (
  <MapComponent
    // googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCJjsXi3DbmlB1soI9kHzANRqVkiWj3P2U&v=3.exp&libraries=places,visualization"

    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCJjsXi3DbmlB1soI9kHzANRqVkiWj3P2U&v=3.exp&libraries=geometry,drawing,places,visualization"
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: "95vh", width: "100%" }} />}
    mapElement={<div style={{ height: `100%` }} />}
    markers={markers}
  />

)