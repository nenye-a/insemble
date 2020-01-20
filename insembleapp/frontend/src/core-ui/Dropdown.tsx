import React, { useState, ComponentProps } from 'react';
import styled from 'styled-components';
import { THEME_COLOR, WHITE, UNSELECTED_TEXT_COLOR, TEXT_COLOR } from '../constants/colors';
import {
  FONT_SIZE_NORMAL,
  DEFAULT_BORDER_RADIUS,
  FONT_FAMILY_NORMAL,
  FONT_WEIGHT_NORMAL,
} from '../constants/theme';
import Card from './Card';
import Text from './Text';
import View from './View';
import TouchableOpacity from './TouchableOpacity';
import ClickAway from './ClickAway';

import arrowIcon from '../assets/images/arrow-down.svg';
import checkIcon from '../assets/images/check.svg';

type Props<T> = {
  values: Array<T>;
  selectedValue?: T;
  onItemSelected: (value: T) => void;
  extractOption?: (item: T) => string;
};

export default function Dropdown<T>(props: Props<T>) {
  let { values, selectedValue, onItemSelected, extractOption } = props;
  let [dropdownOpen, toggleDropdown] = useState(false);

  return (
    <View>
      <Container onPress={() => toggleDropdown(!dropdownOpen)}>
        <Text color={THEME_COLOR}>{selectedValue}</Text>
        <ArrowIcon src={arrowIcon} alt="arrow-icon" isOpen={dropdownOpen} />
      </Container>
      {dropdownOpen && (
        <ClickAway onClickAway={() => toggleDropdown(false)}>
          <OptionContainer>
            {values.map((item, i) => {
              let extractedOption = !!extractOption ? extractOption(item) : String(item);
              //TODO: add isSelectedComparator
              let isSelected = extractedOption === ((String(selectedValue) as unknown) as string);
              return (
                <Option
                  key={i}
                  onPress={() => {
                    onItemSelected(item);
                    toggleDropdown(!dropdownOpen);
                  }}
                >
                  <IconContainer>
                    {isSelected && <img src={checkIcon} alt="check-icon" />}
                  </IconContainer>
                  <ListText selected={isSelected}>{extractedOption}</ListText>
                </Option>
              );
            })}
          </OptionContainer>
        </ClickAway>
      )}
    </View>
  );
}

type ArrowIconProps = ComponentProps<'img'> & {
  isOpen: boolean;
};

type ListTextProps = ComponentProps<'li'> & {
  selected: boolean;
};

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

const ArrowIcon = styled.img<ArrowIconProps>`
  transform: ${(props) => (props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition-duration: 200ms;
`;

const OptionContainer = styled(Card)`
  min-width: 180px;
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
  }
`;

const IconContainer = styled(View)`
  height: 24px;
  width: 24px;
  object-fit: contain;
  transition: transform 2s;
`;

const ListText = styled.li<ListTextProps>`
  margin-left: 8px;
  list-style: none;
  font-family: ${FONT_FAMILY_NORMAL};
  font-weight: ${FONT_WEIGHT_NORMAL};
  font-size: ${FONT_SIZE_NORMAL};
  color: ${({ selected }) => (selected ? THEME_COLOR : UNSELECTED_TEXT_COLOR)};
`;
