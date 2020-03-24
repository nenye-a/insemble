import React, {
  useEffect,
  useRef,
  useCallback,
  ComponentProps,
  RefObject,
  CSSProperties,
} from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

import { GOOGLE_PLACE } from '../graphql/queries/server/place';
import { TextInput } from '../core-ui';
import { useGoogleMaps } from '../utils';

type PlaceResult = google.maps.places.PlaceResult;
type InputProps = ComponentProps<'input'>;

export type SelectedLocation = {
  id: string;
  name: string;
  address: string;
  lat: string;
  lng: string;
};

type Props = Omit<InputProps, 'onSubmit' | 'ref'> & {
  label?: string;
  placeholder?: string;
  ref?: RefObject<HTMLInputElement> | null;
  onPlaceSelected?: (place: SelectedLocation) => void;
  containerStyle?: CSSProperties;
};

export default function LocationInput(props: Props) {
  let { isLoading } = useGoogleMaps();
  let { placeholder, onPlaceSelected, label, containerStyle, ...otherProps } = props;
  let inputRef = useRef<HTMLInputElement | null>(null);
  let selectedPlace = useRef<PlaceResult | null>(null);

  let [getPlace] = useLazyQuery(GOOGLE_PLACE, {
    variables: {
      address: inputRef.current?.value,
    },
    onCompleted: (data) => {
      let { id, formattedAddress, name, location } = data;
      let { lat, lng } = location;
      onPlaceSelected &&
        onPlaceSelected({
          id: id || '',
          name,
          address: formattedAddress || '',
          lat,
          lng,
        });
    },
  });

  let submitHandler = useCallback(() => {
    if (selectedPlace.current) {
      let { formatted_address: formattedAddress, geometry, name, id } = selectedPlace.current;
      if (geometry) {
        let { lat, lng } = geometry.location;

        onPlaceSelected &&
          onPlaceSelected({
            id: id || '',
            name,
            address: formattedAddress || '',
            lat: lat().toString() || '',
            lng: lng().toString() || '',
          });
      } else {
        getPlace();
      }
    }
  }, [onPlaceSelected, getPlace]);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      let autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
      let listener = autocomplete.addListener('place_changed', () => {
        let place = autocomplete.getPlace();
        selectedPlace.current = place;
        submitHandler();
      });
      return () => {
        listener.remove();
      };
    }
  }, [isLoading, submitHandler]);

  if (isLoading) {
    return null;
  }

  return (
    <TextInput
      ref={inputRef}
      placeholder={placeholder}
      onSubmit={submitHandler}
      label={label}
      containerStyle={containerStyle}
      {...otherProps}
    />
  );
}
