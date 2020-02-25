import React from 'react';
import styled from 'styled-components';
import { LANDLORD_TENANT_MATCHES } from '../../fixtures/dummyData';
import { View, Text, TouchableOpacity } from '../../core-ui';
import imgPlaceholder from '../../assets/images/image-placeholder.jpg';
import {
  FONT_WEIGHT_MEDIUM,
  FONT_SIZE_LARGE,
  FONT_WEIGHT_HEAVY,
  FONT_SIZE_SMALL,
  DEFAULT_BORDER_RADIUS,
} from '../../constants/theme';
import {
  PURPLE,
  DARK_TEXT_COLOR,
  WHITE,
  SECONDARY_COLOR,
  THEME_COLOR,
} from '../../constants/colors';

type Props = {
  onPress: () => void;
};
export default function LandlordTenantMatches({ onPress }: Props) {
  return (
    <RowedView flex>
      {LANDLORD_TENANT_MATCHES.map((item, index) => {
        return (
          <TenantCard key={index} onPress={onPress}>
            <InterestedContainer>
              <InterestedText>Interested</InterestedText>
            </InterestedContainer>
            <Image src={imgPlaceholder} />
            <DescriptionContainer>
              <RowedView flex>
                <View>
                  <CardTitle>{item.tenantName}</CardTitle>
                  <CardCategoryText>{item.tenantCategory}</CardCategoryText>
                </View>
                <View>
                  <CardPercentage>{item.percentageMatch}%</CardPercentage>
                  <Text>Match</Text>
                </View>
              </RowedView>
              <CardExistingLocationText>
                {item.existingLocation} existing locations
              </CardExistingLocationText>
            </DescriptionContainer>
          </TenantCard>
        );
      })}
    </RowedView>
  );
}

const Image = styled.img`
  height: 120px;
  object-fit: cover;
`;

const InterestedContainer = styled(View)`
  background-color: ${THEME_COLOR};
  align-items: center;
  justify-content: center;
  padding: 2px 0;
  display: none;
  &:hover {
    display: block;
  }
`;
const RowedView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin: 6px 0;
`;

const InterestedText = styled(Text)`
  color: ${WHITE};
  align-self: center;
`;
const TenantCard = styled(TouchableOpacity)`
  border-radius: ${DEFAULT_BORDER_RADIUS};
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
  background-color: ${WHITE};
  overflow: hidden;
  background-color: ${WHITE};
  width: calc(33.33% - 11px);
  margin: 12px 16px 12px 0;
  &:nth-child(3n) {
    margin-right: 0;
  }
  height: fit-content;
  &:hover {
    border: 1px solid ${SECONDARY_COLOR};
    box-shadow: 0px 0px 6px 0px ${SECONDARY_COLOR};
  }
`;
// const TenantCard = styled(Card)`
//   width: calc(33.33% - 11px);
//   margin: 12px 16px 12px 0;
//   &:nth-child(3n) {
//     margin-right: 0;
//   }
//   height: fit-content;
// `;
const DescriptionContainer = styled(View)`
  padding: 12px;
`;

const CardTitle = styled(Text)`
  color: ${PURPLE};
  font-weight: ${FONT_WEIGHT_MEDIUM};
`;

const CardPercentage = styled(Text)`
  color: ${PURPLE};
  font-size: ${FONT_SIZE_LARGE};
  font-weight: ${FONT_WEIGHT_HEAVY};
`;

const CardCategoryText = styled(Text)`
  color: ${DARK_TEXT_COLOR};
  font-size: ${FONT_SIZE_SMALL};
`;

const CardExistingLocationText = styled(Text)`
  font-size: ${FONT_SIZE_SMALL};
`;
