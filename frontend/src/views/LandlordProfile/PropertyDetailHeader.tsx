import React, { ComponentProps } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { View, TouchableOpacity, Text, Card, Button } from '../../core-ui';
import {
  THEME_COLOR,
  BACKGROUND_COLOR,
  WHITE,
  TEXT_COLOR,
  // SECONDARY_COLOR,
} from '../../constants/colors';
// import SvgPlus from '../../components/icons/plus';
import { FONT_SIZE_MEDIUM } from '../../constants/theme';
import SvgArrowBack from '../../components/icons/arrow-back';

type Props = {
  spaces: Array<string>;
  address: string;
  request: string;
  selectedSpaceIndex: number;
  onPressSpace: (index: number) => void;
  onPressAdd: () => void;
};
export default function PropertyDetailHeader({
  spaces,
  address,
  // request,
  selectedSpaceIndex,
  onPressSpace,
}: // onPressAdd,
Props) {
  let history = useHistory();
  return (
    <Card style={{ marginBottom: 30 }}>
      <UpperHeader>
        <Button
          mode="transparent"
          text="Back To Properties"
          icon={<SvgArrowBack style={{ color: THEME_COLOR }} />}
          onPress={() => {
            history.goBack();
          }}
          textProps={{ style: { marginLeft: 8 } }}
        />
        <SpaceContainer>
          <AddressText>{address}</AddressText>
          {/* TODO */}
          {/* <NewRequestText>{request} new request</NewRequestText> */}
        </SpaceContainer>
      </UpperHeader>
      <RowedView>
        <Row>
          {spaces.map((item, index) => {
            return (
              <TabSegment
                key={index}
                isActive={selectedSpaceIndex === index}
                onPress={() => onPressSpace(index)}
              >
                <SegmentText isActive={selectedSpaceIndex === index}>{item}</SegmentText>
              </TabSegment>
            );
          })}
        </Row>
        {/*
          TODO:
          <AddButton onPress={onPressAdd}>
            <SvgPlus style={{ color: THEME_COLOR }} />
          </AddButton> */}
      </RowedView>
    </Card>
  );
}

type SegmentProps = ComponentProps<typeof TouchableOpacity> & {
  isActive: boolean;
};

const AddressText = styled(Text)`
  font-size: ${FONT_SIZE_MEDIUM};
`;

// const NewRequestText = styled(Text)`
//   color: ${SECONDARY_COLOR};
// `;

const Row = styled(View)`
  flex-direction: row;
`;

const RowedView = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${BACKGROUND_COLOR};
`;

const SpaceContainer = styled(RowedView)`
  background-color: ${WHITE};
  margin: 4px 0;
`;

// const AddButton = styled(TouchableOpacity)`
//   justify-content: center;
//   margin: 0 5px;
// `;

const SegmentText = styled(Text)<SegmentProps>`
  color: ${(props) => (props.isActive ? THEME_COLOR : TEXT_COLOR)};
`;

const TabSegment = styled(TouchableOpacity)<SegmentProps>`
  padding: 20px;
  height: 36px;
  align-items: center;
  justify-content: center;
  &:focus {
    outline: none;
  }
  background-color: ${(props) => (props.isActive ? WHITE : BACKGROUND_COLOR)};
`;

const UpperHeader = styled(View)`
  padding: 6px 18px;
  align-items: flex-start;
`;
