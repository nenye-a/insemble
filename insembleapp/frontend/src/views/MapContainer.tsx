import React, { useRef, useState, useEffect } from 'react';
import { Row, Container, Col } from 'shards-react';
import Joyride, { STATUS, Step } from 'react-joyride';
import { GoogleMap, Marker, InfoWindow, withGoogleMap } from 'react-google-maps';
import { useHistory } from 'react-router-dom';
import { useAlert } from 'react-alert';

import HeatMapLayer from 'react-google-DELETED_BASE64_STRING';
import SearchBox from 'react-google-maps/lib/components/places/SearchBox';

import { useSelector } from '../redux/helpers';
import useGoogleMaps from '../utils/useGoogleMaps';
import urlSafeLatLng from '../utils/urlSafeLatLng';

type LatLngBounds = google.maps.LatLngBounds;
type LatLng = google.maps.LatLng;
type LatLngLiteral = google.maps.LatLngLiteral;
type MarkerData = {
  address: string;
  income: string;
  pop: string;
  lat: number;
  lng: number;
  census: {
    asian: number;
    black: number;
    hispanic: number;
    indian: number;
    multi: number;
    white: number;
  };
  nearby: { [key: string]: number };
  radius: number;
};
type Props = {
  markers: Array<LatLngLiteral>;
  heats: Array<any>;
};

const defaultCenter = {
  lat: 34.0522342,
  lng: -118.2436849,
};
const defaultZoom = 10;

