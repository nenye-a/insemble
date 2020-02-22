import React from 'react';
import { GoogleMap, withGoogleMap, Marker, Circle } from 'react-google-maps';

import { View } from '../../core-ui';
import { LEGEND } from './NearbyMapLegend';
import { useGoogleMaps } from '../../utils';
import { THEME_COLOR } from '../../constants/colors';
import mapPin from '../../components/icons/map-pin.svg';
import greenIcon from '../../assets/images/green-circle.svg';

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

function Map(props: Props) {
  let { data } = props;
  let circleOptions = {
    strokeColor: THEME_COLOR,
    strokeOpacity: 0.8,
    strokeWeight: 1,
    fillOpacity: 0.1,
  };

  let centerLat = data.reduce((a, b) => a + (b.lat || 0), 0) / data.length;
  let centerLng = data.reduce((a, b) => a + (b.lng || 0), 0) / data.length;

  return (
    <GoogleMap defaultZoom={13} center={{ lat: centerLat, lng: centerLng }}>
      {data.map(({ lat, lng, placeType }, index) => {
        return (
          <Marker
            key={index}
            position={{ lat, lng }}
            icon={LEGEND[placeType[0] as keyof typeof LEGEND] || greenIcon}
          />
        );
      })}
      <Marker
        position={{
          lat: centerLat,
          lng: centerLng,
        }}
        icon={mapPin}
      />
      {/* 1 miles & 3 miles radius */}
      <Circle radius={1600} options={circleOptions} />
      <Circle radius={4800} options={circleOptions} />
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
