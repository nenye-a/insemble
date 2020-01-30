import React from 'react';
import styled from 'styled-components';
import { View, Text, Card } from '../core-ui';
import { FONT_WEIGHT_BOLD, FONT_SIZE_LARGE, FONT_SIZE_SMALL } from '../constants/theme';
import { THEME_COLOR } from '../constants/colors';
import { SAVED_PROPERTIES } from '../fixtures/dummyData';
import imgPlaceholder from '../assets/images/image-placeholder.jpg';
import SvgRent from '../components/icons/rent';
import SvgSqft from '../components/icons/sqft';

export default function TenantSavedProperties() {
  return (
    <Container flex>
      <Title>Saved Properties</Title>
      <TenantCardContainer>
        {SAVED_PROPERTIES.map((item, index) => (
          <TenantCard key={index}>
            <Image src={item.photo || imgPlaceholder} />
            <DescriptionContainer>
              <Text color={THEME_COLOR}>{item.address}</Text>
              <MatchPercentage color={THEME_COLOR} fontSize={FONT_SIZE_SMALL}>
                {item.matchPercentage} customer match
              </MatchPercentage>
              <RowedView flex>
                <RowedView flex>
                  <SvgRent />
                  <Text fontSize={FONT_SIZE_SMALL}>${item.price}</Text>
                </RowedView>
                <RowedView flex>
                  <SvgSqft />
                  <Text fontSize={FONT_SIZE_SMALL}>{item.sqft}sqft</Text>
                </RowedView>
              </RowedView>
            </DescriptionContainer>
          </TenantCard>
        ))}
      </TenantCardContainer>
    </Container>
  );
}

const Container = styled(Card)`
  padding: 12px 24px;
`;
const Title = styled(Text)`
  color: ${THEME_COLOR};
  font-weight: ${FONT_WEIGHT_BOLD};
  font-size: ${FONT_SIZE_LARGE};
  margin: 12px 0;
`;
const TenantCardContainer = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
`;
const TenantCard = styled(Card)`
  width: calc(33.33% - 11px);
  margin: 12px 16px 12px 0;
  &:nth-child(3n) {
    margin-right: 0;
  }
`;
const DescriptionContainer = styled(View)`
  padding: 12px;
`;
const Image = styled.img`
  height: 120px;
  object-fit: cover;
`;

const RowedView = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const MatchPercentage = styled(Text)`
  padding: 12px 0;
`;
