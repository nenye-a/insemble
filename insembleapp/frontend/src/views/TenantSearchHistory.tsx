import React from 'react';
import styled from 'styled-components';

import { View, Card, Text, PillButton, TouchableOpacity } from '../core-ui';
import { DEFAULT_BORDER_RADIUS } from '../constants/theme';
import { WHITE, THEME_COLOR } from '../constants/colors';
import { SAVED_SEARCHES } from '../fixtures/dummyData';
import SvgPlus from '../components/icons/plus';
import imgPlaceholder from '../../assets/images/image-placeholder.jpg';

export default function TenantSearchHistory() {
  return (
    <View flex>
      {SAVED_SEARCHES.map((item, index) => (
        <TouchableOpacity key={index} style={{ marginBottom: 24 }} onPress={() => {}}>
          <HistoryContainer>
            <LeftContainer flex>
              <RowedView>
                <Text>Brand Name</Text>
                <Text>{item.brandName}</Text>
              </RowedView>
              <RowedView>
                <Text>Categories</Text>
                <PillContainer>
                  {item.categories &&
                    item.categories.map((category, idx) => (
                      <Pill disabled key={index + '_' + idx} primary>
                        {category}
                      </Pill>
                    ))}
                </PillContainer>
              </RowedView>
            </LeftContainer>
            <HeatMapImage src={imgPlaceholder} />
          </HistoryContainer>
        </TouchableOpacity>
      ))}
      <AddButton>
        <SvgPlus style={{ marginRight: 8, color: THEME_COLOR }} />
        <Text color={THEME_COLOR}>New Retailer or Restaurant</Text>
      </AddButton>
    </View>
  );
}

const HistoryContainer = styled(Card)`
  flex-direction: row;
`;

const RowedView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin: 6px 0;
`;

const PillContainer = styled(View)`
  flex-direction: row;
`;

const Pill = styled(PillButton)`
  margin-left: 8px;
`;

const LeftContainer = styled(View)`
  padding: 12px 24px;
  height: 150px;
`;

const HeatMapImage = styled.img`
  width: 200px;
  object-fit: contain;
`;

const AddButton = styled(TouchableOpacity)`
  border-radius: ${DEFAULT_BORDER_RADIUS};
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
  background-color: ${WHITE};
  overflow: hidden;
  background-color: ${WHITE};
  justify-content: center;
  align-items: center;
  height: 48px;
  flex-direction: row;
`;
