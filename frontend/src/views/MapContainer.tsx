import React, { useRef, useState, useEffect } from 'react';
import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps';
import HeatMapLayer from 'react-google-DELETED_BASE64_STRING';
import { useParams, useHistory } from 'react-router-dom';
import { useLazyQuery, useApolloClient } from '@apollo/react-hooks';

import { GET_LOCATION_PREVIEW } from '../graphql/queries/server/preview';
import { View, LoadingIndicator } from '../core-ui';
import LocationDetail from '../components/location-detail/LocationDetail';
import availablePropertyPin from '../assets/images/map-pin.svg';
import mapPin from '../assets/images/small-map-pin.svg';
import currentLocationPin from '../assets/images/current-location-marker.svg';
import {
  TenantMatches_tenantMatches_matchingLocations as TenantMatchesMatchingLocations,
  TenantMatches_tenantMatches_matchingProperties as TenantMatchesMatchingProperties,
  TenantMatches_tenantMatches_location as TenantMatchesLocation,
} from '../generated/TenantMatches';
import { LocationPreview, LocationPreviewVariables } from '../generated/LocationPreview';
import { GOOGLE_MAPS_STYLE } from '../constants/googleMaps';
import MapTour from './MapPage/MapTour';
import { getGroupedMatchingPropertiesByKey } from '../utils';
import { SelectedLocation } from '../components/LocationInput';
import { GET_BRANDID } from '../graphql/queries/client/userState';

type LatLng = google.maps.LatLng;
type LatLngLiteral = google.maps.LatLngLiteral;

type Props = {
  markers?: Array<LatLngLiteral>;
  onMarkerClick?: (
    markerPosition: LatLng,
    address: string,
    targetNeighborhood: string,
    propertyId?: string
  ) => void;
  matchingLocations?: Array<TenantMatchesMatchingLocations> | null;
  matchingProperties?: Array<TenantMatchesMatchingProperties>;
  onMapError?: (message: string) => void;
  currentLocation?: TenantMatchesLocation | null;
  addressSearchLocation?: SelectedLocation | null;
};

const defaultCenter = {
  lat: 34.0522342,
  lng: -118.2436849,
};

const defaultZoom = 10;

function MapContainer({
  onMarkerClick,
  matchingLocations,
  matchingProperties,
  onMapError,
  currentLocation,
  addressSearchLocation,
}: Props) {
  let history = useHistory();
  let { brandId = '' } = useParams();
  let client = useApolloClient();
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
  let [selectedPropertyLatLng, setSelectedPropertyLatLng] = useState<LatLng | null>(null);
  let [selectedPropertyId, setSelectedPropertyId] = useState('');
  let [showGuide, setShowGuide] = useState(!!history.location.state?.newBrand);

  let mapRef = useRef<GoogleMap | null>(null);
  let groupedMatchingProperties = getGroupedMatchingPropertiesByKey(
    matchingProperties || [],
    'propertyId'
  );
  let onPreviewClick = () => {
    if (markerPosition) {
      onMarkerClick &&
        onMarkerClick(
          markerPosition,
          data?.locationPreview.targetAddress || '',
          data?.locationPreview.targetNeighborhood || ''
        );
    } else if (selectedPropertyLatLng) {
      onMarkerClick &&
        onMarkerClick(
          selectedPropertyLatLng,
          data?.locationPreview.targetAddress || '',
          data?.locationPreview.targetNeighborhood || '',
          selectedPropertyId
        );
    }
  };

  let onMapClick = async (latLng: LatLng) => {
    let { lat, lng } = latLng;
    onMapError && onMapError('');
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
    // so only 1 InfoBox will be opened
    if (selectedPropertyLatLng) {
      setSelectedPropertyLatLng(null);
    }
    setMarkerPosition(latLng);
  };

  let onPropertyMarkerClick = (latLng: LatLng, propertyId: string) => {
    let { lat, lng } = latLng;
    onMapError && onMapError('');
    getLocation({
      variables: {
        brandId,
        selectedLocation: {
          address: '',
          lat: lat().toString(),
          lng: lng().toString(),
        },
        selectedPropertyId: propertyId,
      },
    });
    // so only 1 InfoBox will be opened
    if (markerPosition) {
      setMarkerPosition(null);
    }
    setSelectedPropertyLatLng(latLng);
    setSelectedPropertyId(propertyId);
  };

  useEffect(() => {
    client.writeQuery({
      query: GET_BRANDID,
      data: {
        userState: {
          __typename: 'UserState',
          brandId,
        },
      },
    });
  });

  useEffect(() => {
    if (error && onMapError) {
      onMapError(error.message);
    }
  }, [error, onMapError]);

  return (
    <div>
      <MapTour
        showGuide={showGuide}
        onTourFinishedOrSkipped={(show) => {
          setShowGuide(show);
        }}
      />
      <LoadingIndicator visible={loading} />
      <GoogleMap
        ref={mapRef}
        defaultOptions={{
          maxZoom: 17,
          minZoom: 7,
          mapTypeControl: false,
          styles: GOOGLE_MAPS_STYLE,
          fullscreenControl: false,
        }}
        onClick={(event) => onMapClick(event.latLng)}
        zoom={addressSearchLocation ? 17 : defaultZoom}
        center={
          addressSearchLocation
            ? { lat: Number(addressSearchLocation.lat), lng: Number(addressSearchLocation.lng) }
            : defaultCenter
        }
      >
        {groupedMatchingProperties &&
          groupedMatchingProperties.length > 0 &&
          groupedMatchingProperties.map((property, index) => {
            let latLng = new google.maps.LatLng(Number(property.lat), Number(property.lng));

            let previewVisible = selectedPropertyLatLng
              ? selectedPropertyLatLng.lat() === Number(property.lat) &&
                selectedPropertyLatLng.lng() === Number(property.lng)
              : false;
            return (
              <Marker
                key={index}
                position={latLng}
                onClick={() => onPropertyMarkerClick(latLng, property.propertyId)}
                icon={availablePropertyPin}
              >
                {selectedPropertyLatLng && !loading && data && (
                  <LocationDetail
                    visible={previewVisible}
                    title={data?.locationPreview.targetAddress || ''}
                    subTitle={data?.locationPreview.targetNeighborhood || ''}
                    income={data?.locationPreview.medianIncome.toString() || ''}
                    population={data?.locationPreview.daytimePop3Mile.toString() || ''}
                    age={data?.locationPreview.medianAge || 0}
                    markerPosition={selectedPropertyLatLng || ''}
                    onPreviewPress={onPreviewClick}
                    onClose={() => setSelectedPropertyLatLng(null)}
                  />
                )}
              </Marker>
            );
          })}
        {currentLocation && (
          <Marker
            position={
              new google.maps.LatLng(Number(currentLocation.lat), Number(currentLocation.lng))
            }
            icon={currentLocationPin}
          />
        )}
        {markerPosition && !loading && data && (
          <Marker position={markerPosition} onClick={onPreviewClick} icon={mapPin}>
            <LocationDetail
              visible
              title={data?.locationPreview.targetAddress}
              subTitle={data?.locationPreview.targetNeighborhood || ''}
              income={data?.locationPreview.medianIncome.toString()}
              population={data?.locationPreview.daytimePop3Mile.toString()}
              age={data?.locationPreview.medianAge}
              markerPosition={markerPosition}
              onPreviewPress={onPreviewClick}
              onClose={() => setMarkerPosition(null)}
            />
          </Marker>
        )}
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
