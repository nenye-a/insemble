import React, { useRef, useState, useEffect } from 'react';
import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps';
import HeatMapLayer from 'react-google-DELETED_BASE64_STRING';
import { useParams } from 'react-router-dom';

import { GET_LOCATION_PREVIEW } from '../graphql/queries/server/preview';
import { View, Alert, LoadingIndicator } from '../core-ui';
import LocationDetail from '../components/location-detail/LocationDetail';
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox';
import MapPin from '../components/icons/map-pin.svg';
import {
  TenantMatches_tenantMatches_matchingLocations as TenantMatchesMatchingLocations,
  TenantMatches_tenantMatches_matchingProperties as TenantMatchesMatchingProperties,
} from '../generated/TenantMatches';
import { useLazyQuery } from '@apollo/react-hooks';
import { LocationPreview, LocationPreviewVariables } from '../generated/LocationPreview';
import { GOOGLE_MAPS_STYLE } from '../constants/googleMaps';
import MapTour from './MapPage/MapTour';

type LatLng = google.maps.LatLng;
type LatLngLiteral = google.maps.LatLngLiteral;

type Props = {
  markers?: Array<LatLngLiteral>;
  onMarkerClick?: (markerPosition: LatLng, address: string, targetNeighborhood: string) => void;
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
  let [getLocation, { data, loading, error }] = useLazyQuery<
    LocationPreview,
    LocationPreviewVariables
  >(GET_LOCATION_PREVIEW);
  let heatmapData =
    matchingLocations && matchingLocations
      ? matchingLocations.map(({ lat, lng, match }) => ({
          location: new google.maps.LatLng(lat, lng),
          weight: match,
        }))
      : [];

  let [markerPosition, setMarkerPosition] = useState<LatLng | null>(null);
  let [showGuide, setShowGuide] = useState(true);
  let [infoBoxHeight, setInfoBoxHeight] = useState<number>(0);
  let [domReady, setDomReady] = useState(false);

  let infoRef = useRef<Element | undefined>();
  let mapRef = useRef<GoogleMap | null>(null);

  // TODO: fix this. tried useCallback with all deps, still not working
  let onPreviewClick = () => {
    markerPosition &&
      onMarkerClick &&
      onMarkerClick(
        markerPosition,
        data?.locationPreview.targetAddress || '',
        data?.locationPreview.targetNeighborhood || ''
      );
  };

  let onMapClick = async (latLng: LatLng) => {
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
    setDomReady(false);
  };

  useEffect(() => {
    let handlePreviewClickListener = (e: Event) => {
      e.stopPropagation();
      onPreviewClick();
    };

    if (infoRef.current && domReady) {
      infoRef.current.addEventListener('click', handlePreviewClickListener);
      return () => {
        if (infoRef.current) {
          infoRef.current.removeEventListener('click', handlePreviewClickListener);
        }
      };
    }
  });

  return (
    <div>
      <MapTour
        showGuide={showGuide}
        onTourFinishedOrSkipped={(show) => {
          setShowGuide(show);
        }}
      />
      <LoadingIndicator visible={loading} />
      <Alert visible={!!error} text={error?.message || ''} />
      <GoogleMap
        ref={mapRef}
        defaultZoom={defaultZoom}
        defaultCenter={defaultCenter}
        defaultOptions={{
          maxZoom: 17,
          minZoom: 7,
          mapTypeControl: false,
          styles: GOOGLE_MAPS_STYLE,
        }}
        onClick={(event) => onMapClick(event.latLng)}
      >
        {markerPosition && !loading && data && (
          <Marker position={markerPosition} onClick={onPreviewClick} icon={MapPin}>
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
                maxWidth: 400,
              }}
              onDomReady={() => {
                let infoBox = document.querySelector('.infoBox');
                if (infoBox) {
                  setDomReady(true);
                  infoRef.current = infoBox;
                  let infoBoxHeight = infoBox.getClientRects()[0].height;
                  setInfoBoxHeight(infoBoxHeight);
                }
              }}
              onCloseClick={() => {
                setMarkerPosition(null);
              }}
            >
              <LocationDetail
                visible
                title={data?.locationPreview.targetAddress}
                subTitle={data?.locationPreview.targetNeighborhood}
                income={data?.locationPreview.medianIncome.toString()}
                population={data?.locationPreview.daytimePop3Mile.toString()}
                age={data?.locationPreview.medianAge}
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
      </GoogleMap>
    </div>
  );
}

const MapWithMap = withGoogleMap(MapContainer);

export default (props: Props) => {
  return <MapWithMap containerElement={<View flex />} mapElement={<View flex />} {...props} />;
};
