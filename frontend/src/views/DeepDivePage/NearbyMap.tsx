import React, { useContext } from 'react';
import { GoogleMap, withGoogleMap, Marker, Circle } from 'react-google-maps';

import { View } from '../../core-ui';
import { LEGEND } from './NearbyMapLegend';
import { useGoogleMaps } from '../../utils';
import { THEME_COLOR } from '../../constants/colors';
import mapPin from '../../assets/images/map-pin.svg';
import greenIcon from '../../assets/images/green-circle.svg';
import { DeepDiveContext } from './DeepDiveModal';
import { LocationDetails_locationDetails_result_nearby as NearbyPlace } from '../../generated/LocationDetails';
import greyCircleIcon from '../../assets/images/grey-circle.svg';

type Props = {
  data: Array<NearbyPlace>;
  selected?: string;
  hasSelected?: boolean;
  onClickMarker?: (name: string) => void;
};

function Map(props: Props) {
  let { data, selected, hasSelected, onClickMarker } = props;
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
        {data.map(({ lat, lng, placeType, name }, index) => {
          let markerIcon = LEGEND[placeType[0] as keyof typeof LEGEND] || greenIcon;
          let isSelected = name === selected;
          let selectedIcon = isSelected ? markerIcon : greyCircleIcon;
          return (
            <Marker
              onClick={() => onClickMarker && onClickMarker(name)}
              key={index}
              position={{ lat, lng }}
              icon={hasSelected ? selectedIcon : markerIcon}
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
