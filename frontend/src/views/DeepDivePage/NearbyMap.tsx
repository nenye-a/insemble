import React, { useContext } from 'react';
import { GoogleMap, withGoogleMap, Marker, Circle } from 'react-google-maps';

import { View } from '../../core-ui';
import { LEGEND } from './NearbyMapLegend';
import { useGoogleMaps } from '../../utils';
import { THEME_COLOR } from '../../constants/colors';
import mapPin from '../../components/icons/map-pin.svg';
import greenIcon from '../../assets/images/green-circle.svg';
import { DeepDiveContext } from './DeepDiveModal';

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
  let context = useContext(DeepDiveContext);
  if (context?.selectedLocation) {
    let { lat, lng } = context.selectedLocation;
    let circleOptions = {
      strokeColor: THEME_COLOR,
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillOpacity: 0.1,
    };

    return (
      <GoogleMap defaultZoom={13} center={{ lat: Number(lat), lng: Number(lng) }}>
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
            lat: Number(lat),
            lng: Number(lng),
          }}
          icon={mapPin}
        />
        {/* 1 miles & 3 miles radius */}
        <Circle radius={1600} options={circleOptions} />
        <Circle radius={4800} options={circleOptions} />
      </GoogleMap>
    );
  }
  return null;
}

const MapWithMap = withGoogleMap(Map);

export default (props: Props) => {
  let { isLoading } = useGoogleMaps();
  return isLoading ? null : (
    <MapWithMap containerElement={<View flex />} mapElement={<View flex />} {...props} />
  );
};
