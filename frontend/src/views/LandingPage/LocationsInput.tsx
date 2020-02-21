import React, {
  useEffect,
  useRef,
  useCallback,
  ComponentProps,
  RefObject,
  ChangeEvent,
} from 'react';
import TextInput from '../../core-ui/ContainedTextInput';

type PlaceResult = google.maps.places.PlaceResult;
type InputProps = ComponentProps<'input'>;

type Props = Omit<InputProps, 'onSubmit' | 'ref'> & {
  placeholder: string;
  buttonText?: string;
  onSubmit?: (place: PlaceResult) => void;
  ref?: RefObject<HTMLInputElement> | null;
  onChange?: (e: ChangeEvent<HTMLDivElement>) => void;
};

function LocationsInput(props: Props) {
  let { placeholder, buttonText, onSubmit, ...otherProps } = props;
  let inputRef = useRef<HTMLInputElement | null>(null);
  let selectedPlace = useRef<PlaceResult | null>(null);
  let submitHandler = useCallback(() => {
    if (selectedPlace.current) {
      onSubmit && onSubmit(selectedPlace.current);
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
      {...otherProps}
    />
  );
}

export default LocationsInput;
