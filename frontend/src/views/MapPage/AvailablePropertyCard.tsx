import React from 'react';
import styled from 'styled-components';
import { View, Text, Card, TouchableOpacity } from '../../core-ui';
import { THEME_COLOR } from '../../constants/colors';
import {
  FONT_SIZE_SMALL,
  FONT_SIZE_XSMALL,
  FONT_WEIGHT_MEDIUM,
  FONT_WEIGHT_BOLD,
  FONT_SIZE_XLARGE,
  FONT_SIZE_MEDIUM,
} from '../../constants/theme';
import imgPlaceholder from '../../assets/images/image-placeholder.jpg';
import { roundDecimal } from '../../utils';

type Props = {
  photo: string;
  address: string;
  price: number | null;
  area: number;
  matchValue: number;
  onPress: () => void;
};

export default function AvailablePropertyCard(props: Props) {
  let { photo, address, price, area, matchValue, onPress } = props;
  return (
    <Container>
      <TouchableOpacity onPress={onPress}>
        <Photo src={photo || imgPlaceholder} alt="property-photo" />
        <DescriptionContainer flex>
          <View flex>
            <Text color={THEME_COLOR} fontSize={FONT_SIZE_SMALL}>
              {address}
            </Text>
            <LowerDescriptionContainer flex>
              <RowedFlexTwo>
                <Text fontWeight={FONT_WEIGHT_MEDIUM}>{price ? `$ ${price}` : 'NA'}</Text>
                <Text fontSize={FONT_SIZE_XSMALL}>/sqft yearly</Text>
              </RowedFlexTwo>
              <RowedFlex>
                <Text fontWeight={FONT_WEIGHT_MEDIUM}>{area}</Text>
                <Text fontSize={FONT_SIZE_XSMALL}>sqft</Text>
              </RowedFlex>
            </LowerDescriptionContainer>
          </View>
          <Text fontWeight={FONT_WEIGHT_BOLD} fontSize={FONT_SIZE_XLARGE} color={THEME_COLOR}>
            {roundDecimal(matchValue, 0)}
            <Text fontWeight={FONT_WEIGHT_BOLD} fontSize={FONT_SIZE_MEDIUM} color={THEME_COLOR}>
              %
            </Text>
          </Text>
        </DescriptionContainer>
      </TouchableOpacity>
    </Container>
  );
}

const Photo = styled.img`
  height: 120px;
  object-fit: cover;
`;

const DescriptionContainer = styled(View)`
  padding: 14px 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Container = styled(Card)`
  &:not(:first-child) {
    margin-top: 12px;
  }
`;

const LowerDescriptionContainer = styled(View)`
  margin-top: 6px;
  flex-direction: row;
  align-items: center;
`;

const RowedFlex = styled(View)`
  flex-direction: row;
  align-items: baseline;
  flex: 1;
`;

const RowedFlexTwo = styled(RowedFlex)`
  flex: 2;
`;
