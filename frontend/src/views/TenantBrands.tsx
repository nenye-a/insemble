import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { GoogleMap, withGoogleMap } from 'react-google-maps';
import HeatMapLayer from 'react-google-maps/lib/components/visualization/HeatmapLayer';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Popup } from '../components';

import {
  View,
  Card,
  Text,
  PillButton,
  Button,
  TouchableOpacity,
  LoadingIndicator,
  Alert,
} from '../core-ui';
import { GET_USER_STATE } from '../graphql/queries/client/userState';
import { GET_BRANDS, DELETE_BRAND } from '../graphql/queries/server/brand';
import { DEFAULT_BORDER_RADIUS, FONT_SIZE_SMALL, FONT_WEIGHT_MEDIUM } from '../constants/theme';
import { WHITE, THEME_COLOR } from '../constants/colors';
import useGoogleMaps from '../utils/useGoogleMaps';
import SvgPlus from '../components/icons/plus';
import { TenantTier } from '../generated/globalTypes';
import { GetBrands } from '../generated/GetBrands';
import { MAP_DEFAULT_CENTER } from '../constants/googleMaps';
import SvgCircleClose from '../components/icons/circle-close';
import { DeleteBrand, DeleteBrandVariables } from '../generated/DeleteBrand';
import UpgradeToAccess from '../components/UpgradeToAccess';

type HeatmapProps = {
  heatmapData: google.maps.MVCArray<google.maps.visualization.WeightedLocation>;
  brandId?: string;
};

export default () => {
  let { data, loading } = useQuery<GetBrands>(GET_BRANDS);
  let [removeConfirmationVisible, setRemoveConfirmationVisible] = useState(false);
  let history = useHistory();
  let { data: userData, refetch } = useQuery(GET_USER_STATE, {
    notifyOnNetworkStatusChange: true,
  });
  let [selectedBrandId, setSelectedBrandId] = useState('');
  let { isLoading: googleLoading } = useGoogleMaps();
  let [removeBrand, { error: removeBrandError, loading: removeBrandLoading }] = useMutation<
    DeleteBrand,
    DeleteBrandVariables
  >(DELETE_BRAND);
  useEffect(() => {
    let { tier, trial } = userData.userState;
    if (!tier || !trial) {
      refetch();
    }
  }, [userData.userState, refetch]);
  let { tier, trial } = userData.userState;
  let isPro = trial || tier === TenantTier.PROFESSIONAL;
  let closeDeleteConfirmation = () => {
    setRemoveConfirmationVisible(false);
  };
  let onRemovePress = () => {
    if (selectedBrandId) {
      removeBrand({
        variables: {
          brandId: selectedBrandId,
        },
        refetchQueries: [{ query: GET_BRANDS }],
        awaitRefetchQueries: true,
      });
      setRemoveConfirmationVisible(false);
      setSelectedBrandId('');
    }
  };

  return (
    <View flex>
      <Popup
        visible={removeConfirmationVisible}
        title="Remove Brand"
        bodyText="Are you sure you want to remove this brand?"
        buttons={[
          { text: 'Yes', onPress: onRemovePress },
          { text: 'No', onPress: closeDeleteConfirmation },
        ]}
      />
      <Alert visible={!!removeBrandError} text={removeBrandError?.message || ''} />
      {loading || googleLoading || removeBrandLoading ? (
        <LoadingIndicator />
      ) : (
        data &&
        data.brands.map((brandData, index) => {
          let { name, categories, matchingLocations, id, locked } = brandData;
          let heatmapData = ((matchingLocations
            ? matchingLocations.map(({ lat, lng, match }) => {
                return {
                  location: new google.maps.LatLng(lat, lng),
                  weight: match,
                };
              })
            : []) as unknown) as google.maps.MVCArray<google.maps.visualization.WeightedLocation>;
          return (
            <View key={index}>
              <TouchableOpacity style={{ marginBottom: 24 }} disabled={locked}>
                <HistoryContainer>
                  <LeftContainer
                    flex
                    onClick={() => {
                      history.push(`/map/${id}`);
                    }}
                  >
                    <RowedView>
                      <Text>Brand Name</Text>
                      <Text>{name}</Text>
                    </RowedView>
                    <RowedView>
                      <Text>Categories</Text>
                      <PillContainer>
                        {categories &&
                          categories.map((category, idx) => (
                            <Pill disabled key={index + '_' + idx} primary>
                              {category}
                            </Pill>
                          ))}
                      </PillContainer>
                    </RowedView>
                    <EditButton
                      stopPropagation={true}
                      mode="withShadow"
                      text="Edit Brand"
                      textProps={{ fontSize: FONT_SIZE_SMALL, fontWeight: FONT_WEIGHT_MEDIUM }}
                      onPress={() => {
                        history.push(`/user/brands/${id}`, {
                          ...brandData,
                        });
                      }}
                    />
                  </LeftContainer>
                  <HeatmapPlaceholder heatmapData={heatmapData} brandId={id} />
                </HistoryContainer>
              </TouchableOpacity>
              <RemoveButton
                onPress={() => {
                  setRemoveConfirmationVisible(true);
                  setSelectedBrandId(brandData.id);
                }}
              >
                <SvgCircleClose />
              </RemoveButton>
            </View>
          );
        })
      )}
      <View>
        <AddButton
          onPress={() => {
            isPro ? (
              history.push('/new-brand')
            ) : (
              <UpgradeToAccess
                title="UpgradeNow"
                text={`Looks like your trial has ended, but it's easy to get back up and running.`}
                onPress={() => history.push('/user/plan')}
                buttonText="Upgrade to Add"
              />
            );
          }}
        >
          <SvgPlus style={{ marginRight: 8, color: THEME_COLOR }} />
          <Text color={THEME_COLOR}>New Retailer or Restaurant</Text>
        </AddButton>
      </View>
    </View>
  );
};

let GoogleHeatmap = withGoogleMap((props: HeatmapProps) => {
  return (
    <GoogleMap
      defaultZoom={9}
      defaultCenter={MAP_DEFAULT_CENTER}
      defaultClickableIcons={false}
      defaultOptions={{
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: false,
        mapTypeControl: false,
        draggable: false,
      }}
    >
      <HeatMapLayer
        data={props.heatmapData}
        options={{ data: props.heatmapData, radius: 0.01, opacity: 1, dissipating: false }}
      />
    </GoogleMap>
  );
});

function HeatmapPlaceholder(props: HeatmapProps) {
  let { heatmapData, brandId } = props;
  let { isLoading } = useGoogleMaps();
  let history = useHistory();
  return isLoading ? null : (
    <GoogleHeatmap
      containerElement={
        <TouchableOpacity
          style={{ width: 200 }}
          onPress={() => {
            history.push(`/map/${brandId}`);
          }}
        />
      }
      mapElement={<View flex />}
      heatmapData={heatmapData}
    />
  );
}

const HistoryContainer = styled(Card)`
  flex-direction: row;
`;

const RowedView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin: 6px 0;
`;

const PillContainer = styled(View)`
  flex-direction: row;
`;

const Pill = styled(PillButton)`
  margin-left: 8px;
`;

const LeftContainer = styled(View)`
  padding: 12px 24px;
  height: 150px;
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

const EditButton = styled(Button)`
  width: 85px;
`;
const RemoveButton = styled(TouchableOpacity)`
  position: absolute;
  right: -36px;
  top: 63px;
`;
