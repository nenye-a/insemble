import React, { useRef, useState, useEffect } from 'react';
import Joyride, { STATUS, Step } from 'react-joyride';
import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps';
import { useHistory } from 'react-router-dom';
import { useAlert } from 'react-alert';
import HeatMapLayer from 'react-google-maps/lib/components/visualization/HeatmapLayer';
import SearchBox from 'react-google-maps/lib/components/places/SearchBox';

import { View } from '../core-ui';
import { useSelector } from '../redux/helpers';
import useGoogleMaps from '../utils/useGoogleMaps';
import urlSafeLatLng from '../utils/urlSafeLatLng';
import LocationDetail from '../components/location-detail/LocationDetail';
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox';
import MapPin from '../components/icons/map-pin.svg';

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

function MapContainer() {
  let alert = useAlert();
  let history = useHistory();
  let heatMap = useSelector((state) => state.space.heatMap) || [];

  let [marker, setMarker] = useState<MarkerData | null>(null);
  let [markers, setMarkers] = useState<Array<LatLngLiteral>>([]);
  let [markerPosition, setMarkerPosition] = useState<LatLng | null>(null);
  let [bounds, setBounds] = useState<LatLngBounds | null>(null);
  let [showGuide, setShowGuide] = useState(true);
  let [infoBoxHeight, setInfoBoxHeight] = useState<number>(0);

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
          <Marker position={markerPosition} onClick={() => onMarkerClick()} icon={MapPin}>
            {marker && (
              <InfoBox
                defaultPosition={markerPosition}
                defaultVisible={true}
                options={{
                  disableAutoPan: false,
                  pixelOffset: new google.maps.Size(-150, -45 - infoBoxHeight),
                  infoBoxClearance: new google.maps.Size(1, 1),
                  isHidden: false,
                  pane: 'floatPane',
                  enableEventPropagation: true,
                  closeBoxMargin: '10px 0 2px 2px',
                }}
                onDomReady={() => {
                  let infoBox = document.querySelector('.infoBox');
                  if (infoBox) {
                    let infoBoxHeight = infoBox.getClientRects()[0].height;
                    setInfoBoxHeight(infoBoxHeight);
                  }
                }}
                onCloseClick={() => {
                  setMarker(null);
                }}
              >
                {/* TODO Change Dummy Data */}
                <LocationDetail
                  visible
                  title={marker.address}
                  subTitle={'Address Details'}
                  income={marker.income}
                  population={marker.pop}
                  age={50}
                  ethnicity={['White', 'Hispanic']}
                  gender={'52% Female'}
                  onSeeMore={onMarkerClick}
                />
              </InfoBox>
            )}
          </Marker>
        )}
        {showGuide && <div className="marker-example heat-map-example empty-container" />}
        <HeatMapLayer data={data} options={{ data, radius: 20, opacity: 1 }} />

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

export default () => {
  let { isLoading } = useGoogleMaps();
  return isLoading ? null : (
    <MapWithMap
      containerElement={<View flex />}
      mapElement={<View flex />}
      // {...props}
    />
  );
};
