/* global google */
/* eslint-disable import/first */
import React from 'react';
import { Row, Text, Container, Col } from 'shards-react';
const { compose, withProps, withHandlers } = require('recompose');
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';

import { connect } from 'react-redux';
import { withAlert } from 'react-alert';

const { MarkerClusterer } = require('react-google-DELETED_BASE64_STRING');
import HeatMapLayer from 'react-google-DELETED_BASE64_STRING';
import SearchBox from 'react-google-maps/lib/components/places/SearchBox';
const _ = require('lodash');

class MapWithAMarkerClusterer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
      isMarkerShown: false,
      markerPosition: null,
      markerAddress: null,
    };
    this.handleMarkerClustererClick = this.handleMarkerClustererClick.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.alert = this.props.alert;
  }

  static propTypes = {
    mapIsLoading: PropTypes.bool.isRequired,
    mapLoaded: PropTypes.bool.isRequired,
    heatMap: PropTypes.object,
  };

  componentWillMount() {
    const refs = {};

    this.setState({
      //bounds: new google.maps.LatLngBounds(new google.maps.LatLng(33.7036519, -118.6681759), new google.maps.LatLng(34.3373061, -118.1552891)),
      bounds: null,
      center: {
        lat: 34.0522342,
        lng: -118.2436849,
      },
      markers: [],
      onMapMounted: (ref) => {
        refs.map = ref;
        if (!this.state.redirect && refs.map) {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
          });
        }
      },
      onBoundsChanged: () => {
        this.setState({
          bounds: refs.map.getBounds(),
          center: refs.map.getCenter(),
        });
      },
      onSearchBoxMounted: (ref) => {
        refs.searchBox = ref;
      },
      onPlacesChanged: () => {
        const places = refs.searchBox.getPlaces();
        const bounds = new google.maps.LatLngBounds();

        places.forEach((place) => {
          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        const nextMarkers = places.map((place) => ({
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
        fetch(
          'api/location/lat=' +
            e.latLng
              .lat()
              .toString()
              .split('.')
              .join('') +
            '&lng=' +
            e.latLng
              .lng()
              .toString()
              .split('.')
              .join('') +
            '&radius=1'
        )
          .then((res) => res.json())
          .then((data) => {
            sessionStorage.setItem('temp_location', JSON.stringify(data));
            this.setState({
              markerPosition: e.latLng,
              isMarkerShown: true,
              marker: data,
            });
          })
          .catch((err) => {
            this.alert.show('Marker is too far from known establishment');
          });
      },
    });
  }

  // componentDidMount() {
  //   this.setState({ marker: [] });
  // }

  handleMarkerClustererClick(markerClusterer) {
    const clickedMarkers = markerClusterer.getMarkers();
  }

  handleMarkerClick(marker) {
    this.setState({ redirect: true, marker: marker });
  }

  handleSearchClick(marker) {
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
      return <Redirect push to={{ pathname: '/location-deep-dive', match: this.state.marker }} />;
    }
  };

  render() {
    const i_markers = this.props.markers.markers;
    var heats = [];
    if (this.props.mapLoaded) {
      heats = this.props.heatMap;
    }

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
    const data = heats.map(({ lat, lng, map_rating }) => ({
      location: new google.maps.LatLng(lat, lng),
      weight: map_rating,
    }));

    //console.log("loaded 2")
    // console.log(Object.values(markers))
    // console.log(markers)

    return (
      <GoogleMap
        ref={this.state.onMapMounted}
        defaultZoom={10}
        defaultCenter={{ lat: 34.0522, lng: -118.2437 }}
        defaultOptions={{
          maxZoom: 15,
          minZoom: 7,
          mapTypeControl: false
        }}
        onClick={this.state.onMapClick}
        onBoundsChanged={this.state.onBoundsChanged}
      >
        {this.renderRedirect()}
        {this.state.isMarkerShown && (
          <Marker
            position={this.state.markerPosition}
            onClick={() => this.handleMarkerClick(this.state.marker)}
            icon={{ url: 'http://maps.google.com/mapfiles/kml/paddle/purple-circle.png' }}
          >
            <InfoWindow>
              {/* TODO: Make smaller and solve for middle-of-nowhere case. also make it come back when pressed again */}
              <Container>
                <Row>
                  <h6>{this.state.marker.address}</h6>
                </Row>
                <Row className="py-1">
                  <Col
                    className="d-flex flex-column justify-content-center align-items-center"
                    style={{ fontWeight: 'bold' }}
                  >
                    Median Income
                  </Col>
                  <Col className="d-flex flex-column justify-content-center align-items-center">
                    ${this.state.marker.income}
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col
                    className="d-flex flex-column justify-content-center align-items-center"
                    style={{ fontWeight: 'bold' }}
                  >
                    Half-mile popuplation
                  </Col>
                  <Col className="d-flex flex-column justify-content-center align-items-center">
                    {this.state.marker.pop}
                  </Col>
                </Row>
              </Container>
            </InfoWindow>
          </Marker>
        )}
        <HeatMapLayer data={data} options={{ radius: 20 }} opacity={1} />
        <SearchBox
          ref={this.state.onSearchBoxMounted}
          bounds={this.state.bounds}
          controlPosition={google.maps.ControlPosition.TOP}
          onPlacesChanged={this.state.onPlacesChanged}
        >
          <input
            type="text"
            placeholder="Search an address or retailer"
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
        {this.state.markers.map((marker, index) => (
          <Marker
            onClick={() => this.handleSearchClick(marker)}
            key={index}
            position={marker.position}
          />
        ))}
      </GoogleMap>
    );
  }
}

const mapStateToProps = (state) => ({
  // heat map props
  mapIsLoading: state.space.mapIsLoading,
  mapLoaded: state.space.mapLoaded,
  heatMap: state.space.heatMap,
});

// const MapComponent = withScriptjs(withGoogleMap(MapWithAMarkerClusterer))
const TempComponent = withScriptjs(withGoogleMap(MapWithAMarkerClusterer));
const MapComponent = withAlert()(withRouter(connect(mapStateToProps)(TempComponent)));

export default (markers) => (
  <MapComponent
    // googleMapURL="https://maps.googleapis.com/maps/api/js?key=DELETED_GOOGLE_API_KEY&v=3.exp&libraries=places,visualization"

    googleMapURL="https://maps.googleapis.com/maps/api/js?key=DELETED_GOOGLE_API_KEY&v=3.exp&libraries=geometry,drawing,places,visualization"
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: '85vh', width: '100%' }} />}
    mapElement={<div style={{ height: `100%` }} />}
    markers={markers}
  />
);
