import React, { ComponentProps, CSSProperties } from 'react';
import styled, { css } from 'styled-components';
import { Card, Text, View, TouchableOpacity } from '../../core-ui';
import { FONT_SIZE_MEDIUMSMALL } from '../../constants/theme';
import { SECONDARY_COLOR, WHITE, THEME_COLOR } from '../../constants/colors';
import { FilterObj, FilterType } from '../../reducers/sideBarFiltersReducer';
import { DEMOGRAPHICS_CATEGORIES } from './SideBarFilters';

type Props = ComponentProps<typeof View> & {
  title: string;
  options: Array<FilterObj>;
  onOptionPress?: (value: FilterObj) => void;
  contentStyle?: CSSProperties;
  openFilterName: string | null;
};

export default function FilterCard(props: Props) {
  let { title, options, contentStyle, onOptionPress, openFilterName, ...otherProps } = props;

  return (
    <Card
      title={title}
      titleBackground="purple"
      titleContainerProps={{
        style: { alignItems: 'center', justifyContent: 'center', height: '28px' },
      }}
      {...otherProps}
    >
      <View style={contentStyle}>
        {options.map(({ type, name, selectedValues, icon: Icon, allOptions }, index) => {
          let selectedText = '';
          if (type === FilterType.RANGE_SLIDER || type === FilterType.RANGE_INPUT) {
            if (selectedValues.length > 1) {
              if (name === DEMOGRAPHICS_CATEGORIES.income) {
                selectedText = `${selectedValues[0]}K - ${selectedValues[1]}K`;
              } else {
                selectedText = selectedValues[0] + ' - ' + selectedValues[1];
              }
            }
          } else {
            selectedText = selectedValues.length + ' selected';
          }

          return (
            <OptionItem
              key={name + index}
              selected={selectedValues && selectedValues.length > 0}
              onPress={() =>
                onOptionPress &&
                onOptionPress({ type, name, selectedValues, allOptions, icon: Icon })
              }
              isOpen={openFilterName === name}
            >
              <View style={{ width: 24, height: 24 }}>
                <Icon />
              </View>
              <View style={{ marginLeft: 5 }}>
                <Text>{name}</Text>
                {selectedValues.length > 0 && (
                  <Text fontSize={FONT_SIZE_MEDIUMSMALL}>{selectedText}</Text>
                )}
              </View>
            </OptionItem>
          );
        })}
      </View>
    </Card>
  );
}

type OptionItemProps = ComponentProps<typeof TouchableOpacity> & {
  selected: boolean;
  isOpen: boolean;
};

const OptionItem = styled(TouchableOpacity)<OptionItemProps>`
  flex-direction: row;
  align-items: center;
  height: 36px;
  padding: 12px;
  margin-top: 2px;
  overflow: hidden;
  &:last-child {
    margin-bottom: 2px;
  }
  &:hover,
  &:focus {
    background-color: ${SECONDARY_COLOR};
  }
  &:hover ${Text} {
    color: ${WHITE};
  }

  &:hover {
    path,
    rect {
      fill: ${WHITE};
    }
  }
  ${(props) =>
    (props.selected || props.isOpen) &&
    css`
      background-color: ${THEME_COLOR};
      ${Text} {
        color: ${WHITE};
      }
      path,
      rect {
        fill: ${WHITE};
      }
    `}
`;
