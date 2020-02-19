import React, { ComponentProps, useState, useEffect } from 'react';
import styled from 'styled-components';

import { View, Text, PillButton, Card, Button, LoadingIndicator } from '../../core-ui';
import { THEME_COLOR, BOTTOM_CARD_COLOR, TEXT_INPUT_BORDER_COLOR } from '../../constants/colors';
import { FONT_SIZE_SMALL, FONT_SIZE_NORMAL } from '../../constants/theme';
import TextInput from '../../core-ui/ContainedTextInput';
import SliderFilter from './SliderFilter';
import RangeInput from './RangeInput';

type Props = ComponentProps<typeof View> & {
  visible?: boolean;
  title?: string;
  rangeSlide?: boolean;
  rangeInput?: boolean;
  search?: boolean;
  selection?: boolean;
  income?: boolean;
  minimum?: number;
  maximum?: number;
  values?: Array<number>;
  allOptions?: Array<string>;
  selectedOptions?: Array<string>;
  onSelect?: (filter: string) => void;
  onUnSelect?: (filter: string) => void;
  onClear?: () => void;
  onDone?: () => void;
  onSliderChange?: (value: Array<number>) => void;
  onSubmit?: () => void;
  onLowRangeInputChange?: (lowValue: string) => void;
  onHighRangeInputChange?: (highValue: string) => void;
  lowValue?: string;
  highValue?: string;
  noPreferenceButton?: boolean;
  hasPreference?: boolean;
  onNoPreferencePress?: () => void;
  disabled?: boolean; // TODO: pass disabled to other filter components as well when necessary
  loading?: boolean;
};

export default function Filter(props: Props) {
  let {
    visible,
    title,
    rangeSlide,
    rangeInput,
    selection,
    allOptions = [],
    income,
    search,
    selectedOptions = [],
    onSelect,
    onUnSelect,
    values,
    minimum,
    maximum,
    onClear,
    onDone,
    onSliderChange,
    onSubmit,
    onLowRangeInputChange,
    onHighRangeInputChange,
    lowValue,
    highValue,
    noPreferenceButton,
    hasPreference,
    onNoPreferencePress,
    disabled,
    loading,
    ...otherProps
  } = props;
  let [filteredOptions, setFilteredOptions] = useState(allOptions);
  let [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (search) {
      let availableOptions = allOptions.filter(
        (option: string) => !selectedOptions.includes(option)
      );
      let newFilteredOptions =
        (searchText !== ''
          ? availableOptions.filter((option: string) => option.toLowerCase().includes(searchText))
          : availableOptions) || [];
      setFilteredOptions(newFilteredOptions);
    }
  }, [allOptions, selectedOptions, searchText, search]);

  return visible ? (
    <Card {...otherProps}>
      <TitleWrapper>
        <SmallText>{title}</SmallText>
        {selection && selectedOptions && selectedOptions.length > 0 && (
          <SmallText style={{ fontStyle: 'italic' }}>
            {selectedOptions.length} of {allOptions.length} selected
          </SmallText>
        )}
      </TitleWrapper>
      {loading ? (
        <LoadingIndicator color="purple" />
      ) : (
        <>
          <FlexRowWrap>
            {selection &&
              allOptions &&
              allOptions.map((filter, index) => {
                let isSelected = selectedOptions.includes(filter);
                return (
                  <SmallPillButton
                    key={'available' + index}
                    primary={!!isSelected}
                    onClick={() => {
                      if (isSelected) {
                        onUnSelect && onUnSelect(filter);
                      } else {
                        onSelect && onSelect(filter);
                      }
                    }}
                  >
                    {filter}
                  </SmallPillButton>
                );
              })}
          </FlexRowWrap>
          {rangeSlide && (
            <SliderFilter
              onSliderChange={onSliderChange}
              values={values}
              maximum={maximum}
              minimum={minimum}
              postfix={income ? 'K' : ''}
              prefix={income ? '$' : ''}
              disabled={disabled}
            />
          )}
          {rangeInput && (
            <RangeInput
              lowValue={lowValue}
              highValue={highValue}
              onLowRangeInputChange={onLowRangeInputChange}
              onHighRangeInputChange={onHighRangeInputChange}
            />
          )}
          {search && (
            <>
              <SearchWrapper>
                <TextInputWithBorder
                  onSubmit={onSubmit}
                  placeholder="Search"
                  icon
                  onChange={(e) => {
                    setSearchText(e.target.value);
                  }}
                  disabled={disabled}
                />
              </SearchWrapper>
              <FlexRowWrap>
                {selectedOptions &&
                  selectedOptions.map((filter, index) => {
                    return (
                      <SmallPillButton
                        key={'selected' + index}
                        primary
                        onClick={() => onUnSelect && onUnSelect(filter)}
                        disabled={disabled}
                      >
                        {filter}
                      </SmallPillButton>
                    );
                  })}
              </FlexRowWrap>
              <ShowingResultsText>
                Showing {allOptions && allOptions.length} result(s)
              </ShowingResultsText>
              <FlexRowWrap>
                {filteredOptions &&
                  filteredOptions.map((filter, index) => {
                    return (
                      <SmallPillButton
                        key={'filtered' + index}
                        onClick={() => onSelect && onSelect(filter)}
                        disabled={disabled}
                      >
                        {filter}
                      </SmallPillButton>
                    );
                  })}
              </FlexRowWrap>
            </>
          )}
        </>
      )}
      <BottomWrapper>
        {selectedOptions.length > 0 && (
          <ClearButton mode="secondary" onPress={onClear} text="Clear All" />
        )}
        {noPreferenceButton && onNoPreferencePress && (
          <Button
            mode={hasPreference ? 'transparent' : 'primary'}
            text="No Preference"
            onPress={onNoPreferencePress}
            style={hasPreference ? { fontStyle: 'italic' } : undefined}
            disabled={disabled}
          />
        )}
        {onDone && <Button onPress={onDone} text="Done" />}
      </BottomWrapper>
    </Card>
  ) : null;
}

const TitleWrapper = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding: 12px 12px 0px 12px;
`;
const FlexRowWrap = styled(View)`
  flex-direction: row;
  flex-flow: row wrap;
  max-height: 150px;
  padding: 0 12px;
  overflow-y: scroll;
`;
const BottomWrapper = styled(View)`
  flex-direction: row;
  background-color: ${BOTTOM_CARD_COLOR};
  padding: 12px;
  justify-content: flex-end;
  align-items: center;
`;
const SearchWrapper = styled(View)`
  padding: 12px;
`;
const SmallText = styled(Text)`
  font-size: ${FONT_SIZE_SMALL};
`;
const SmallPillButton = styled(PillButton)`
  font-size: ${FONT_SIZE_SMALL};
  margin: 4px 8px 4px 0px;
`;
const TextInputWithBorder = styled(TextInput)`
  border: solid;
  border-width: 0.5px;
  border-color: ${TEXT_INPUT_BORDER_COLOR};
  height: 36px;
  font-size: ${FONT_SIZE_NORMAL};
`;

const ShowingResultsText = styled(SmallText)`
  line-height: 2;
  padding: 0 12px;
`;

const ClearButton = styled(Button)`
  padding: 0px;
  font-style: italic;
  margin-right: 16px;
  border: none;
  background-color: transparent;
  ${Text} {
    color: ${THEME_COLOR};
  }
`;
