import React, { ComponentProps } from 'react';
import View from './View';
import RadioButton from './RadioButton';
import useID from '../utils/useID';

type ViewProps = ComponentProps<typeof View>;

type RadioGroupProps<T> = ViewProps & {
  name?: string;
  options: Array<T>;
  selectedOption?: T;
  titleExtractor?: (item: T) => string;
  keyExtractor?: (item: T, index: number) => string;
  onSelect: (item: T) => void;
  radioItemProps?: ViewProps;
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
    ...otherProps
  } = props;
  let fallbackName = useID();

  let name = providedName || fallbackName;
  return (
    <View {...otherProps}>
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
            {...radioItemProps}
          />
        );
      })}
    </View>
  );
}
