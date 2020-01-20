import React, { ComponentProps, CSSProperties, ComponentType } from 'react';
import styled, { css } from 'styled-components';
import { Card, Text, View, TouchableOpacity } from '../../core-ui';
import { FONT_SIZE_XSMALL } from '../../constants/theme';
import { SECONDARY_COLOR, WHITE, THEME_COLOR } from '../../constants/colors';
import { IconProps } from '../../types/types';

type Option = {
  name: string;
  icon: ComponentType<IconProps>;
  selectedValues?: string | Array<string>;
  // need to add more properties to save the filter pop up data from backend
};

type Props = ComponentProps<typeof View> & {
  title: string;
  options: Array<Option>;
  onOptionPress?: (value: Option) => void;
  contentStyle?: CSSProperties;
};

export default function FilterCard(props: Props) {
  let { title, options, contentStyle, onOptionPress, ...otherProps } = props;
  return (
    <Card
      title={title}
      mode="with-title"
      titleContainerProps={{
        style: { alignItems: 'center', justifyContent: 'center', height: '28px' },
      }}
      {...otherProps}
    >
      <View style={contentStyle}>
        {options.map((item, i) => (
          <OptionItem
            key={i}
            selected={item.selectedValues && item.selectedValues !== ''}
            onPress={() => onOptionPress && onOptionPress(item)}
          >
            <item.icon />
            <View style={{ marginLeft: 5 }}>
              <Text>{item.name}</Text>
              {item.selectedValues && (
                <Text fontSize={FONT_SIZE_XSMALL}>{item.selectedValues}</Text>
              )}
            </View>
          </OptionItem>
        ))}
      </View>
    </Card>
  );
}

type OptionItemProps = ComponentProps<typeof TouchableOpacity> & {
  selected: boolean;
};

const OptionItem = styled(TouchableOpacity)<OptionItemProps>`
  flex-direction: row;
  align-items: center;
  height: 36px;
  padding: 12px;
  margin-top: 2px;
  &:last-child {
    margin-bottom: 2px;
  }
  &:hover {
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
    props.selected &&
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
