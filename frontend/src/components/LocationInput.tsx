import React, {
  useEffect,
  useRef,
  useCallback,
  ComponentProps,
  RefObject,
  CSSProperties,
} from 'react';

import { TextInput, View } from '../core-ui';
import { useGoogleMaps } from '../utils';
import { LocationInput as LocationInputType } from '../generated/globalTypes';

type PlaceResult = google.maps.places.PlaceResult;
type InputProps = ComponentProps<'input'>;

type Props = Omit<InputProps, 'onSubmit' | 'ref'> & {
  label?: string;
  placeholder?: string;
  ref?: RefObject<HTMLInputElement> | null;
  onPlaceSelected?: (place: LocationInputType) => void;
  containerStyle?: CSSProperties;
};

export default function LocationInput(props: Props) {
  let { isLoading } = useGoogleMaps();
  let { placeholder, onPlaceSelected, label, containerStyle, ...otherProps } = props;
  let inputRef = useRef<HTMLInputElement | null>(null);
  let selectedPlace = useRef<PlaceResult | null>(null);
  let submitHandler = useCallback(() => {
    if (selectedPlace.current) {
      onPlaceSelected &&
        onPlaceSelected({
          address: selectedPlace.current.formatted_address || '',
          lat: selectedPlace.current.geometry?.location.lat().toString() || '',
          lng: selectedPlace.current.geometry?.location.lng().toString() || '',
        });
    }
  }, [onPlaceSelected]);

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

  return (
    <View>
      {!isLoading && (
        <TextInput
          ref={inputRef}
          placeholder={placeholder}
          onSubmit={submitHandler}
          label={label}
          style={containerStyle}
          {...otherProps}
        />
      )}
    </View>
  );
}
