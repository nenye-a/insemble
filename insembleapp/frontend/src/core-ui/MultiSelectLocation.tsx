import React, { useState, useEffect, useRef, ComponentProps } from 'react';
import styled from 'styled-components';
import PillButton from './PillButton';
import View from './View';
import TextInput from './TextInput';
import { TEXT_INPUT_BORDER_COLOR } from '../constants/colors';

type Props = ComponentProps<'input'> & {
  onSelected: (values: Array<string>) => void;
};

export default function MultiSelectLocation(props: Props) {
  let { onSelected } = props;
  let [selectedValues, setSelectedValues] = useState<Array<string>>([]);
  let [inputValue, setInputValue] = useState<string>('');
  let inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (inputRef.current) {
      if (window.google && window.google.maps) {
        let autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
        let listener = autocomplete.addListener('place_changed', () => {
          let place = autocomplete.getPlace();
          setSelectedValues((values) =>
            place && place.formatted_address ? [...values, place.formatted_address] : values
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
    }
  }, []);

  onSelected(selectedValues);
  let removeLast = () => {
    let newSelectedOptions = selectedValues.slice(0, -1);
    setSelectedValues(newSelectedOptions);
  };

  let placeholder = selectedValues.length > 0 ? '' : 'Enter a location';

  return (
    <Container>
      {selectedValues.map((value, index) => (
        <Selected key={index} primary>
          {value}
        </Selected>
      ))}
      <TextSearch
        ref={inputRef}
        placeholder={placeholder}
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyUp={(event) => {
          if (event.which === 8 && !event.metaKey && !event.ctrlKey && !event.shiftKey) {
            removeLast();
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
  max-height: 156px;
  overflow-y: scroll;
  min-height: 36px;
  border: solid;
  border-width: 1px;
  border-color: ${TEXT_INPUT_BORDER_COLOR};
  border-radius: 5px;
  margin: 10px 0 10px 0;
`;

const TextSearch = styled(TextInput)`
  height: 100%;
  width: 100%;
  outline: none;
  padding: 6px 16px 6px 16px;
  border: none;
`;
const Selected = styled(PillButton)`
  margin: 5px 0 5px 5px;
  outline: none;
`;
