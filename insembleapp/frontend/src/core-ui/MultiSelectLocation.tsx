import React, { ComponentProps, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import PillButton from './PillButton';
import View from './View';
import TextInput from './ContainedTextInput';
import { TEXT_INPUT_BORDER_COLOR } from '../constants/colors';

type InputProps = ComponentProps<'input'>;

type Props = InputProps & {};
type PlaceResult = google.maps.places.PlaceResult;

export default function MultiSelectLocation(props: Props) {
  let [selectedValues, setSelectedValues] = useState<Array<string>>([]);
  let [inputValue, setInputValue] = useState<string>('');
  let inputRef = useRef<HTMLInputElement | null>(null);
  let selectedPlace = useRef<PlaceResult | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      let autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
      let listener = autocomplete.addListener('place_changed', () => {
        let place = autocomplete.getPlace();
        selectedPlace.current = place;
        setSelectedValues((selectedValues) =>
          selectedPlace.current && selectedPlace.current.formatted_address
            ? [...selectedValues, selectedPlace.current.formatted_address]
            : selectedValues
        );
        setInputValue('');
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
      return () => {
        listener.remove();
      };
    }
  }, []);

  let onUnselect = () => {
    let newSelectedOptions = selectedValues.slice(0, selectedValues.length - 1);
    setSelectedValues(newSelectedOptions);
  };

  let placeholder = selectedValues.length > 0 ? '' : 'Enter a location';

  return (
    <Container>
      {selectedValues ? selectedValues.map((value) => <Selected primary>{value}</Selected>) : null}
      <TextSearch
        ref={inputRef}
        placeholder={placeholder}
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyUp={(event) => {
          if (event.which === 8 && !event.metaKey && !event.ctrlKey && !event.shiftKey) {
            onUnselect && onUnselect();
          }
        }}
      />
    </Container>
  );
}

const Container = styled(View)`
  flex-direction: row;
  flex-flow: row wrap;
  flex: 1;
  min-height: 36px;
  max-height: 123px;
  border: solid;
  border-width: 1px;
  border-color: ${TEXT_INPUT_BORDER_COLOR};
  border-radius: 5px;
  margin: 0 0 0 10px;
  overflow-y: scroll;
`;

const TextSearch = styled(TextInput)`
  height: 100%;
  width: 100%;
  outline: none;
  padding: 6px 16px 6px 16px;
`;
const Selected = styled(PillButton)`
  margin: 5px 0 5px 8px;
  outline: none;
`;
