import React, {
  useEffect,
  useRef,
  useCallback,
  ComponentProps,
  RefObject,
  ChangeEvent,
} from 'react';
import styled from 'styled-components';

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
