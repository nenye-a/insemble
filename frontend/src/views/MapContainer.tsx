import React, { useRef, useState, useEffect } from 'react';
import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps';
import HeatMapLayer from 'react-google-maps/lib/components/visualization/HeatmapLayer';
import { useParams, useHistory } from 'react-router-dom';
import { useApolloClient, useLazyQuery } from '@apollo/react-hooks';

import { GET_LOCATION_PREVIEW } from '../graphql/queries/server/preview';
import { View, Alert, LoadingIndicator } from '../core-ui';
import LocationDetail from '../components/location-detail/LocationDetail';
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox';
import MapPin from '../components/icons/map-pin.svg';
import availablePropertyPin from '../assets/images/available-property-pin.svg';
import {
  TenantMatches_tenantMatches_matchingLocations as TenantMatchesMatchingLocations,
  TenantMatches_tenantMatches_matchingProperties as TenantMatchesMatchingProperties,
} from '../generated/TenantMatches';
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

function MapContainer({ onMarkerClick, matchingLocations, matchingProperties }: Props) {
  let apolloClient = useApolloClient();
  let history = useHistory();
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
  let [selectedPropertyLatLng, setSelectedPropertyLatLng] = useState<LatLng | null>(null);
  let [showGuide, setShowGuide] = useState(!!history.location.state?.newBrand);

  let mapRef = useRef<GoogleMap | null>(null);

  /**
   * right now the be returns error 500 when the user hit outside the map bound
   * TODO: change this to a better error handler
   */
  let outsideBoundError = error?.message.includes('Request failed with status code 500');

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
    // so only 1 InfoBox will be opened
    if (selectedPropertyLatLng) {
      setSelectedPropertyLatLng(null);
    }
    setMarkerPosition(latLng);
  };

  let onPropertyMarkerClick = (latLng: LatLng, propertyId: string) => {
    let { lat, lng } = latLng;

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
  };

  useEffect(() => {
    if (outsideBoundError) {
      apolloClient.writeData({
        data: {
          errorState: {
            __typename: 'ErrorState',
            locationPreview: true,
          },
        },
      });
    }
  }, [error, apolloClient, outsideBoundError]);
  console.log(selectedPropertyLatLng, '<<<<');
  return (
    <div>
      <MapTour
        showGuide={showGuide}
        onTourFinishedOrSkipped={(show) => {
          setShowGuide(show);
        }}
      />
      <LoadingIndicator visible={loading} />
      <Alert visible={!!error && !outsideBoundError} text={error?.message || ''} />
      <GoogleMap
        ref={mapRef}
        defaultZoom={defaultZoom}
        defaultCenter={defaultCenter}
        defaultOptions={{
          maxZoom: 17,
          minZoom: 7,
          mapTypeControl: false,
          styles: GOOGLE_MAPS_STYLE,
          fullscreenControl: false,
        }}
        onClick={(event) => onMapClick(event.latLng)}
      >
        {matchingProperties &&
          matchingProperties.length > 0 &&
          matchingProperties.map((property, index) => {
            let latLng = new google.maps.LatLng(Number(property.lat), Number(property.lng));

            let previewVisible = selectedPropertyLatLng
              ? selectedPropertyLatLng.lat() === Number(property.lat) &&
                selectedPropertyLatLng.lng() === Number(property.lng)
              : false;
            return (
              <Marker
                key={index}
                position={latLng}
                // TODO: change to propertyId
                onClick={() => onPropertyMarkerClick(latLng, property.spaceId)}
                icon={availablePropertyPin}
              >
                {selectedPropertyLatLng && (
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
        {markerPosition && !loading && data && (
          <Marker position={markerPosition} onClick={onPreviewClick} icon={MapPin}>
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
