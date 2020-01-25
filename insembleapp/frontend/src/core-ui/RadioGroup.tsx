import React, { ComponentProps, useMemo } from 'react';
import View from './View';
import RadioButton from './RadioButton';

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

const idPrefix = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36);
let idCounter = 0;

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
  let fallbackName = useMemo(() => getID(), []);
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

function getID() {
  let id = idPrefix + idCounter.toString(36);
  idCounter += 1;
  return id;
}
