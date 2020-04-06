import React, { useState, ComponentProps } from 'react';
import styled from 'styled-components';
import { View, Text, Badge, TouchableOpacity, ClickAway } from '../core-ui';
import { THEME_COLOR, WHITE } from '../constants/colors';
import { DEFAULT_BORDER_RADIUS } from '../constants/theme';
import Filter from './filter/Filter';

type Props = ComponentProps<typeof View> & {
  selectedOptions: Array<string>;
  options: Array<string>;
  onSelect: (item: string) => void;
  onUnSelect: (item: string) => void;
  placeholder: string;
  onClear: () => void;
  onPickerClose?: () => void;
  loading?: boolean;
};

export default function MultiSelectBox(props: Props) {
  let {
    selectedOptions,
    options,
    onSelect,
    onUnSelect,
    placeholder,
    onClear,
    onPickerClose,
    loading,
    ...otherProps
  } = props;
  let [pickerOpen, togglePicker] = useState(false);

  let selectedValuesString = selectedOptions.join(', ');

  let selectedOptionSize = selectedOptions.length;
  return (
    <View {...otherProps}>
      <Container onPress={() => togglePicker(!pickerOpen)}>
        {selectedOptionSize > 0 ? (
          <SelectedValuesText>{selectedValuesString}</SelectedValuesText>
        ) : (
          <Placeholder>{placeholder}</Placeholder>
        )}
        {selectedOptionSize > 0 && <SelectorBadge text={selectedOptionSize} />}
      </Container>
      {pickerOpen && (
        <ClickAway
          onClickAway={() => {
            togglePicker(false);
            onPickerClose && onPickerClose();
          }}
        >
          <PickerContainer
            visible
            search
            selectedOptions={selectedOptions}
            allOptions={options}
            onUnSelect={onUnSelect}
            onSelect={onSelect}
            onDone={() => {
              togglePicker(false);
              onPickerClose && onPickerClose();
            }}
            onClear={onClear}
            loading={loading}
          />
        </ClickAway>
      )}
    </View>
  );
}

const Container = styled(TouchableOpacity)`
  border: 0.5px solid ${THEME_COLOR};
  border-radius: ${DEFAULT_BORDER_RADIUS};
  padding-left: 8px;
  padding-right: 8px;
  width: 150px;
  height: 36px;
  background-color: ${WHITE};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SelectedValuesText = styled(Text)`
  color: ${THEME_COLOR};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const Placeholder = styled(Text)`
  color: ${THEME_COLOR};
`;

const PickerContainer = styled(Filter)`
  margin-top: 5px;
  background-color: ${WHITE};
  position: absolute;
  width: 400px;
  max-width: 80vw;
`;

const SelectorBadge = styled(Badge)`
  position: absolute;
  top: -6px;
  right: -4px;
`;
