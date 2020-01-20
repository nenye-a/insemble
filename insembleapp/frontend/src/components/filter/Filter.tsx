import React from 'react';
import styled from 'styled-components';
import { View, Text, PillButton, Card, TouchableOpacity } from '../../core-ui';
import {
  THEME_COLOR,
  BOTTOM_CARD_COLOR,
  WHITE,
  UNSELECTED_TEXT_COLOR,
  TEXT_INPUT_BORDER_COLOR,
} from '../../constants/colors';
import { FONT_SIZE_SMALL, FONT_SIZE_NORMAL } from '../../constants/theme';
import 'rc-slider/assets/index.css';
import { Range } from 'rc-slider';
import TextInput from '../../core-ui/ContainedTextInput';

type Props = {
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
  availableOptions?: Array<string>;
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
    availableOptions,
    income,
    search,
    selectedOptions,
    onSelect,
    onUnSelect,
    value,
    minimum,
    maximum,
    onClear,
    onDone,
    onSliderChange,
    onSubmit,
  } = props;
  return visible ? (
    <Container>
      <TitleWrapper>
        <SmallText>{title}</SmallText>
        {selection && selectedOptions && selectedOptions.length > 0 && (
          <SmallText style={{ fontStyle: 'italic' }}>
            {selectedOptions && selectedOptions.length} of{' '}
            {availableOptions && availableOptions.length} selected{' '}
          </SmallText>
        )}
      </TitleWrapper>
      <FlexRowWrap>
        {selection &&
          availableOptions &&
          availableOptions.map((filter) => {
            return (
              <SmallPillButton onClick={() => onSelect && onSelect(filter)}>
                {filter}
              </SmallPillButton>
            );
          })}
        {selection &&
          selectedOptions &&
          selectedOptions.map((filter) => {
            return (
              <SmallPillButton primary onClick={() => onUnSelect && onUnSelect(filter)}>
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
          <TextInputWithBorder onSubmit={onSubmit} placeholder={'Search'} icon />
          <FlexRowWrap>
            {selection &&
              selectedOptions &&
              selectedOptions.map((filter) => {
                return (
                  <SmallPillButton primary onClick={() => onUnSelect && onUnSelect(filter)}>
                    {filter}
                  </SmallPillButton>
                );
              })}
          </FlexRowWrap>
          <SmallText style={{ marginLeft: 4 }}>
            Showing {availableOptions && availableOptions.length} result(s)
          </SmallText>
          <FlexRowWrap>
            {selection &&
              availableOptions &&
              availableOptions.map((filter) => {
                return (
                  <SmallPillButton onClick={() => onSelect && onSelect(filter)}>
                    {filter}
                  </SmallPillButton>
                );
              })}
          </FlexRowWrap>
        </SearchWrapper>
      )}
      <BottomWrapper>
        {selectedOptions && selectedOptions.length > 0 && (
          <TouchableOpacity onPress={onClear}>
            <Text
              color={THEME_COLOR}
              style={{
                fontStyle: 'italic',
                marginRight: 24,
              }}
            >
              Clear All
            </Text>
          </TouchableOpacity>
        )}
        <SmallPillButton onClick={onDone} primary>
          Done
        </SmallPillButton>
      </BottomWrapper>
    </Container>
  ) : null;
}

const Container = styled(Card)`
  background-color: ${WHITE};
  padding: 0 12px 0 12px;
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
  background-color: 'red';
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
  margin: 12px 0 0 0;
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
`;
const TextInputWithBorder = styled(TextInput)`
  border: solid;
  border-width: 1;
  border-color: ${TEXT_INPUT_BORDER_COLOR};
  height: 36px;
`;
const UnSelectedText = styled(Text)`
  font-size: ${FONT_SIZE_SMALL};
  color: ${UNSELECTED_TEXT_COLOR};
`;
