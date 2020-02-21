import React from 'react';
import { GoogleMap, withGoogleMap, Marker, Circle } from 'react-google-maps';

import { View } from '../../core-ui';
import { LEGEND } from './NearbyMapLegend';
import { useGoogleMaps } from '../../utils';
import { THEME_COLOR } from '../../constants/colors';
import mapPin from '../../components/icons/map-pin.svg';

type PlaceType = 'Restaurant' | 'Hospital' | 'Retail' | 'Metro' | 'Apartment';

export type NearbyPlace = {
  photo?: string;
  name: string;
  category: string;
  rating: number | null;
  numberRating: number;
  distance: number;
  placeType: Array<string>;
  lat: number;
  lng: number;
  similar: boolean;
};

type Props = {
  data: Array<NearbyPlace>;
};

const DEFAULT_CENTER = { lat: 34.0522, lng: -118.2437 }; // This is LA's lat & lng. will change this after connecting to the endpoint

function Map(props: Props) {
  let { data } = props;
  let circleOptions = {
    strokeColor: THEME_COLOR,
    strokeOpacity: 0.8,
    strokeWeight: 1,
    fillOpacity: 0.1,
  };

  return (
    <GoogleMap defaultZoom={13} defaultCenter={DEFAULT_CENTER}>
      {data.map(({ lat, lng, placeType }, index) => {
        return (
          <Marker
            key={index}
            position={{ lat, lng }}
            icon={LEGEND[placeType[0] as keyof typeof LEGEND]}
          />
        );
      })}
      <Marker position={DEFAULT_CENTER} icon={mapPin} />
      {/* 1 miles & 3 miles radius */}
      <Circle defaultCenter={DEFAULT_CENTER} radius={1600} options={circleOptions} />
      <Circle defaultCenter={DEFAULT_CENTER} radius={4800} options={circleOptions} />
    </GoogleMap>
  );
}

const MapWithMap = withGoogleMap(Map);

export default (props: Props) => {
  let { isLoading } = useGoogleMaps();
  return isLoading ? null : (
    <MapWithMap containerElement={<View flex />} mapElement={<View flex />} {...props} />
  );
};