function MapContainer(props: Props) {
  let alert = useAlert();
  let history = useHistory();
  let heatMap = useSelector((state) => state.space.heatMap) || [];

  let [marker, setMarker] = useState<MarkerData | null>(null);
  let [markers, setMarkers] = useState<Array<LatLngLiteral>>([]);
  let [markerPosition, setMarkerPosition] = useState<LatLng | null>(null);
  let [bounds, setBounds] = useState<LatLngBounds | null>(null);
  let [showGuide, setShowGuide] = useState(true);

  let mapRef = useRef<GoogleMap | null>(null);
  let searchBoxRef = useRef<SearchBox | null>(null);

  useEffect(() => {
    let map = mapRef.current;
    if (map) {
      setBounds(map.getBounds());
    }
  }, []);

  let onBoundsChanged = () => {
    let map = mapRef.current;
    if (map) {
      setBounds(map.getBounds());
    }
  };

  let onPlacesChanged = () => {
    let searchBox = searchBoxRef.current;
    let map = mapRef.current;
    let places = searchBox ? searchBox.getPlaces() : [];
    let bounds = new google.maps.LatLngBounds();
    let nextMarkers: Array<LatLngLiteral> = [];
    for (let place of places) {
      if (place.geometry) {
        // bounds.union(place.geometry.viewport);
        bounds.extend(place.geometry.location);
        nextMarkers.push(place.geometry.location.toJSON());
      }
    }
    // setCenter(bounds.getCenter().toJSON());
    setMarkers(nextMarkers);
    if (map) {
      map.fitBounds(bounds);
    }
  };

  let onMapClick = (latLng: LatLng) => {
    let { lat, lng } = urlSafeLatLng(latLng.toJSON());
    fetch(`api/location/lat=${lat}&lng=${lng}&radius=1`)
      .then((res) => res.json())
      .then((data) => {
        sessionStorage.setItem('temp_location', JSON.stringify(data));
        setMarkerPosition(latLng);
        setMarker(data);
      })
      .catch(() => {
        alert.show('Marker is too far from known establishment');
      });
  };

  let onMarkerClick = () => {
    history.push('/location-deep-dive');
  };

  let handleSearchClick = (marker: LatLngLiteral) => {
    // fetch('api/location/lat=34.0522795&lng=-118.3089333')
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log(data);
    //     console.log('going to marker page actually');
    //     setRedirect(true);
    //     setMarker(data);
    //   });
  };

  let data = heatMap.map(({ lat, lng, map_rating: mapRating }) => ({
    location: new google.maps.LatLng(lat, lng),
    weight: mapRating,
  }));

  let steps: Array<Step> = [
    {
      target: '.heat-map-example',
      content: (
        <div className="pt-2">
          <img
            className="mb-2 full-width-image"
            src="https://d3v63q50apccnu.cloudfront.net/instructional+photos/heat-map-tour.png"
            alt=""
          />
          <p className="text-center m-0">
            Insemble generates a heatmap of recommended locations based on your search.
          </p>
        </div>
      ),
      placement: 'center',
    },
    {
      target: '.search-box',
      content: (
        <p className="text-center m-0">
          Search existing locations, brands, or brand types of interest.
        </p>
      ),
      placement: 'top',
    },
    {
      target: '.marker-example',
      content: (
        <div className="pt-2">
          <img
            className="mb-2 full-width-image"
            src="https://d3v63q50apccnu.cloudfront.net/instructional+photos/marker-tour.png"
            alt=""
          />
          <p className="text-center m-0">
            Click to see important information about interesting locations. Click again to dive
            deeper.
          </p>
        </div>
      ),
      placement: 'center',
    },
  ];

  return (
    <div>
      <Joyride
        steps={steps}
        scrollToFirstStep={true}
        continuous={true}
        run={showGuide}
        showSkipButton={true}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: '#634FA2', // TODO: get from color constants
          },
          tooltipContent: {
            paddingBottom: 0,
          },
        }}
        callback={({ status }) => {
          if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
            setShowGuide(false);
          }
        }}
        locale={{ last: 'Done' }}
        spotlightClicks={false}
      />
      <GoogleMap
        ref={mapRef}
        defaultZoom={defaultZoom}
        defaultCenter={defaultCenter}
        defaultOptions={{
          maxZoom: 15,
          minZoom: 7,
          mapTypeControl: false,
        }}
        onClick={(event) => onMapClick(event.latLng)}
        onBoundsChanged={onBoundsChanged}
      >
        {markerPosition && (
          <Marker
            position={markerPosition}
            onClick={() => onMarkerClick()}
            icon={{ url: 'http://maps.google.com/mapfiles/kml/paddle/purple-circle.png' }}
          >
            {marker && (
              <InfoWindow
                onCloseClick={() => {
                  setMarker(null);
                }}
              >
                {/* TODO: Make smaller and solve for middle-of-nowhere case. also make it come back when pressed again */}
                <Container>
                  <Row>
                    <h6>{marker.address}</h6>
                  </Row>
                  <Row className="py-1">
                    <Col
                      className="d-flex flex-column justify-content-center align-items-center"
                      style={{ fontWeight: 'bold' }}
                    >
                      Median Income
                    </Col>
                    <Col className="d-flex flex-column justify-content-center align-items-center">
                      ${marker.income}
                    </Col>
                  </Row>
                  <Row className="py-1">
                    <Col
                      className="d-flex flex-column justify-content-center align-items-center"
                      style={{ fontWeight: 'bold' }}
                    >
                      Half-mile population
                    </Col>
                    <Col className="d-flex flex-column justify-content-center align-items-center">
                      {marker.pop}
                    </Col>
                  </Row>
                </Container>
              </InfoWindow>
            )}
          </Marker>
        )}
        {showGuide && <div className="marker-example heat-map-example empty-container" />}
        <HeatMapLayer data={data} options={{ data, radius: 20, opacity: 1 }} />
        <SearchBox
          ref={searchBoxRef}
          bounds={bounds || undefined}
          controlPosition={window.google ? google.maps.ControlPosition.TOP_CENTER : undefined}
          onPlacesChanged={onPlacesChanged}
        >
          <input
            className="search-box"
            type="text"
            placeholder="Search an address or retailer"
            style={{
              boxSizing: 'border-box',
              border: '1px solid transparent',
              width: '300px',
              height: '32px',
              marginTop: '17px',
              padding: '0 12px',
              borderRadius: '3px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
              fontSize: '14px',
              outline: 'none',
              textOverflow: 'ellipses',
            }}
          />
        </SearchBox>
        {markers.map((markerPosition, index) => (
          <Marker
            onClick={() => handleSearchClick(markerPosition)}
            key={index}
            position={markerPosition}
          />
        ))}
      </GoogleMap>
    </div>
  );
}

const MapWithMap = withGoogleMap(MapContainer);

export default (props: Props) => {
  let { isLoading } = useGoogleMaps();
  return isLoading ? null : (
    <MapWithMap
      containerElement={<div style={{ height: '85vh', width: '100%' }} />}
      mapElement={<div style={{ height: '100%' }} />}
      {...props}
    />
  );
};
