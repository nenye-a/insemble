import React, { useState, useMemo, useEffect } from 'react';
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
import LandlordManageProperty from './LandlordProfile/LandlordManageProperty';
import { GET_PROPERTY_MATCHES_DATA } from '../graphql/queries/server/matches';
import { GET_PROPERTY } from '../graphql/queries/server/properties';
import { PropertyMatches, PropertyMatchesVariables } from '../generated/PropertyMatches';
import {
  Property,
  PropertyVariables,
  Property_property_space as Space,
} from '../generated/Property';
import { SelectedBrand } from './LandlordProfile/LandlordTenantMatches';

enum Tab {
  TENANT_MATCH_INDEX,
  LOCATION_DETAIL_INDEX,
  MANAGE_SPACE_INDEX,
  MANAGE_PROPERTY_INDEX,
}

type Params = {
  paramsId: string;
};

export default function LandlordPropertyDetails() {
  let history = useHistory();
  let params = useParams<Params>();
  let [selectedTabIndex, setSelectedTabIndex] = useState(Tab.TENANT_MATCH_INDEX);
  let [selectedSpaceIndex, setSelectedSpaceIndex] = useState(0);
  let [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  let [selectedBrand, setSelectedBrand] = useState<SelectedBrand>({
    matchId: null,
    tenantPhoto: '',
    matchScore: 0,
    brandId: '',
    contacts: { __typename: 'ReceiverContact', name: '', email: '', phone: '', role: '' },
    brandName: '',
    category: '',
  });
  let isTenantMatchSelected = selectedTabIndex === Tab.TENANT_MATCH_INDEX;
  let isLocationDetailSelected = selectedTabIndex === Tab.LOCATION_DETAIL_INDEX;
  let isManagePropertySelected = selectedTabIndex === Tab.MANAGE_PROPERTY_INDEX;
  let isManageSpaceSelected = selectedTabIndex === Tab.MANAGE_SPACE_INDEX;
  let [modalVisible, setModalVisible] = useState(false);
  let { data: propertyData, loading: propertyLoading } = useQuery<Property, PropertyVariables>(
    GET_PROPERTY,
    {
      variables: {
        propertyId: params.paramsId,
      },
    }
  );

  let { data, loading, error: propertyMatchesError, refetch: propertyMatchesRefetch } = useQuery<
    PropertyMatches,
    PropertyMatchesVariables
  >(GET_PROPERTY_MATCHES_DATA, {
    variables: { propertyId: params.paramsId, spaceId: selectedSpace?.id || '' },
    skip: !selectedSpace?.id || !params.paramsId,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });

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

  useEffect(() => {
    if (propertyData) {
      let { space } = propertyData.property;
      if (space.length === 0) {
        setSelectedTabIndex(Tab.LOCATION_DETAIL_INDEX);
      }
      if (space.length <= selectedSpaceIndex) {
        setSelectedSpaceIndex(selectedSpaceIndex - 1 || 0);
      }
      if (space.length > 0 && !selectedSpace) {
        setSelectedSpace(space[0]);
      }
    }
  }, [propertyData, selectedSpaceIndex, selectedSpace]);

  return (
    <View flex>
      {!propertyLoading && propertyData && (
        <PropertyDetailHeader
          spaces={propertyData.property.space}
          address={propertyData.property.location.address}
          request="1" // TODO
          selectedSpaceIndex={selectedSpaceIndex}
          onPressSpace={(index: number) => {
            if (propertyData?.property.space[index]) {
              setSelectedSpace(propertyData.property.space[index]);
            }
            setSelectedSpaceIndex(index);
          }}
          onPressAdd={() => {
            history.push(`/landlord/add-space/step-1`, {
              propertyId: params.paramsId,
              address: propertyData?.property.location.address || '',
            });
          }}
        />
      )}

      <PropertyDetailsCard>
        <PropertyDetailSegment
          selectedTabIndex={selectedTabIndex}
          onPress={(index: number) => setSelectedTabIndex(index)}
          noSpaces={propertyData?.property.space.length === 0}
        />
        {isTenantMatchSelected ? (
          <ContentWrapper>
            <LandlordTenantMatches
              tier={selectedSpace?.tier}
              loading={loading}
              matchResult={propertyMatches}
              error={propertyMatchesError}
              refetch={propertyMatchesRefetch}
              onPress={(selectedBrand) => {
                setSelectedBrand(selectedBrand);
                setModalVisible(true);
              }}
            />
          </ContentWrapper>
        ) : isLocationDetailSelected ? (
          <LandlordLocationDetails />
        ) : isManageSpaceSelected ? (
          <LandlordManageSpace spaceIndex={selectedSpaceIndex} propertyId={params.paramsId} />
        ) : isManagePropertySelected ? (
          <LandlordManageProperty />
        ) : null}
      </PropertyDetailsCard>
      {selectedSpace && (
        <TenantDeepDiveModal
          brand={selectedBrand}
          spaceId={selectedSpace.id}
          propertyId={params.paramsId}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      )}
    </View>
  );
}

const ContentWrapper = styled(View)`
  height: 70vh;
  overflow-y: scroll;
`;

const PropertyDetailsCard = styled(Card)`
  overflow: visible;
`;
