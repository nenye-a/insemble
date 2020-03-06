import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { View, Card, LoadingIndicator } from '../core-ui';
import TenantDeepDiveModal from './DeepDivePage/TenantDeepDiveModal';
import {
  PropertyDetailHeader,
  PropertyDetailSegment,
  LandlordTenantMatches,
  LandlordLocationDetails,
  LandlordManageSpace,
} from './LandlordProfile';
import { PropertyMatches, PropertyMatchesVariables } from '../generated/PropertyMatches';
import { GET_PROPERTY_MATCHES_DATA } from '../graphql/queries/server/matches';

const SPACES = ['Space 1'];

enum Tab {
  TENANT_MATCH_INDEX,
  LOCATION_DETAIL_INDEX,
  MANAGE_SPACE_INDEX,
}

type Params = {
  propertyId: string;
};

export default function LandlordPropertyDetails() {
  let history = useHistory();
  let params = useParams<Params>();
  let [selectedBrandId, setSelectedBrandId] = useState('');
  let { address, spaces } = history.location.state;
  let [selectedTabIndex, setSelectedTabIndex] = useState(0);
  let [selectedSpaceIndex, setSelectedSpaceIndex] = useState(0);
  let [selectedSpaceId, setSelectedSpaceId] = useState(spaces[spaces.length - 1].id);
  let isTenantMatchSelected = selectedTabIndex === Tab.TENANT_MATCH_INDEX;
  let isLocationDetailSelected = selectedTabIndex === Tab.LOCATION_DETAIL_INDEX;
  let isManageSpaceSelected = selectedTabIndex === Tab.MANAGE_SPACE_INDEX;

  let [modalVisible, setModalVisible] = useState(false);

  let { data, loading } = useQuery<PropertyMatches, PropertyMatchesVariables>(
    GET_PROPERTY_MATCHES_DATA,
    { variables: { propertyId: params.propertyId } }
  );

  return (
    <View flex>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <>
          <PropertyDetailHeader
            spaces={SPACES}
            address={address}
            request="1" // TODO
            selectedSpaceIndex={selectedSpaceIndex}
            onPressSpace={(index: number) => {
              setSelectedSpaceId(spaces[index].id);
              setSelectedSpaceIndex(index);
            }}
            onPressAdd={() => {}} // TODO
          />
          <Card>
            <PropertyDetailSegment
              selectedTabIndex={selectedTabIndex}
              onPress={(index: number) => setSelectedTabIndex(index)}
            />
            {isTenantMatchSelected ? (
              <ContentWrapper>
                <LandlordTenantMatches
                  matchResult={data?.propertyMatches}
                  onPress={(selectedBrandId) => {
                    setModalVisible(true), setSelectedBrandId(selectedBrandId);
                  }}
                />
              </ContentWrapper>
            ) : isLocationDetailSelected ? (
              <LandlordLocationDetails />
            ) : isManageSpaceSelected ? (
              <LandlordManageSpace spaceId={selectedSpaceId} />
            ) : null}
          </Card>
        </>
      )}

      <TenantDeepDiveModal
        brandId={selectedBrandId}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const ContentWrapper = styled(View)`
  padding: 0 20px;
`;
