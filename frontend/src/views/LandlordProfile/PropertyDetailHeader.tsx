import React, { ComponentProps } from 'react';
import styled from 'styled-components';
import { View, TouchableOpacity, Text, Card } from '../../core-ui';
import {
  THEME_COLOR,
  BACKGROUND_COLOR,
  WHITE,
  TEXT_COLOR,
  // SECONDARY_COLOR,
} from '../../constants/colors';
// import SvgPlus from '../../components/icons/plus';
import { FONT_SIZE_MEDIUM } from '../../constants/theme';

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
  return (
    <View style={{ marginBottom: 30 }}>
      <Card>
        <SpaceContainer flex>
          <AddressText>{address}</AddressText>
          {/* TODO */}
          {/* <NewRequestText>{request} new request</NewRequestText> */}
        </SpaceContainer>
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
    </View>
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
  margin: 18px;
  background-color: ${WHITE};
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
