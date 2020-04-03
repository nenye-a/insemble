import React, {
  useEffect,
  useRef,
  useCallback,
  ComponentProps,
  RefObject,
  ChangeEvent,
} from 'react';
import styled from 'styled-components';
import { useLazyQuery } from '@apollo/react-hooks';

import { GOOGLE_PLACE } from '../../graphql/queries/server/place';
import { Place } from '../../generated/Place';
import TextInput from '../../core-ui/ContainedTextInput';
import { Label } from '../../core-ui';
import { TEXT_INPUT_BORDER_COLOR } from '../../constants/colors';

type PlaceResult = google.maps.places.PlaceResult;
type InputProps = ComponentProps<'input'>;

type Props = Omit<InputProps, 'onSubmit' | 'ref'> & {
  placeholder: string;
  buttonText?: string;
  onSubmit?: (place: PlaceResult) => void;
  ref?: RefObject<HTMLInputElement> | null;
  onChange?: (e: ChangeEvent<HTMLDivElement>) => void;
  label?: string;
};

function LocationsInput(props: Props) {
  let { placeholder, buttonText, onSubmit, label, ...otherProps } = props;
  let inputRef = useRef<HTMLInputElement | null>(null);
  let selectedPlace = useRef<PlaceResult | null>(null);

  let [getPlace] = useLazyQuery<Place>(GOOGLE_PLACE, {
    variables: {
      address: inputRef.current?.value,
    },
    onCompleted: (data) => {
      let newData = (data as unknown) as PlaceResult;
      onSubmit && onSubmit(newData);
    },
  });

  let submitHandler = useCallback(() => {
    if (selectedPlace.current) {
      if (selectedPlace.current.geometry) {
        onSubmit && onSubmit(selectedPlace.current);
      } else {
        getPlace();
      }
    }
  }, [onSubmit, getPlace]);

  let LABounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(33.7036519, -118.6681759),
    new google.maps.LatLng(34.3373061, -118.1552891)
  );

  let opts = {
    bounds: LABounds,
    strictBounds: true,
  };

  useEffect(() => {
    if (inputRef.current) {
      let autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, opts);
      let listener = autocomplete.addListener('place_changed', () => {
        let place = autocomplete.getPlace();
        selectedPlace.current = place;
      });
      return () => {
        listener.remove();
      };
    }
  }, [opts]);
  return (
    <>
      {label && <Label style={{ paddingBottom: 8 }} text={label} />}
      <StyledTextInput
        ref={inputRef}
        placeholder={placeholder}
        buttonText={buttonText}
        onSubmit={submitHandler}
        {...otherProps}
      />
    </>
  );
}

const StyledTextInput = styled(TextInput)`
  border: solid 1px ${TEXT_INPUT_BORDER_COLOR};
`;

export default LocationsInput;
