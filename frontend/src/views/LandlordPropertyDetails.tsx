import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { View, Card } from '../core-ui';
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
import LandlordManageProperty from './LandlordProfile/LandlordManageProperty';

const SPACES = ['Space 1'];

enum Tab {
  TENANT_MATCH_INDEX,
  LOCATION_DETAIL_INDEX,
  MANAGE_SPACE_INDEX,
  MANAGE_PROPERTY_INDEX,
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
  let [selectedTenantPhoto, setSelectedTenantPhoto] = useState('');
  let isTenantMatchSelected = selectedTabIndex === Tab.TENANT_MATCH_INDEX;
  let isLocationDetailSelected = selectedTabIndex === Tab.LOCATION_DETAIL_INDEX;
  let isManagePropertySelected = selectedTabIndex === Tab.MANAGE_PROPERTY_INDEX;
  let isManageSpaceSelected = selectedTabIndex === Tab.MANAGE_SPACE_INDEX;
  let [modalVisible, setModalVisible] = useState(false);
  let { data, loading } = useQuery<PropertyMatches, PropertyMatchesVariables>(
    GET_PROPERTY_MATCHES_DATA,
    { variables: { propertyId: params.propertyId, spaceId: selectedSpaceId } }
  );

  let propertyMatches = useMemo(() => {
    if (!data) {
      return data;
    }
    return data.propertyMatches.sort(
      (
        { matchValue: matchValueA, numExistingLocations: numExistingLocationsA },
        { matchValue: matchValueB, numExistingLocations: numExistingLocationsB }
      ) => {
        let sortValue = matchValueB - matchValueA;
        if (sortValue === 0) {
          sortValue = numExistingLocationsB - numExistingLocationsA;
        }
        return sortValue;
      }
    );
  }, [data]);

  return (
    <View flex>
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
      <PropertyDetailsCard>
        <PropertyDetailSegment
          selectedTabIndex={selectedTabIndex}
          onPress={(index: number) => setSelectedTabIndex(index)}
        />
        {isTenantMatchSelected ? (
          <ContentWrapper>
            <LandlordTenantMatches
              loading={loading}
              matchResult={propertyMatches}
              onPress={(selectedBrandId, tenantPhoto) => {
                setModalVisible(true),
                  setSelectedBrandId(selectedBrandId),
                  setSelectedTenantPhoto(tenantPhoto);
              }}
            />
          </ContentWrapper>
        ) : isLocationDetailSelected ? (
          <LandlordLocationDetails />
        ) : isManageSpaceSelected ? (
          <LandlordManageSpace spaceId={selectedSpaceId} />
        ) : isManagePropertySelected ? (
          <LandlordManageProperty />
        ) : null}
      </PropertyDetailsCard>
      <TenantDeepDiveModal
        brandId={selectedBrandId}
        propertyId={params.propertyId}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        tenantPhoto={selectedTenantPhoto}
      />
    </View>
  );
}

const ContentWrapper = styled(View)`
  padding: 0 20px;
  height: 70vh;
  overflow-y: scroll;
`;

const PropertyDetailsCard = styled(Card)`
  overflow: visible;
`;
