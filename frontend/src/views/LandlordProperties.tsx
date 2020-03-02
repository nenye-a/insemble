import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { View, Card, Text, TouchableOpacity, LoadingIndicator } from '../core-ui';
import { DEFAULT_BORDER_RADIUS } from '../constants/theme';
import { WHITE, THEME_COLOR } from '../constants/colors';

import SvgPlus from '../components/icons/plus';
import imgPlaceholder from '../assets/images/image-placeholder.jpg';
import { GET_PROPERTIES } from '../graphql/queries/server/properties';
import { GetProperties } from '../generated/GetProperties';

export default function LandlordProperties() {
  let history = useHistory();
  let { data, loading } = useQuery<GetProperties>(GET_PROPERTIES);
  let properties = data?.properties;

  return (
    <View flex>
      {loading && !data ? (
        <LoadingIndicator />
      ) : (
        properties &&
        properties.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{ marginBottom: 24 }}
            onPress={() => {
              history.push(`/landlord/properties/${item.propertyId}`);
            }}
          >
            <Row>
              <LeftContainer flex>
                <RowedView>
                  <Text>Property</Text>
                  <Text>{item.name}</Text>
                </RowedView>
                <RowedView>
                  <Text>Number of Spaces</Text>
                  <Text>{item.space.length}</Text>
                </RowedView>
              </LeftContainer>
              {/* TODO: change to iframe */}
              <HeatMapImage src={imgPlaceholder} />
            </Row>
          </TouchableOpacity>
        ))
      )}

      <AddButton>
        <SvgPlus style={{ marginRight: 8, color: THEME_COLOR }} />
        <Text color={THEME_COLOR}>New Property</Text>
      </AddButton>
    </View>
  );
}

const Row = styled(Card)`
  flex-direction: row;
`;

const RowedView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin: 6px 0;
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
