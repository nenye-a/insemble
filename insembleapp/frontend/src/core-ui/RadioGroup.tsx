import React, { ComponentProps } from 'react';
import styled from 'styled-components';

import View from './View';
import RadioButton from './RadioButton';
import useID from '../utils/useID';
import Label from './Label';

type ViewProps = ComponentProps<typeof View>;

type RadioGroupProps<T> = ViewProps & {
  name?: string;
  options: Array<T>;
  selectedOption?: T;
  titleExtractor?: (item: T) => string;
  keyExtractor?: (item: T, index: number) => string;
  onSelect: (item: T) => void;
  radioItemProps?: ViewProps;
  label?: string;
  disabled?: boolean;
};

const defaultTitleExtractor = (item: unknown) => String(item);
const defaultKeyExtractor = (item: unknown, index: number) => String(index);

export default function RadioGroup<T>(props: RadioGroupProps<T>) {
  let {
    name: providedName,
    options,
    selectedOption,
    titleExtractor = defaultTitleExtractor,
    keyExtractor = defaultKeyExtractor,
    onSelect,
    radioItemProps,
    label,
    disabled = false,
    ...otherProps
  } = props;
  let fallbackName = useID();

  let name = providedName || fallbackName;
  return (
    <View {...otherProps}>
      {label && <LabelWrapper id={name} text={label} />}
      {options.map((item, i) => {
        let key = keyExtractor(item, i);
        return (
          <RadioButton
            key={key}
            name={name}
            id={name + '_' + key}
            title={titleExtractor(item)}
            isSelected={item === selectedOption}
            onPress={() => onSelect(item)}
            disabled={disabled}
            {...radioItemProps}
          />
        );
      })}
    </View>
  );
}

const LabelWrapper = styled(Label)`
  padding-bottom: 8px;
`;
