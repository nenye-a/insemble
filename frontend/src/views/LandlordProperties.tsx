import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory, Redirect } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { View, Card, Text, TouchableOpacity, LoadingIndicator, Alert, Button } from '../core-ui';
import { DEFAULT_BORDER_RADIUS } from '../constants/theme';
import { WHITE, THEME_COLOR } from '../constants/colors';

import SvgPlus from '../components/icons/plus';
import SvgCircleClose from '../components/icons/circle-close';
import { GET_PROPERTIES, DELETE_PROPERTY } from '../graphql/queries/server/properties';
import { GetProperties } from '../generated/GetProperties';
import { MAPS_IFRAME_URL_SEARCH } from '../constants/googleMaps';
import { Popup, EmptyDataComponent } from '../components';
import { DeleteProperty, DeletePropertyVariables } from '../generated/DeleteProperty';

export default function LandlordProperties() {
  let history = useHistory();
  let [removeConfirmationVisible, setRemoveConfirmationVisible] = useState(false);
  let [selectedPropertyId, setSelectedPropertyId] = useState('');
  let { data, loading } = useQuery<GetProperties>(GET_PROPERTIES);
  let [
    removeProperty,
    { error: removePropertyError, loading: removePropertyLoading },
  ] = useMutation<DeleteProperty, DeletePropertyVariables>(DELETE_PROPERTY);
  let properties = data?.properties;
  let unlockedProperty = properties?.find((property) => !property.locked);

  let closeDeleteConfirmation = () => {
    setRemoveConfirmationVisible(false);
  };

  let onRemovePress = () => {
    if (selectedPropertyId) {
      removeProperty({
        variables: {
          propertyId: selectedPropertyId,
        },
        refetchQueries: [{ query: GET_PROPERTIES }],
        awaitRefetchQueries: true,
      });
      setRemoveConfirmationVisible(false);
      setSelectedPropertyId('');
    }
  };

  if (!loading && data && history.location.state?.signedIn && unlockedProperty) {
    let { id } = unlockedProperty;
    return (
      <Redirect
        to={{
          pathname: `/landlord/properties/${id}`,
        }}
      />
    );
  }

  return (
    <View flex>
      <Popup
        visible={removeConfirmationVisible}
        title="Remove Property"
        bodyText="Are you sure you want to remove this property?"
        buttons={[
          { text: 'Yes', onPress: onRemovePress },
          { text: 'No', onPress: closeDeleteConfirmation },
        ]}
      />
      <Alert visible={!!removePropertyError} text={removePropertyError?.message || ''} />
      {(loading && !data) || removePropertyLoading ? (
        <LoadingIndicator />
      ) : properties ? (
        properties.length > 0 ? (
          properties.map((item, index) => {
            let { location } = item;
            let { lat, lng } = location;
            let iframeSource = MAPS_IFRAME_URL_SEARCH + '&q=' + lat + ', ' + lng;
            let content = (
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
                  <AddSpaceButton
                    text="Add Space"
                    size="small"
                    onPress={() => {
                      history.push(`/landlord/add-space/step-1`, {
                        propertyId: item.id,
                        address: item.location.address,
                      });
                    }}
                    onStopPropagation={true}
                  />
                </LeftContainer>
                <Iframe src={iframeSource} />
              </Row>
            );
            return (
              <View key={index} style={{ flexDirection: 'row', marginBottom: 24 }}>
                <TouchableOpacity
                  flex
                  disabled={item.locked}
                  onPress={() => {
                    history.push(`/landlord/properties/${item.id}`, {});
                  }}
                >
                  {content}
                </TouchableOpacity>
                <RemoveButton
                  onPress={() => {
                    setRemoveConfirmationVisible(true);
                    setSelectedPropertyId(item.id);
                  }}
                >
                  <SvgCircleClose />
                </RemoveButton>
              </View>
            );
          })
        ) : (
          <EmptyDataCard>
            <EmptyDataComponent text="No Property Found" style={{ flex: 'none' }} />
          </EmptyDataCard>
        )
      ) : null}
      <AddButton
        onPress={() => {
          history.push('/landlord/new-property/step-1');
        }}
      >
        <SvgPlus style={{ marginRight: 8, color: THEME_COLOR }} />
        <Text color={THEME_COLOR}>New Property</Text>
      </AddButton>
    </View>
  );
}

const Row = styled(Card)`
  flex-direction: row;
`;

const Iframe = styled.iframe`
  width: 200px;
  border: none;
  pointer-events: none;
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

const AddSpaceButton = styled(Button)`
  margin-top: 8px;
  align-self: flex-start;
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

const RemoveButton = styled(TouchableOpacity)`
  position: absolute;
  right: -36px;
  top: 63px;
`;

const EmptyDataCard = styled(Card)`
  padding: 24px;
  margin-bottom: 24px;
`;
