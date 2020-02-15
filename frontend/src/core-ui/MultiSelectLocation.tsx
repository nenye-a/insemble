import React, { useState, useEffect, useRef, ComponentProps, CSSProperties } from 'react';
import styled from 'styled-components';
import PillButton from './PillButton';
import View from './View';
import TextInput from './TextInput';
import Label from './Label';
import { TEXT_INPUT_BORDER_COLOR } from '../constants/colors';
import { useID } from '../utils';

export type GPlaceResult = {
  address: string;
  lat?: number;
  lng?: number;
};

type Props = ComponentProps<'input'> & {
  onSelected: (values: Array<GPlaceResult>) => void;
  label?: string;
  containerStyle?: CSSProperties;
  defaultSelected?: Array<GPlaceResult>;
};

export default function MultiSelectLocation(props: Props) {
  let { onSelected, label, containerStyle, defaultSelected } = props;
  let [selectedValues, setSelectedValues] = useState<Array<GPlaceResult>>(defaultSelected || []);
  let [inputValue, setInputValue] = useState<string>('');
  let inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (inputRef.current) {
      if (window.google && window.google.maps) {
        let autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
        let listener = autocomplete.addListener('place_changed', () => {
          let place = autocomplete.getPlace();
          setSelectedValues((values) => [
            ...values,
            {
              address: place.formatted_address || '',
              lat: place.geometry?.location.lat(),
              lng: place.geometry?.location.lng(),
            },
          ]);
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

  let id = useID();
  let placeholder = selectedValues.length > 0 ? '' : 'Enter a location';

  return (
    <View style={containerStyle}>
      {label && <LabelWrapper text={label} id={id} />}
      <Container>
        {selectedValues.map(({ address }, index) => (
          <Selected key={index} primary>
            {address}
          </Selected>
        ))}
        <TextSearch
          id={id}
          ref={inputRef}
          placeholder={placeholder}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyUp={(event) => {
            if (
              event.which === 8 &&
              !event.metaKey &&
              !event.ctrlKey &&
              !event.shiftKey &&
              inputValue === ''
            ) {
              removeLast();
            }
          }}
        />
      </Container>
    </View>
  );
}

const Container = styled(View)`
  flex-flow: row wrap;
  max-height: 156px;
  overflow-y: scroll;
  min-height: 36px;
  border: solid;
  border-width: 1px;
  border-color: ${TEXT_INPUT_BORDER_COLOR};
  border-radius: 5px;
  align-items: center;
  padding: 4px 0;
`;

const TextSearch = styled(TextInput)`
  height: fit-content;
  width: 100%;
  outline: none;
  padding-top: 0;
  padding-bottom: 0;
  border: none;
`;

const Selected = styled(PillButton)`
  margin: 2px;
  outline: none;
  height: 28px;
  width: max-content;
`;

const LabelWrapper = styled(Label)`
  padding-bottom: 8px;
`;
