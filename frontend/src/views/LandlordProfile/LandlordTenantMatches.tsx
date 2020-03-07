import React, { ComponentProps } from 'react';
import styled from 'styled-components';

import { View, Text, TouchableOpacity } from '../../core-ui';
import imgPlaceholder from '../../assets/images/image-placeholder.jpg';
import {
  FONT_WEIGHT_MEDIUM,
  FONT_SIZE_LARGE,
  FONT_WEIGHT_HEAVY,
  FONT_SIZE_SMALL,
  DEFAULT_BORDER_RADIUS,
} from '../../constants/theme';
import { DARK_TEXT_COLOR, WHITE, SECONDARY_COLOR, THEME_COLOR } from '../../constants/colors';
import { PropertyMatches_propertyMatches as PropertyMatchesProps } from '../../generated/PropertyMatches';
import { EmptyDataComponent } from '../../components';
import { roundDecimal } from '../../utils';

type Props = {
  onPress: (selectedBrandId: string) => void;
  matchResult?: Array<PropertyMatchesProps>;
};

export default function LandlordTenantMatches({ onPress, matchResult }: Props) {
  return (
    <Container flex>
      {!matchResult ? (
        <EmptyDataComponent />
      ) : (
        matchResult &&
        matchResult.map((item, index) => {
          return (
            <TenantCard
              key={index}
              isInterested={item.interested}
              onPress={() => onPress(item.brandId)}
            >
              {item.interested ? (
                <InterestedContainer>
                  <InterestedText>Interested</InterestedText>
                </InterestedContainer>
              ) : null}
              <Image src={item.pictureUrl || imgPlaceholder} />
              <DescriptionContainer>
                <RowedView flex>
                  <View>
                    <CardTitle>{item.name}</CardTitle>
                    <CardCategoryText>{item.category}</CardCategoryText>
                  </View>
                  <View>
                    <CardPercentage>{roundDecimal(item.matchValue)}%</CardPercentage>
                    <Text>Match</Text>
                  </View>
                </RowedView>
                <CardExistingLocationText>
                  {item.numExistingLocations} existing locations
                </CardExistingLocationText>
              </DescriptionContainer>
            </TenantCard>
          );
        })
      )}
    </Container>
  );
}

const Image = styled.img`
  height: 120px;
  object-fit: cover;
`;

const RowedView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin: 6px 0;
`;

const Container = styled(RowedView)`
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const InterestedText = styled(Text)`
  color: ${WHITE};
  align-self: center;
`;

type TenantCardProps = ComponentProps<typeof TouchableOpacity> & {
  isInterested: boolean;
};

const TenantCard = styled(TouchableOpacity)<TenantCardProps>`
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
  min-height: 200px;
  height: fit-content;
  box-shadow: ${(props) =>
    props.isInterested ? `0px 0px 10px 0px ${SECONDARY_COLOR}` : undefined};
`;

const InterestedContainer = styled(View)`
  flex: 1;
  width: 100%;
  position: absolute;
  background-color: ${THEME_COLOR};
  align-items: center;
  justify-content: center;
  padding: 2px 0;
`;

const DescriptionContainer = styled(View)`
  padding: 12px;
`;

const CardTitle = styled(Text)`
  color: ${THEME_COLOR};
  font-weight: ${FONT_WEIGHT_MEDIUM};
`;

const CardPercentage = styled(Text)`
  color: ${THEME_COLOR};
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
