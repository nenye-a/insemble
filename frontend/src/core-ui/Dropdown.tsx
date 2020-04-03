import React, { useState, ComponentProps, CSSProperties } from 'react';
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
import TouchableOpacity, { TouchableOpacityProps } from './TouchableOpacity';
import ClickAway from './ClickAway';

import arrowIcon from '../assets/images/arrow-down.svg';
import checkIcon from '../assets/images/check.svg';

type Props<T> = {
  options: Array<T>;
  selectedOption?: T;
  onSelect: (value: T) => void;
  titleExtractor?: (item: T) => string;
  keyExtractor?: (item: T, index: number) => string;
  containerStyle?: CSSProperties;
  fullWidth?: boolean;
};

type TouchableWithFullWidth = TouchableOpacityProps & {
  fullWidth: boolean;
};

const defaultTitleExtractor = (item: unknown) => String(item);
const defaultKeyExtractor = (item: unknown, index: number) => String(index);

export default function Dropdown<T>(props: Props<T>) {
  let {
    options,
    selectedOption,
    onSelect,
    titleExtractor = defaultTitleExtractor,
    keyExtractor = defaultKeyExtractor,
    containerStyle,
    fullWidth = false,
  } = props;
  let [dropdownOpen, toggleDropdown] = useState(false);

  return (
    <View style={{ zIndex: 2, ...containerStyle }}>
      <Container fullWidth={fullWidth} onPress={() => toggleDropdown(!dropdownOpen)}>
        <Text color={THEME_COLOR}>{selectedOption}</Text>
        <ArrowIcon src={arrowIcon} alt="arrow-icon" isOpen={dropdownOpen} />
      </Container>
      {dropdownOpen && (
        <ClickAway onClickAway={() => toggleDropdown(false)}>
          <OptionContainer>
            {options.map((item, i) => {
              // TODO: Allow selectedOption to be a function.
              let isSelected = item === selectedOption;
              return (
                <Option
                  key={keyExtractor(item, i)}
                  onPress={() => {
                    onSelect(item);
                    toggleDropdown(!dropdownOpen);
                  }}
                >
                  <IconContainer>
                    {isSelected && <img src={checkIcon} alt="check-icon" />}
                  </IconContainer>
                  <ListText selected={isSelected}>{titleExtractor(item)}</ListText>
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

const Container = styled(TouchableOpacity)<TouchableWithFullWidth>`
  border: 0.5px solid ${THEME_COLOR};
  border-radius: ${DEFAULT_BORDER_RADIUS};
  padding-left: 8px;
  padding-right: 8px;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '150px')};
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
