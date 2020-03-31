import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';

import { View, Text, Card, LoadingIndicator, TouchableOpacity } from '../core-ui';
import LocationDeepDiveModal from './DeepDivePage/DeepDiveModal';
import { EmptyDataComponent, ErrorComponent } from '../components';
import { FONT_WEIGHT_BOLD, FONT_SIZE_LARGE, FONT_SIZE_SMALL } from '../constants/theme';
import { THEME_COLOR } from '../constants/colors';
import imgPlaceholder from '../assets/images/image-placeholder.jpg';
import SvgRent from '../components/icons/rent';
import SvgSqft from '../components/icons/sqft';
import {
  SavedSpaces,
  SavedSpaces_savedProperties as SavedProperty,
} from '../generated/SavedSpaces';
import { GET_SAVED_SPACES } from '../graphql/queries/server/space';

export default function TenantSavedProperties() {
  let { data, loading, refetch } = useQuery<SavedSpaces>(GET_SAVED_SPACES);
  let [deepDiveModalVisible, setDeepDiveModalVisible] = useState(false);
  let [selectedProperty, setSelectedProperty] = useState<SavedProperty | null>(null);

  return (
    <Container flex>
      <Title>Saved Properties</Title>
      {loading ? (
        <LoadingIndicator />
      ) : data?.savedProperties ? (
        data.savedProperties.length > 0 ? (
          <TenantCardContainer>
            {data.savedProperties.map((item, index) => (
              <Touchable
                key={index}
                onPress={() => {
                  setSelectedProperty(item);
                  console.log(item);
                  setDeepDiveModalVisible(true);
                }}
              >
                <Card>
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
                </Card>
              </Touchable>
            ))}
          </TenantCardContainer>
        ) : (
          <EmptyDataComponent />
        )
      ) : (
        <ErrorComponent onRetry={refetch} />
      )}
      {selectedProperty && (
        <LocationDeepDiveModal
          visible={deepDiveModalVisible}
          onClose={() => {
            setDeepDiveModalVisible(false);
          }}
          // TODO: make this optional on deep dive
          targetNeighborhood=""
          categories={[]}
          propertyId={selectedProperty.propertyId}
          brandId={selectedProperty.brandId}
          address={selectedProperty.address}
          sqft={selectedProperty.sqft}
        />
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
const Touchable = styled(TouchableOpacity)`
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
