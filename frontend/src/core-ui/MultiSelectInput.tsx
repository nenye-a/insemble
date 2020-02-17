import React, { ComponentProps, useState, useRef, CSSProperties } from 'react';
import styled from 'styled-components';
import PillButton from './PillButton';
import View from './View';
import TextInput from './ContainedTextInput';
import {
  THEME_COLOR,
  WHITE,
  HOVERED_LIST_ITEM_BG,
  TEXT_COLOR,
  TEXT_INPUT_BORDER_COLOR,
} from '../constants/colors';
import Card from './Card';
import TouchableOpacity from './TouchableOpacity';
import ClickAway from './ClickAway';
import { FONT_SIZE_NORMAL, FONT_FAMILY_NORMAL, FONT_WEIGHT_NORMAL } from '../constants/theme';

type ViewProps = ComponentProps<typeof View>;

type Props = {
  options: Array<string>;
  placeholder: string;
  onChange: (options: Array<string>) => void;
  containerStyle?: CSSProperties;
};

export default function MultiSelectInput(props: Props) {
  let { options, placeholder, onChange, containerStyle } = props;
  let [selectedValues, setSelectedValues] = useState<Array<string>>([]);
  let [inputValue, setInputValue] = useState<string>('');
  let [isFocused, setFocus] = useState<boolean>(false);
  let inputRef = useRef<HTMLInputElement | null>(null);

  let removeLast = () => {
    let newSelectedOptions = selectedValues.slice(0, selectedValues.length - 1);
    setSelectedValues(newSelectedOptions);
    onChange(selectedValues);
  };
  let optionList = options.filter((option) => option.toLowerCase().includes(inputValue));
  let newOptionList = optionList.filter((option) => !selectedValues.includes(option));

  return (
    <View style={containerStyle}>
      <SearchContainer isFocused={isFocused}>
        {selectedValues.map((value, index) => (
          <Selected key={index} primary>
            {value}
          </Selected>
        ))}
        <TextSearch
          id={'search'}
          ref={inputRef}
          value={inputValue}
          placeholder={placeholder}
          onClick={() => setFocus(document.getElementById('search') === document.activeElement)}
          onBlur={() => setFocus(document.getElementById('search') === document.activeElement)}
          onChange={(event) => setInputValue(event.target.value.toLocaleLowerCase())}
          onKeyDown={(event) => {
            if (event.which === 8 && !event.metaKey && !event.ctrlKey && !event.shiftKey) {
              if (inputValue.length < 1) {
                removeLast();
              }
            }
          }}
          autoComplete={'on'}
        />
      </SearchContainer>
      {inputValue ? (
        <ClickAway onClickAway={() => setInputValue('')}>
          <OptionContainer>
            {newOptionList.map((item, i) => {
              return (
                <Option
                  key={i}
                  onPress={() => [
                    setInputValue(''),
                    setSelectedValues([...selectedValues, item]),
                    onChange(selectedValues),
                  ]}
                >
                  <ListText>{item}</ListText>
                </Option>
              );
            })}
          </OptionContainer>
        </ClickAway>
      ) : null}
    </View>
  );
}

type SearchContainerProps = ViewProps & {
  isFocused: boolean;
};
const SearchContainer = styled(View)<SearchContainerProps>`
  flex-direction: row;
  flex-flow: row-wrap;
  align-items: center;
  width: 100%;
  height: 40px;
  border: solid;
  border-width: 1px;
  border-color: ${(props) => (props.isFocused ? THEME_COLOR : TEXT_INPUT_BORDER_COLOR)};
  border-radius: 5px;
`;

const TextSearch = styled(TextInput)`
  width: 100%;
  line-height: 36px;
  outline: none;
  background-color: transparent;
`;

const Selected = styled(PillButton)`
  margin: 0 0 0 8px;
  outline: none;
`;
const OptionContainer = styled(Card)`
  width: 100%;
  max-height: 230px;
  overflow-y: scroll;
  margin-top: 5px;
  background-color: ${WHITE};
  position: absolute;
`;

const Option = styled(TouchableOpacity)`
  padding: 0px 12px;
  height: 45px;
  align-items: center;
  flex-direction: row;
  &:hover {
    color: ${TEXT_COLOR};
    background-color: ${HOVERED_LIST_ITEM_BG};
  }
`;

const ListText = styled.li`
  margin-left: 8px;
  list-style: none;
  font-family: ${FONT_FAMILY_NORMAL};
  font-weight: ${FONT_WEIGHT_NORMAL};
  font-size: ${FONT_SIZE_NORMAL};
`;
