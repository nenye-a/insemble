// TODO: Remove this next line.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState, useEffect } from 'react';
import Joyride, { STATUS, Step } from 'react-joyride';
import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps';
import { useAlert } from 'react-alert';
import HeatMapLayer from 'react-google-maps/lib/components/visualization/HeatmapLayer';
import SearchBox from 'react-google-maps/lib/components/places/SearchBox';
import { useParams } from 'react-router-dom';

import { GET_LOCATION_PREVIEW } from '../graphql/queries/server/preview';
import { View } from '../core-ui';
import LocationDetail from '../components/location-detail/LocationDetail';
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox';
import MapPin from '../components/icons/map-pin.svg';
import {
  TenantMatches_tenantMatches_matchingLocations as TenantMatchesMatchingLocations,
  TenantMatches_tenantMatches_matchingProperties as TenantMatchesMatchingProperties,
} from '../generated/TenantMatches';
import { useLazyQuery } from '@apollo/react-hooks';

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
  markers?: Array<LatLngLiteral>;
  onMarkerClick?: () => void;
  matchingLocations?: Array<TenantMatchesMatchingLocations> | null;
  matchingProperties?: Array<TenantMatchesMatchingProperties> | null;
};

const defaultCenter = {
  lat: 34.0522342,
  lng: -118.2436849,
};
const defaultZoom = 10;

function MapContainer({ onMarkerClick, matchingLocations }: Props) {
  let { brandId = '' } = useParams();
  let [getLocation, { data, loading }] = useLazyQuery(GET_LOCATION_PREVIEW);
  let heatmapData =
    matchingLocations && matchingLocations
      ? matchingLocations.map(({ lat, lng, match }) => ({
          location: new google.maps.LatLng(lat, lng),
          weight: match,
        }))
      : [];

  let alert = useAlert();

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
    let { lat, lng } = latLng;
    getLocation({
      variables: {
        brandId,
        selectedLocation: {
          address: '',
          lat: lat().toString(),
          lng: lng().toString(),
        },
      },
    });
    setMarkerPosition(latLng);
    setMarker(data);
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
          styles: [
            {
              elementType: 'geometry',
              stylers: [
                {
                  color: '#f5f5f5',
                },
              ],
            },
            {
              elementType: 'labels',
              stylers: [
                {
                  visibility: 'off',
                },
              ],
            },
            {
              elementType: 'labels.icon',
              stylers: [
                {
                  visibility: 'off',
                },
              ],
            },
            {
              elementType: 'labels.text.fill',
              stylers: [
                {
                  color: '#616161',
                },
              ],
            },
            {
              elementType: 'labels.text.stroke',
              stylers: [
                {
                  color: '#f5f5f5',
                },
              ],
            },
            {
              featureType: 'administrative',
              elementType: 'labels',
              stylers: [
                {
                  visibility: 'on',
                },
              ],
            },
            {
              featureType: 'administrative.land_parcel',
              elementType: 'labels.text.fill',
              stylers: [
                {
                  color: '#bdbdbd',
                },
              ],
            },
            {
              featureType: 'administrative.neighborhood',
              stylers: [
                {
                  visibility: 'off',
                },
              ],
            },
            {
              featureType: 'landscape.natural',
              stylers: [
                {
                  color: '#ccf6cb',
                },
              ],
            },
            {
              featureType: 'poi',
              stylers: [
                {
                  visibility: 'on',
                },
              ],
            },
            {
              featureType: 'poi',
              elementType: 'geometry',
              stylers: [
                {
                  color: '#eeeeee',
                },
              ],
            },
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [
                {
                  visibility: 'on',
                },
              ],
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [
                {
                  color: '#757575',
                },
              ],
            },
            {
              featureType: 'poi.business',
              stylers: [
                {
                  visibility: 'simplified',
                },
              ],
            },
            {
              featureType: 'poi.business',
              elementType: 'labels.text',
              stylers: [
                {
                  color: '#a9a9a9',
                },
              ],
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [
                {
                  color: '#c4f9cd',
                },
              ],
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text',
              stylers: [
                {
                  visibility: 'off',
                },
              ],
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [
                {
                  color: '#9e9e9e',
                },
              ],
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [
                {
                  color: '#ffffff',
                },
              ],
            },
            {
              featureType: 'road',
              elementType: 'labels',
              stylers: [
                {
                  visibility: 'on',
                },
                {
                  weight: 1.5,
                },
              ],
            },
            {
              featureType: 'road.arterial',
              elementType: 'labels.text.fill',
              stylers: [
                {
                  color: '#757575',
                },
              ],
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [
                {
                  color: '#000000',
                },
                {
                  lightness: 80,
                },
                {
                  weight: 1,
                },
              ],
            },
            {
              featureType: 'road.highway',
              elementType: 'labels',
              stylers: [
                {
                  visibility: 'simplified',
                },
              ],
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [
                {
                  color: '#616161',
                },
              ],
            },
            {
              featureType: 'road.local',
              elementType: 'labels.text.fill',
              stylers: [
                {
                  color: '#9e9e9e',
                },
              ],
            },
            {
              featureType: 'transit.line',
              elementType: 'geometry',
              stylers: [
                {
                  color: '#f0dee1',
                },
                {
                  visibility: 'off',
                },
                {
                  weight: 1,
                },
              ],
            },
            {
              featureType: 'transit.line',
              elementType: 'labels',
              stylers: [
                {
                  visibility: 'on',
                },
              ],
            },
            {
              featureType: 'transit.station',
              elementType: 'geometry',
              stylers: [
                {
                  color: '#eeeeee',
                },
              ],
            },
            {
              featureType: 'transit.station.airport',
              stylers: [
                {
                  visibility: 'on',
                },
              ],
            },
            {
              featureType: 'transit.station.bus',
              stylers: [
                {
                  visibility: 'on',
                },
              ],
            },
            {
              featureType: 'transit.station.bus',
              elementType: 'labels.icon',
              stylers: [
                {
                  visibility: 'on',
                },
              ],
            },
            {
              featureType: 'transit.station.rail',
              stylers: [
                {
                  visibility: 'on',
                },
              ],
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [
                {
                  color: '#c9d5f1',
                },
              ],
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [
                {
                  color: '#9e9e9e',
                },
              ],
            },
          ],
        }}
        onClick={(event) => onMapClick(event.latLng)}
        onBoundsChanged={onBoundsChanged}
      >
        {markerPosition && !loading && (
          <Marker position={markerPosition} onClick={onMarkerClick} icon={MapPin}>
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
                title={data.locationPreview.targetAddress}
                subTitle={data.locationPreview.targetNeighborhood}
                income={data.locationPreview.medianIncome}
                population={data.locationPreview.daytimePop3Mile}
                age={data.locationPreview.medianAge}
                onSeeMore={onMarkerClick}
              />
            </InfoBox>
          </Marker>
        )}
        {showGuide && <div className="marker-example heat-map-example empty-container" />}
        {heatmapData && (
          <HeatMapLayer
            data={heatmapData}
            options={{ data: heatmapData, radius: 0.006, opacity: 0.5, dissipating: false }}
          />
        )}

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
  return <MapWithMap containerElement={<View flex />} mapElement={<View flex />} {...props} />;
};
