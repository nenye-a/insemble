import React, { useEffect, useRef, useCallback } from 'react';
import TextInput from './TextInput';

type PlaceResult = google.maps.places.PlaceResult;

type Props = {
  placeholder: string;
  buttonText: string;
  onSubmit: (place: PlaceResult) => void;
};

function LocationsInput(props: Props) {
  let { placeholder, buttonText, onSubmit } = props;
  let inputRef = useRef<HTMLInputElement | null>(null);
  let selectedPlace = useRef<PlaceResult | null>(null);
  let submitHandler = useCallback(() => {
    if (selectedPlace.current) {
      onSubmit(selectedPlace.current);
    }
  }, [onSubmit]);
  useEffect(() => {
    if (inputRef.current) {
      let autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
      let listener = autocomplete.addListener('place_changed', () => {
        let place = autocomplete.getPlace();
        selectedPlace.current = place;
      });
      return () => {
        listener.remove();
      };
    }
  }, []);
  return (
    <TextInput
      ref={inputRef}
      placeholder={placeholder}
      buttonText={buttonText}
      onSubmit={submitHandler}
    />
  );
}

export default LocationsInput;
