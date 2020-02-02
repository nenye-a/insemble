import React from 'react';
import styled from 'styled-components';
import { View, Text, Card, TouchableOpacity } from '../../core-ui';
import { THEME_COLOR } from '../../constants/colors';
import { FONT_SIZE_SMALL, FONT_SIZE_XSMALL, FONT_WEIGHT_MEDIUM } from '../../constants/theme';
import insembleIcon from '../../assets/images/insemble-i-logo.svg';

type Props = {
  photo: string;
  address: string;
  price: number;
  area: number;
  propertyType: string;
  onPress: () => void;
};

export default function AvailablePropertyCard(props: Props) {
  let { photo, address, price, area, propertyType, onPress } = props;
  return (
    <Container>
      <TouchableOpacity onPress={onPress}>
        <Photo src={photo} alt="property-photo" />
        <DescriptionContainer flex>
          <UpperDescriptionContainer flex>
            <Text color={THEME_COLOR} fontSize={FONT_SIZE_SMALL}>
              {address}
            </Text>
            <Icon src={insembleIcon} alt="insemble-icon" />
          </UpperDescriptionContainer>
          <LowerDescriptionContainer flex>
            <RowedFlex flex>
              <Text fontWeight={FONT_WEIGHT_MEDIUM}>${price}</Text>
              <Text fontSize={FONT_SIZE_XSMALL}>/sqft yearly</Text>
            </RowedFlex>
            <RowedFlex flex>
              <Text fontWeight={FONT_WEIGHT_MEDIUM}>{area}</Text>
              <Text fontSize={FONT_SIZE_XSMALL}>sqft</Text>
            </RowedFlex>
            <RowedFlex flex>
              <Text fontWeight={FONT_WEIGHT_MEDIUM}>{propertyType}</Text>
            </RowedFlex>
          </LowerDescriptionContainer>
        </DescriptionContainer>
      </TouchableOpacity>
    </Container>
  );
}

const Icon = styled.img`
  height: 24px;
`;
const Photo = styled.img`
  height: 120px;
  object-fit: cover;
`;

const DescriptionContainer = styled(View)`
  padding: 14px 16px;
  flex-direction: column;
`;

const Container = styled(Card)`
  &:not(:first-child) {
    margin-top: 12px;
  }
`;

const LowerDescriptionContainer = styled(View)`
  margin-top: 6px;
  flex-direction: row;
`;

const UpperDescriptionContainer = styled(View)`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;

const RowedFlex = styled(View)`
  flex-direction: row;
  align-items: baseline;
`;
