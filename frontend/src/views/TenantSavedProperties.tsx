import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';

import { View, Text, Card, LoadingIndicator } from '../core-ui';
import { EmptyDataComponent, ErrorComponent } from '../components';
import { FONT_WEIGHT_BOLD, FONT_SIZE_LARGE, FONT_SIZE_SMALL } from '../constants/theme';
import { THEME_COLOR } from '../constants/colors';
import imgPlaceholder from '../assets/images/image-placeholder.jpg';
import SvgRent from '../components/icons/rent';
import SvgSqft from '../components/icons/sqft';
import { SavedSpaces } from '../generated/SavedSpaces';
import { GET_SAVED_SPACES } from '../graphql/queries/server/space';

export default function TenantSavedProperties() {
  let { data, loading, refetch } = useQuery<SavedSpaces>(GET_SAVED_SPACES);
  return (
    <Container flex>
      <Title>Saved Properties</Title>
      {loading ? (
        <LoadingIndicator />
      ) : data?.savedProperties ? (
        data.savedProperties.length > 0 ? (
          <TenantCardContainer>
            {data.savedProperties.map((item, index) => (
              <TenantCard key={index}>
                <Image src={item.thumbnail || imgPlaceholder} />
                <DescriptionContainer>
                  <Text color={THEME_COLOR}>{item.address}</Text>
                  <MatchPercentage color={THEME_COLOR} fontSize={FONT_SIZE_SMALL}>
                    {item.matchValue}% customer match
                  </MatchPercentage>
                  <RowedView flex>
                    <RowedView flex>
                      <SvgRent />
                      <Text fontSize={FONT_SIZE_SMALL}>${item.rent}</Text>
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
        ) : (
          <EmptyDataComponent />
        )
      ) : (
        <ErrorComponent onRetry={refetch} />
      )}
    </Container>
  );
}

const Container = styled(Card)`
  padding: 12px 24px;
  height: 80vh;
  overflow: scroll;
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
