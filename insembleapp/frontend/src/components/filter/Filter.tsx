import React, { ComponentProps, useState, useEffect } from 'react';
import styled from 'styled-components';
import 'rc-slider/assets/index.css';

import { View, Text, PillButton, Card, Button } from '../../core-ui';
import {
  THEME_COLOR,
  BOTTOM_CARD_COLOR,
  UNSELECTED_TEXT_COLOR,
  TEXT_INPUT_BORDER_COLOR,
} from '../../constants/colors';
import { FONT_SIZE_SMALL, FONT_SIZE_NORMAL } from '../../constants/theme';
import 'rc-slider/assets/index.css';
import { Range } from 'rc-slider';
import TextInput from '../../core-ui/ContainedTextInput';

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
  value?: Array<number>;
  allOptions?: Array<string>;
  selectedOptions?: Array<string>;
  onSelect?: (filter: string) => void;
  onUnSelect?: (filter: string) => void;
  onClear?: () => void;
  onDone?: () => void;
  onSliderChange?: (value: Array<number>) => void;
  onSubmit?: () => void;
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
    value,
    minimum,
    maximum,
    onClear,
    onDone,
    onSliderChange,
    onSubmit,
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
      <UpperContentWrapper>
        <TitleWrapper>
          <SmallText>{title}</SmallText>
          {selection && selectedOptions && selectedOptions.length > 0 && (
            <SmallText style={{ fontStyle: 'italic' }}>
              {selectedOptions.length} of {allOptions.length} selected
            </SmallText>
          )}
        </TitleWrapper>
        <FlexRowWrap>
          {selection &&
            allOptions &&
            allOptions.map((filter, index) => {
              return (
                <SmallPillButton
                  key={'available' + index}
                  onClick={() => onSelect && onSelect(filter)}
                >
                  {filter}
                </SmallPillButton>
              );
            })}
          {selection &&
            selectedOptions &&
            selectedOptions.map((filter, index) => {
              return (
                <SmallPillButton
                  key={'selected' + index}
                  primary
                  onClick={() => onUnSelect && onUnSelect(filter)}
                >
                  {filter}
                </SmallPillButton>
              );
            })}
        </FlexRowWrap>
        {rangeSlide && (
          <Slider>
            <Range
              defaultValue={value}
              max={maximum}
              min={minimum}
              allowCross={false}
              onChange={(value) => onSliderChange && onSliderChange(value)}
              trackStyle={[{ backgroundColor: THEME_COLOR, height: 8 }]}
              railStyle={{ height: 8 }}
              handleStyle={[
                {
                  backgroundColor: THEME_COLOR,
                  borderColor: THEME_COLOR,
                  boxShadow: '0px 0px 1px rgba(0,0,0,0.16)',
                  height: 24,
                  width: 24,
                  marginTop: -8,
                },
                {
                  backgroundColor: THEME_COLOR,
                  borderColor: THEME_COLOR,
                  boxShadow: '0px 0px 2px rgba(0,0,0,0.16)',
                  height: 24,
                  width: 24,
                  marginTop: -8,
                },
              ]}
            />
            {income ? (
              <SliderText>
                <UnSelectedText>${minimum}K</UnSelectedText>
                <SmallText>
                  ${value && value[0]}K - ${value && value[1]}K
                </SmallText>
                <UnSelectedText>${maximum}K</UnSelectedText>
              </SliderText>
            ) : (
              <SliderText>
                <UnSelectedText>{minimum}</UnSelectedText>
                <SmallText>
                  {value && value[0]} - {value && value[1]}
                </SmallText>
                <UnSelectedText>{maximum}</UnSelectedText>
              </SliderText>
            )}
          </Slider>
        )}
        {rangeInput && (
          <RangeInput>
            <TextInputWithBorder placeholder={'Low'} />
            <Text style={{ alignSelf: 'center' }}> - </Text>
            <TextInputWithBorder placeholder={'High'} />
          </RangeInput>
        )}
        {search && (
          <SearchWrapper>
            <TextInputWithBorder
              onSubmit={onSubmit}
              placeholder="Search"
              icon
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
            />
            <FlexRowWrap>
              {selectedOptions &&
                selectedOptions.map((filter, index) => {
                  return (
                    <SmallPillButton
                      key={'selected' + index}
                      primary
                      onClick={() => onUnSelect && onUnSelect(filter)}
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
                    >
                      {filter}
                    </SmallPillButton>
                  );
                })}
            </FlexRowWrap>
          </SearchWrapper>
        )}
      </UpperContentWrapper>
      <BottomWrapper>
        {selectedOptions.length > 0 && (
          <ClearButton mode="secondary" onPress={onClear} text="Clear All" />
        )}
        <Button onPress={onDone} text="Done" />
      </BottomWrapper>
    </Card>
  ) : null;
}

const UpperContentWrapper = styled(View)`
  padding: 12px;
`;
const Slider = styled(View)`
  margin: 12px;
`;
const SliderText = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding: 0 12px 0 12px;
  margin: 4px 0 4px 0;
`;
const RangeInput = styled(View)`
  flex-direction: row;
  justify-content: space-around;
  width: '100%';
`;
const TitleWrapper = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;
const FlexRowWrap = styled(View)`
  flex-direction: row;
  flex-flow: row wrap;
`;
const BottomWrapper = styled(View)`
  flex-direction: row;
  background-color: ${BOTTOM_CARD_COLOR};
  padding: 12px;
  justify-content: flex-end;
  align-items: center;
`;
const SearchWrapper = styled(View)`
  margin: 12px 0 0 0;
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
const UnSelectedText = styled(Text)`
  font-size: ${FONT_SIZE_SMALL};
  color: ${UNSELECTED_TEXT_COLOR};
`;

const ShowingResultsText = styled(SmallText)`
  line-height: 2;
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
